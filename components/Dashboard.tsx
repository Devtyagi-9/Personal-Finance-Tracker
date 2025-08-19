import { useState } from 'react';
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
  DollarSign, 
  CreditCard,
  Calendar,
  LogOut,
  Settings,
  BarChart3,
  Target,
  Wallet,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import AddTransactionModal from './AddTransactionModal';
import BudgetModal from './BudgetModal';

interface DashboardProps {
  onLogout: () => void;
}

interface Transaction {
  id: number;
  description: string;
  amount: number;
  category: string;
  date: string;
  type: 'income' | 'expense';
  notes?: string;
}

interface Category {
  name: string;
  spent: number;
  budget: number;
  color: string;
}

// Mock data for demonstration
const initialTransactions: Transaction[] = [
  { id: 1, description: 'Grocery Store', amount: -85.50, category: 'Food & Dining', date: '2025-01-15', type: 'expense' },
  { id: 2, description: 'Salary Deposit', amount: 3500.00, category: 'Salary', date: '2025-01-15', type: 'income' },
  { id: 3, description: 'Coffee Shop', amount: -12.75, category: 'Food & Dining', date: '2025-01-14', type: 'expense' },
  { id: 4, description: 'Gas Station', amount: -45.20, category: 'Transportation', date: '2025-01-14', type: 'expense' },
  { id: 5, description: 'Netflix Subscription', amount: -15.99, category: 'Entertainment', date: '2025-01-13', type: 'expense' },
  { id: 6, description: 'Freelance Project', amount: 850.00, category: 'Freelance', date: '2025-01-12', type: 'income' },
  { id: 7, description: 'Restaurant Dinner', amount: -67.30, category: 'Food & Dining', date: '2025-01-11', type: 'expense' },
  { id: 8, description: 'Uber Ride', amount: -23.45, category: 'Transportation', date: '2025-01-10', type: 'expense' },
];

const initialCategories: Category[] = [
  { name: 'Food & Dining', spent: 298.25, budget: 400, color: 'bg-chart-1' },
  { name: 'Transportation', spent: 165.80, budget: 200, color: 'bg-chart-2' },
  { name: 'Entertainment', spent: 89.50, budget: 150, color: 'bg-chart-3' },
  { name: 'Shopping', spent: 245.00, budget: 300, color: 'bg-chart-4' },
];

// Monthly data for charts
const monthlyData = [
  { month: 'Jul', income: 3200, expenses: 2400, net: 800 },
  { month: 'Aug', income: 3400, expenses: 2600, net: 800 },
  { month: 'Sep', income: 3100, expenses: 2800, net: 300 },
  { month: 'Oct', income: 3600, expenses: 2500, net: 1100 },
  { month: 'Nov', income: 3500, expenses: 2700, net: 800 },
  { month: 'Dec', income: 3800, expenses: 2900, net: 900 },
  { month: 'Jan', income: 4350, expenses: 2650, net: 1700 },
];

const pieChartData = [
  { name: 'Food & Dining', value: 298.25, color: '#10b981' },
  { name: 'Transportation', value: 165.80, color: '#0066cc' },
  { name: 'Entertainment', value: 89.50, color: '#8b5cf6' },
  { name: 'Shopping', value: 245.00, color: '#f59e0b' },
];

export default function Dashboard({ onLogout }: DashboardProps) {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [selectedPeriod, setSelectedPeriod] = useState('This Month');
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);

  const handleAddTransaction = (newTransaction: Omit<Transaction, 'id'>) => {
    const transaction: Transaction = {
      ...newTransaction,
      id: Math.max(...transactions.map(t => t.id)) + 1
    };
    setTransactions(prev => [transaction, ...prev]);
    
    // Update category spending if it's an expense
    if (transaction.type === 'expense') {
      setCategories(prev => prev.map(cat => 
        cat.name === transaction.category 
          ? { ...cat, spent: cat.spent + Math.abs(transaction.amount) }
          : cat
      ));
    }
  };

  const handleUpdateBudgets = (updatedCategories: Category[]) => {
    setCategories(updatedCategories);
  };

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = Math.abs(transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0));

  const netBalance = totalIncome - totalExpenses;
  const monthlyGrowth = 12.5; // Mock data

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
                ${netBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
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
                +${totalIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })}
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
                -${totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2 })}
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
                      formatter={(value: number) => [`$${value.toFixed(2)}`, 'Amount']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2">
                {pieChartData.map((entry, index) => (
                  <div key={entry.name} className="flex items-center justify-between text-sm text-[14px]">
                    <div className="flex items-center gap-2">
                      <div 
                        className="size-3 rounded-full" 
                        style={{ backgroundColor: entry.color }}
                      ></div>
                      <span>{entry.name}</span>
                    </div>
                    <span className="text-muted-foreground">${entry.value.toFixed(2)}</span>
                  </div>
                ))}
              </div>
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
                  {transactions.slice(0, 8).map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 rounded-lg border bg-card/50">
                      <div className="flex items-center gap-4">
                        <div className={`size-10 rounded-full flex items-center justify-center ${
                          transaction.type === 'income' ? 'bg-success/10' : 'bg-destructive/10'
                        }`}>
                          {transaction.type === 'income' 
                            ? <ArrowUpRight className="size-5 text-success" />
                            : <ArrowDownRight className="size-5 text-destructive" />
                          }
                        </div>
                        <div>
                          <p className="text-[16px]">{transaction.description}</p>
                          <div className="flex items-center gap-2 text-sm text-[14px] text-muted-foreground">
                            <Calendar className="size-3" />
                            <span>{transaction.date}</span>
                            <Badge variant="secondary" className="text-xs text-[12px]">
                              {transaction.category}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-[16px] ${
                          transaction.type === 'income' ? 'text-success' : 'text-destructive'
                        }`}>
                          {transaction.type === 'income' ? '+' : ''}
                          ${Math.abs(transaction.amount).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
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
                              ${category.spent.toFixed(2)} / ${category.budget.toFixed(2)}
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
                            Over budget by ${(category.spent - category.budget).toFixed(2)}
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