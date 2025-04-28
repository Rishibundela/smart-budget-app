import React, { useEffect, useState } from 'react';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { Budget, Category } from '../../types';
import { IndianRupee, Calendar, Archive, Plus } from 'lucide-react';
import { formatMonth } from '../../utils/formatters';

interface BudgetFormProps {
  onSubmit: (budget: Omit<Budget, 'id'>) => void;
  categories: Category[];
  editingBudget: Budget | null;
  userId: string;
  month: number;
  year: number;
  existingBudgets: Budget[];
}

export const BudgetForm: React.FC<BudgetFormProps> = ({
  onSubmit,
  categories,
  editingBudget,
  userId,
  month,
  year,
  existingBudgets,
}) => {
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Filter out income categories and get eligible categories
  const eligibleCategories = categories.filter(cat => cat.group !== 'Income');
  
  // Filter out categories that already have budgets for this month
  const availableCategories = eligibleCategories.filter(cat => {
    if (editingBudget && editingBudget.categoryId === cat.id) {
      return true; // Include the category of the budget being edited
    }
    
    return !existingBudgets.some(
      budget => 
        budget.categoryId === cat.id && 
        budget.month === month &&
        budget.year === year
    );
  });

  // Group categories for display
  const groupedCategories = availableCategories.reduce((acc, category) => {
    if (!acc[category.group]) {
      acc[category.group] = [];
    }
    acc[category.group].push(category);
    return acc;
  }, {} as Record<string, Category[]>);

  // Create options array with groups
  const categoryOptions = Object.entries(groupedCategories).map(([group, cats]) => ({
    label: group,
    options: cats.map(cat => ({
      value: cat.id,
      label: cat.name
    }))
  }));
  
  // Fill form with budget data when editing
  useEffect(() => {
    if (editingBudget) {
      setAmount(editingBudget.amount.toString());
      setCategoryId(editingBudget.categoryId);
    } else {
      // Reset form on component mount or when editingBudget becomes null
      setAmount('');
      if (availableCategories.length > 0) {
        setCategoryId(availableCategories[0].id);
      }
    }
  }, [editingBudget, availableCategories]);
  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!amount) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      newErrors.amount = 'Amount must be a positive number';
    }
    
    if (!categoryId) {
      newErrors.categoryId = 'Category is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    onSubmit({
      amount: parseFloat(amount),
      month,
      year,
      categoryId,
      userId,
    });
    
    // Reset form if not editing
    if (!editingBudget) {
      setAmount('');
      if (availableCategories.length > 0) {
        setCategoryId(availableCategories[0].id);
      }
    }
  };
  
  return (
    <Card title={editingBudget ? 'Edit Budget' : 'Add Budget'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          label="Month"
          value={formatMonth(month, year)}
          disabled
          leftIcon={<Calendar className="h-5 w-5 text-gray-400" />}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Select
              label="Category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              options={
                editingBudget
                  ? eligibleCategories
                      .filter(cat => cat.id === editingBudget.categoryId)
                      .map(cat => ({ value: cat.id, label: cat.name }))
                  : categoryOptions
              }
              error={errors.categoryId}
              disabled={editingBudget !== null || availableCategories.length === 0}
              required
            />
            {availableCategories.length === 0 && !editingBudget && (
              <p className="text-xs text-amber-600 dark:text-amber-500 mt-1">
                All categories already have budgets for this month
              </p>
            )}
          </div>
          
          <div>
            <Input
              type="number"
              label="Budget Amount"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              step="0.01"
              min="0"
              leftIcon={<IndianRupee className="h-5 w-5 text-gray-400" />}
              error={errors.amount}
              disabled={availableCategories.length === 0 && !editingBudget}
              required
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button
            type="submit"
            leftIcon={editingBudget ? <Archive /> : <Plus />}
            disabled={availableCategories.length === 0 && !editingBudget}
          >
            {editingBudget ? 'Update Budget' : 'Add Budget'}
          </Button>
        </div>
      </form>
    </Card>
  );
};