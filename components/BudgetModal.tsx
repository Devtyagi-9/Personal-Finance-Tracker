import { useState } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { DollarSign, Target, TrendingUp } from 'lucide-react';

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
  onUpdateBudgets: (updatedCategories: Category[]) => void;
}

export default function BudgetModal({ isOpen, onClose, categories, onUpdateBudgets }: BudgetModalProps) {
  const [budgets, setBudgets] = useState<Record<string, string>>(
    categories.reduce((acc, cat) => ({
      ...acc,
      [cat.name]: cat.budget.toString()
    }), {})
  );

  const handleBudgetChange = (categoryName: string, value: string) => {
    setBudgets(prev => ({
      ...prev,
      [categoryName]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedCategories = categories.map(category => ({
      ...category,
      budget: parseFloat(budgets[category.name]) || 0
    }));

    onUpdateBudgets(updatedCategories);
    onClose();
  };

  const totalBudget = Object.values(budgets).reduce((sum, budget) => sum + (parseFloat(budget) || 0), 0);
  const totalSpent = categories.reduce((sum, cat) => sum + cat.spent, 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="size-5 text-primary" />
            Manage Monthly Budgets
          </DialogTitle>
          <DialogDescription>
            Set spending limits for each category to stay on track with your financial goals
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
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
                    ${totalBudget.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Spent</p>
                  <p className="text-2xl text-[24px]">
                    ${totalSpent.toLocaleString('en-US', { minimumFractionDigits: 2 })}
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
              {categories.map((category) => {
                const currentBudget = parseFloat(budgets[category.name]) || 0;
                const percentage = currentBudget > 0 ? (category.spent / currentBudget) * 100 : 0;
                const isOverBudget = percentage > 100;
                
                return (
                  <Card key={category.name} className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`size-4 rounded-full ${category.color}`}></div>
                          <span className="text-[16px]">{category.name}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          ${category.spent.toFixed(2)} spent
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <Label htmlFor={`budget-${category.name}`} className="sr-only">
                            Budget for {category.name}
                          </Label>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
                            <Input
                              id={`budget-${category.name}`}
                              type="number"
                              step="0.01"
                              min="0"
                              placeholder="0.00"
                              className="pl-10"
                              value={budgets[category.name]}
                              onChange={(e) => handleBudgetChange(category.name, e.target.value)}
                            />
                          </div>
                        </div>
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
                          <p className="text-xs text-destructive">
                            Over budget by ${(category.spent - currentBudget).toFixed(2)}
                          </p>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-6">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                Update Budgets
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}