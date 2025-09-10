import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { IndianRupee, Target, TrendingUp, Plus, X } from 'lucide-react';

interface Category {
  name: string;
  spent: number;
  budget: number;
  color: string;
}

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onUpdateBudgets: (updatedCategories: Category[]) => Promise<void>;
}

// Default categories for new users
const DEFAULT_CATEGORIES = [
  { name: 'Food & Dining', suggestedBudget: 5000, color: 'bg-chart-1' },
  { name: 'Transportation', suggestedBudget: 3000, color: 'bg-chart-2' },
  { name: 'Shopping', suggestedBudget: 4000, color: 'bg-chart-3' },
  { name: 'Entertainment', suggestedBudget: 2000, color: 'bg-chart-4' },
  { name: 'Bills & Utilities', suggestedBudget: 6000, color: 'bg-chart-1' },
  { name: 'Healthcare', suggestedBudget: 2500, color: 'bg-chart-2' },
  { name: 'Personal Care', suggestedBudget: 1500, color: 'bg-chart-3' },
  { name: 'Miscellaneous', suggestedBudget: 3000, color: 'bg-chart-4' },
];

export default function BudgetModal({ isOpen, onClose, categories, onUpdateBudgets }: BudgetModalProps) {
  const [workingCategories, setWorkingCategories] = useState<Category[]>([]);
  const [budgets, setBudgets] = useState<Record<string, string>>({});
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize working categories and budgets when modal opens
  useEffect(() => {
    if (isOpen) {
      if (categories.length === 0) {
        // New user - show default categories with suggested budgets
        const defaultCategories: Category[] = DEFAULT_CATEGORIES.map(cat => ({
          name: cat.name,
          spent: 0,
          budget: 0, // Start with 0, user can accept suggestions
          color: cat.color
        }));
        setWorkingCategories(defaultCategories);
        
        // Initialize budgets with empty values so users can see suggestions
        const initialBudgets = defaultCategories.reduce((acc, cat) => ({
          ...acc,
          [cat.name]: ''
        }), {});
        setBudgets(initialBudgets);
      } else {
        // Existing user - use their current categories
        setWorkingCategories([...categories]);
        const initialBudgets = categories.reduce((acc, cat) => ({
          ...acc,
          [cat.name]: cat.budget.toString()
        }), {});
        setBudgets(initialBudgets);
      }
      setNewCategoryName('');
      setShowAddCategory(false);
    }
  }, [isOpen, categories]);

  const handleBudgetChange = (categoryName: string, value: string) => {
    setBudgets(prev => ({
      ...prev,
      [categoryName]: value
    }));
  };

  const applySuggestedBudget = (categoryName: string) => {
    const suggestion = DEFAULT_CATEGORIES.find(cat => cat.name === categoryName);
    if (suggestion) {
      handleBudgetChange(categoryName, suggestion.suggestedBudget.toString());
    }
  };

  const applyAllSuggestedBudgets = () => {
    const newBudgets = { ...budgets };
    workingCategories.forEach(category => {
      const suggestion = DEFAULT_CATEGORIES.find(cat => cat.name === category.name);
      if (suggestion) {
        newBudgets[category.name] = suggestion.suggestedBudget.toString();
      }
    });
    setBudgets(newBudgets);
  };

  const addCustomCategory = () => {
    if (newCategoryName.trim() && !workingCategories.find(cat => cat.name === newCategoryName.trim())) {
      const newCategory: Category = {
        name: newCategoryName.trim(),
        spent: 0,
        budget: 0,
        color: `bg-chart-${(workingCategories.length % 4) + 1}`
      };
      setWorkingCategories(prev => [...prev, newCategory]);
      setBudgets(prev => ({
        ...prev,
        [newCategory.name]: ''
      }));
      setNewCategoryName('');
      setShowAddCategory(false);
    }
  };

  const removeCategory = (categoryName: string) => {
    // Prevent removing all categories - require at least one
    if (workingCategories.length <= 1) {
      alert('You must have at least one budget category.');
      return;
    }
    
    if (confirm(`Are you sure you want to remove the "${categoryName}" budget category? This action cannot be undone.`)) {
      setWorkingCategories(prev => prev.filter(cat => cat.name !== categoryName));
      setBudgets(prev => {
        const newBudgets = { ...prev };
        delete newBudgets[categoryName];
        return newBudgets;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const updatedCategories = workingCategories.map(category => ({
        ...category,
        budget: parseFloat(budgets[category.name]) || 0
      }));

      await onUpdateBudgets(updatedCategories);
      onClose();
    } catch (error) {
      console.error('Failed to save budgets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const totalBudget = Object.values(budgets).reduce((sum, budget) => sum + (parseFloat(budget) || 0), 0);
  const totalSpent = workingCategories.reduce((sum, cat) => sum + cat.spent, 0);
  const isNewUser = categories.length === 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="size-5 text-primary" />
            {isNewUser ? 'Set Up Your Monthly Budgets' : 'Manage Monthly Budgets'}
          </DialogTitle>
          <DialogDescription>
            {isNewUser 
              ? 'Welcome! Set spending limits for different categories to start tracking your financial goals'
              : 'Set spending limits for each category to stay on track with your financial goals'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* New User Welcome Message */}
          {isNewUser && (
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">🎯 Get Started with Budgeting</h3>
                <p className="text-blue-700 text-sm mb-4">
                  We've suggested some common expense categories with recommended budget amounts. 
                  You can adjust these amounts or add your own categories.
                </p>
                <Button 
                  type="button" 
                  onClick={applyAllSuggestedBudgets}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Apply All Suggested Budgets
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Budget Overview */}
          <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="size-5" />
                Budget Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total Budget</p>
                  <p className="text-2xl text-[24px] text-primary">
                                      <span className="text-lg font-semibold text-primary">
                    ₹{totalBudget.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Spent</p>
                  <p className="text-2xl text-[24px]">
                    ₹{totalSpent.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>Overall Progress</span>
                  <span>{totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0}%</span>
                </div>
                <Progress 
                  value={totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0} 
                  className="h-2"
                />
              </div>
            </CardContent>
          </Card>

          {/* Category Budgets */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              {workingCategories.map((category) => {
                const currentBudget = parseFloat(budgets[category.name]) || 0;
                const percentage = currentBudget > 0 ? (category.spent / currentBudget) * 100 : 0;
                const isOverBudget = percentage > 100;
                const suggestedAmount = DEFAULT_CATEGORIES.find(cat => cat.name === category.name)?.suggestedBudget;
                
                return (
                  <Card key={category.name} className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`size-4 rounded-full ${category.color}`}></div>
                          <span className="text-[16px]">{category.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-sm text-muted-foreground">
                                                        <span className="text-xs text-muted-foreground">
                            ₹{category.spent.toFixed(2)} spent
                          </span>
                          </div>
                          {/* Remove button for all users */}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                            onClick={() => removeCategory(category.name)}
                            title="Remove this budget category"
                          >
                            <X className="size-3" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <Label htmlFor={`budget-${category.name}`} className="sr-only">
                            Budget for {category.name}
                          </Label>
                          <div className="relative">
                            <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
                            <Input
                              id={`budget-${category.name}`}
                              type="number"
                              step="0.01"
                              min="0"
                              placeholder={suggestedAmount ? `Suggested: ₹${suggestedAmount}` : "0.00"}
                              className="pl-10"
                              value={budgets[category.name]}
                              onChange={(e) => handleBudgetChange(category.name, e.target.value)}
                            />
                          </div>
                        </div>
                        {isNewUser && suggestedAmount && !budgets[category.name] && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => applySuggestedBudget(category.name)}
                            className="shrink-0"
                          >
                            Use ${suggestedAmount}
                          </Button>
                        )}
                        <div className="text-sm text-muted-foreground min-w-16 text-right">
                          {percentage.toFixed(0)}%
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <Progress 
                          value={Math.min(percentage, 100)} 
                          className={`h-2 ${isOverBudget ? '[&>div]:bg-destructive' : ''}`}
                        />
                        {isOverBudget && (
                          <p className="text-xs text-red-500">
                            Over budget by ₹{(category.spent - currentBudget).toFixed(2)}
                          </p>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Add Custom Category */}
            {isNewUser && (
              <Card className="p-4 border-dashed border-2 border-muted-foreground/25">
                {!showAddCategory ? (
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full h-auto p-4 flex items-center gap-2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowAddCategory(true)}
                  >
                    <Plus className="size-4" />
                    Add Custom Category
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Input
                        placeholder="Category name"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addCustomCategory()}
                      />
                      <Button
                        type="button"
                        size="sm"
                        onClick={addCustomCategory}
                        disabled={!newCategoryName.trim()}
                      >
                        Add
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setShowAddCategory(false);
                          setNewCategoryName('');
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-6">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1" disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading ? 'Saving...' : (isNewUser ? 'Create Budgets' : 'Update Budgets')}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}