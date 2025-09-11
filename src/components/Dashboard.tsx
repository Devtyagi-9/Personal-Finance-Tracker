import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  PlusCircle, 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  LogOut,
  Settings,
  BarChart3,
  Target,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Trash2
} from 'lucide-react';
import { AreaChart, Area, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import AddTransactionModal from './AddTransactionModal';
import BudgetModal from './BudgetModal';
import apiService, { DashboardData } from '../services/apiService';
import Loading from './Loading';

interface DashboardProps {
  onLogout: () => void;
}

interface Transaction {
  id: number;
  description: string;
  amount: number;
  category: string;
  transactionDate: string;
  type: 'INCOME' | 'EXPENSE';
  notes?: string;
}

interface Category {
  name: string;
  spent: number;
  budget: number;
  color: string;
}

export default function Dashboard({ onLogout }: DashboardProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState('This Month');
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deletingTransactionId, setDeletingTransactionId] = useState<number | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load transactions, budgets, and dashboard data in parallel
      const [transactionsData, budgetsData, dashboardData] = await Promise.all([
        apiService.getTransactions(),
        apiService.getBudgets(),
        apiService.getDashboardData()
      ]);

      // Convert API transactions to display format
      const formattedTransactions: Transaction[] = transactionsData.map(t => ({
        id: t.id!,
        description: t.description,
        amount: t.type === 'EXPENSE' ? -Math.abs(t.amount) : Math.abs(t.amount),
        category: t.category,
        transactionDate: t.transactionDate,
        type: t.type,
        notes: t.notes
      }));

      // Convert budgets to categories format
      const formattedCategories: Category[] = budgetsData.map((budget, index) => ({
        name: budget.category,
        spent: budget.spentAmount,
        budget: budget.budgetLimit,
        color: `bg-chart-${(index % 4) + 1}` // Cycle through chart colors
      }));

      setTransactions(formattedTransactions);
      setCategories(formattedCategories);
      setDashboardData(dashboardData);
    } catch (error: any) {
      console.error('Failed to load dashboard data:', error);
      // If authentication expired, logout the user
      if (error.message?.includes('Authentication expired') || error.message?.includes('Unauthorized')) {
        onLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  // Generate monthly chart data from transactions
  const generateMonthlyData = () => {
    if (transactions.length === 0) {
      return [];
    }

    const monthlyMap: { [key: string]: { income: number; expenses: number } } = {};
    
    transactions.forEach(transaction => {
      const date = new Date(transaction.transactionDate);
      const monthKey = date.toLocaleDateString('en-US', { month: 'short' });
      
      if (!monthlyMap[monthKey]) {
        monthlyMap[monthKey] = { income: 0, expenses: 0 };
      }
      
      if (transaction.type === 'INCOME') {
        monthlyMap[monthKey].income += transaction.amount;
      } else {
        monthlyMap[monthKey].expenses += Math.abs(transaction.amount);
      }
    });

    return Object.entries(monthlyMap).map(([month, data]) => ({
      month,
      income: data.income,
      expenses: data.expenses,
      net: data.income - data.expenses
    }));
  };

  // Generate pie chart data from transactions
  const generatePieChartData = () => {
    if (transactions.length === 0) {
      return [];
    }

    const categoryMap: { [key: string]: number } = {};
    
    transactions.forEach(transaction => {
      if (transaction.type === 'EXPENSE') {
        const amount = Math.abs(transaction.amount);
        categoryMap[transaction.category] = (categoryMap[transaction.category] || 0) + amount;
      }
    });

    const colors = ['#10b981', '#0066cc', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4', '#f97316', '#84cc16'];
    
    return Object.entries(categoryMap).map(([name, value], index) => ({
      name,
      value,
      color: colors[index % colors.length]
    }));
  };

  const monthlyData = generateMonthlyData();
  const pieChartData = generatePieChartData();

  const handleAddTransaction = async (newTransaction: Omit<Transaction, 'id'>) => {
    try {
      // Convert display format to API format
      const apiTransaction = {
        description: newTransaction.description,
        amount: Math.abs(newTransaction.amount), // API expects positive amounts
        category: newTransaction.category,
        transactionDate: newTransaction.transactionDate,
        type: newTransaction.type,
        notes: newTransaction.notes
      };

      await apiService.createTransaction(apiTransaction);
      
      // Reload dashboard data to get updated information
      await loadDashboardData();
    } catch (error: any) {
      console.error('Failed to add transaction:', error);
      
      // If it's an authentication error, let the user know and trigger logout
      if (error.message?.includes('Authentication expired')) {
        alert('Your session has expired. Please log in again.');
        onLogout();
        return;
      }
      
      // For other errors, show a user-friendly message
      alert('Failed to add transaction. Please try again.');
    }
  };

  const handleDeleteTransaction = async (transactionId: number, description: string) => {
    console.log('Delete button clicked for transaction:', transactionId, description);
    
    if (!confirm(`Are you sure you want to delete the transaction "${description}"? This action cannot be undone.`)) {
      console.log('Delete cancelled by user');
      return;
    }

    try {
      console.log('Starting delete process...');
      setDeletingTransactionId(transactionId);
      await apiService.deleteTransaction(transactionId);
      console.log('Delete successful, reloading data...');
      
      // Reload dashboard data to get updated information
      await loadDashboardData();
      console.log('Data reloaded successfully');
    } catch (error: any) {
      console.error('Failed to delete transaction:', error);
      
      // More specific error handling
      if (error.message?.includes('Authentication expired') || 
          error.message?.includes('Unauthorized') ||
          error.message?.includes('401')) {
        alert('Your session has expired. Please log in again.');
        onLogout();
        return;
      }
      
      // For other errors, show a user-friendly message
      alert(`Failed to delete transaction: ${error.message || 'Unknown error'}. Please try again.`);
    } finally {
      console.log('Clearing loading state...');
      setDeletingTransactionId(null);
    }
  };

  const handleUpdateBudgets = async (updatedCategories: Category[]) => {
    try {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear();
      
      // Get existing budgets from backend
      const existingBudgets = await apiService.getBudgetsByMonth(currentMonth, currentYear);
      
      // Get list of category names that should remain
      const updatedCategoryNames = new Set(updatedCategories.map(cat => cat.name));
      
      // Delete budgets for categories that were removed
      for (const existingBudget of existingBudgets) {
        if (!updatedCategoryNames.has(existingBudget.category) && existingBudget.id) {
          await apiService.deleteBudget(existingBudget.id);
        }
      }
      
      // Create or update budgets for remaining categories
      for (const category of updatedCategories) {
        // Only create budgets for categories that have a budget amount set
        if (category.budget > 0) {
          const budgetData = {
            category: category.name,
            budgetLimit: category.budget,
            month: currentMonth,
            year: currentYear
          };
          await apiService.createOrUpdateBudget(budgetData);
        }
      }
      
      // Reload dashboard data to get updated information
      await loadDashboardData();
    } catch (error: any) {
      console.error('Failed to update budgets:', error);
      
      // If it's an authentication error, let the user know and trigger logout
      if (error.message?.includes('Authentication expired')) {
        alert('Your session has expired. Please log in again.');
        onLogout();
        return;
      }
      
      // For other errors, show a user-friendly message
      alert('Failed to update budgets. Please try again.');
    }
  };

  if (loading) {
    return <Loading />;
  }

  const totalIncome = dashboardData?.totalIncome || 0;
  const totalExpenses = dashboardData?.totalExpenses || 0;
  const netBalance = dashboardData?.balance || 0;
  const monthlyGrowth = 12.5; // This could be calculated from historical data

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="flex justify-between items-center p-6 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="size-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center">
              <BarChart3 className="size-6 text-primary-foreground" />
            </div>
            <span className="text-xl text-[20px] text-primary">FinanceTracker</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => setIsBudgetModalOpen(true)}>
              <Target className="size-4 mr-2" />
              Budgets
            </Button>
            <Button size="sm" onClick={() => setIsAddTransactionOpen(true)}>
              <PlusCircle className="size-4 mr-2" />
              Add Transaction
            </Button>
            <Button variant="ghost" size="sm" onClick={onLogout}>
              <LogOut className="size-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="p-6 max-w-7xl mx-auto space-y-8">
        {/* Overview Cards */}
        <div className="grid md:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-primary bg-gradient-to-r from-primary/5 to-transparent">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm text-[14px] text-muted-foreground">Total Balance</CardTitle>
              <Wallet className="size-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl text-[30px] text-primary">
                              <div className="text-2xl font-bold text-foreground">
                ₹{netBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
              </div>
              <div className="flex items-center gap-1 mt-2">
                <ArrowUpRight className="size-3 text-success" />
                <span className="text-xs text-[12px] text-success">+{monthlyGrowth}%</span>
                <span className="text-xs text-[12px] text-muted-foreground">from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-success">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm text-[14px] text-muted-foreground">Total Income</CardTitle>
              <TrendingUp className="size-5 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl text-[30px] text-success">
                              <div className="text-lg font-semibold text-green-600">
                +₹{totalIncome.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
              </div>
              <p className="text-xs text-[12px] text-muted-foreground mt-2">
                This month
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-destructive">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm text-[14px] text-muted-foreground">Total Expenses</CardTitle>
              <TrendingDown className="size-5 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl text-[30px] text-destructive">
                              <div className="text-lg font-semibold text-red-600">
                -₹{totalExpenses.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
              </div>
              <p className="text-xs text-[12px] text-muted-foreground mt-2">
                This month
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-warning">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm text-[14px] text-muted-foreground">Savings Rate</CardTitle>
              <Target className="size-5 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl text-[30px] text-warning">
                {totalIncome > 0 ? Math.round((netBalance / totalIncome) * 100) : 0}%
              </div>
              <p className="text-xs text-[12px] text-muted-foreground mt-2">
                Of total income
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Monthly Trends */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="size-5" />
                    Monthly Trends
                  </CardTitle>
                  <CardDescription>Income vs Expenses over time</CardDescription>
                </div>
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="This Month">This Month</SelectItem>
                    <SelectItem value="Last 3 Months">Last 3 Months</SelectItem>
                    <SelectItem value="Last 6 Months">Last 6 Months</SelectItem>
                    <SelectItem value="This Year">This Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                {monthlyData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyData}>
                      <defs>
                        <linearGradient id="income" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="expenses" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="month" stroke="#64748b" />
                      <YAxis stroke="#64748b" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="income"
                        stroke="#10b981"
                        fillOpacity={1}
                        fill="url(#income)"
                        strokeWidth={2}
                      />
                      <Area
                        type="monotone"
                        dataKey="expenses"
                        stroke="#ef4444"
                        fillOpacity={1}
                        fill="url(#expenses)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <div className="text-center">
                      <BarChart3 className="size-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No transaction data available</p>
                      <p className="text-xs">Add some transactions to see trends</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Spending Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Spending Distribution</CardTitle>
              <CardDescription>Breakdown by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 mb-4">
                {pieChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: number) => [`₹${value.toFixed(2)}`, 'Amount']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <div className="text-center">
                      <Target className="size-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No expense data available</p>
                      <p className="text-xs">Add some expenses to see distribution</p>
                    </div>
                  </div>
                )}
              </div>
              {pieChartData.length > 0 && (
                <div className="space-y-2">
                  {pieChartData.map((entry) => (
                    <div key={entry.name} className="flex items-center justify-between text-sm text-[14px]">
                      <div className="flex items-center gap-2">
                        <div 
                          className="size-3 rounded-full" 
                          style={{ backgroundColor: entry.color }}
                        ></div>
                        <span>{entry.name}</span>
                      </div>
                      <span className="text-muted-foreground">₹{entry.value.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Detailed View */}
        <Tabs defaultValue="transactions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-96">
            <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
            <TabsTrigger value="budgets">Budget Overview</TabsTrigger>
          </TabsList>

          <TabsContent value="transactions" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Recent Transactions</CardTitle>
                    <CardDescription>Your latest financial activity</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setIsAddTransactionOpen(true)}>
                    <PlusCircle className="size-4 mr-2" />
                    Add New
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No transactions found.</p>
                      <p className="text-sm">Add some transactions to see them here.</p>
                    </div>
                  ) : (
                    transactions.slice(0, 8).map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 rounded-lg border bg-card/50">
                      <div className="flex items-center gap-4">
                        <div className={`size-10 rounded-full flex items-center justify-center ${
                          transaction.type === 'INCOME' ? 'bg-success/10' : 'bg-destructive/10'
                        }`}>
                          {transaction.type === 'INCOME' 
                            ? <ArrowUpRight className="size-5 text-success" />
                            : <ArrowDownRight className="size-5 text-destructive" />
                          }
                        </div>
                        <div>
                          <p className="text-[16px]">{transaction.description}</p>
                          <div className="flex items-center gap-2 text-sm text-[14px] text-muted-foreground">
                            <Calendar className="size-3" />
                            <span>{transaction.transactionDate}</span>
                            <Badge variant="secondary" className="text-xs text-[12px]">
                              {transaction.category}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className={`text-[16px] ${
                            transaction.type === 'INCOME' ? 'text-success' : 'text-destructive'
                          }`}>
                            {transaction.type === 'INCOME' ? '+' : ''}
                            ₹{Math.abs(transaction.amount).toFixed(2)}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleDeleteTransaction(transaction.id, transaction.description);
                          }}
                          disabled={deletingTransactionId === transaction.id}
                          className="h-9 w-9 p-0 text-muted-foreground hover:text-destructive disabled:opacity-50 cursor-pointer hover:bg-destructive/10"
                          title="Delete transaction"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="budgets" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Budget Overview</CardTitle>
                    <CardDescription>Track your spending against set budgets</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setIsBudgetModalOpen(true)}>
                    <Settings className="size-4 mr-2" />
                    Edit Budgets
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {categories.map((category) => {
                    const percentage = (category.spent / category.budget) * 100;
                    const isOverBudget = percentage > 100;
                    
                    return (
                      <div key={category.name} className="space-y-3">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div className={`size-4 rounded-full ${category.color}`}></div>
                            <span className="text-[16px]">{category.name}</span>
                          </div>
                          <div className="text-right">
                            <p className="text-[16px]">
                                                          <span className="text-sm text-muted-foreground">
                              ₹{category.spent.toFixed(2)} / ₹{category.budget.toFixed(2)}
                            </span>
                            </p>
                            <p className={`text-sm text-[14px] ${isOverBudget ? 'text-destructive' : 'text-muted-foreground'}`}>
                              {percentage.toFixed(0)}% used
                            </p>
                          </div>
                        </div>
                        <Progress 
                          value={Math.min(percentage, 100)} 
                          className={`h-2 ${isOverBudget ? '[&>div]:bg-destructive' : ''}`}
                        />
                        {isOverBudget && (
                          <p className="text-sm text-[14px] text-destructive">
                            Over budget by ₹{(category.spent - category.budget).toFixed(2)}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Modals */}
      <AddTransactionModal
        isOpen={isAddTransactionOpen}
        onClose={() => setIsAddTransactionOpen(false)}
        onAdd={handleAddTransaction}
      />

      <BudgetModal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
        categories={categories}
        onUpdateBudgets={handleUpdateBudgets}
      />

      {/* Footer */}
      <footer className="border-t bg-muted/50 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="size-6 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                <BarChart3 className="size-4 text-primary-foreground" />
              </div>
              <span className="text-[16px] text-primary">FinanceTracker</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-[14px] text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms</a>
              <a href="#" className="hover:text-foreground transition-colors">Support</a>
              <span>© 2025 FinanceTracker</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}