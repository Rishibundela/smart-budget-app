import React, { useMemo } from 'react';
import { Card } from '../ui/Card';
import { Budget, Category, Transaction } from '../../types';
import { formatCurrency, formatMonth } from '../../utils/formatters';
import { Button } from '../ui/Button';
import { Edit2, Trash2 } from 'lucide-react';

interface BudgetListProps {
  budgets: Budget[];
  categories: Category[];
  transactions: Transaction[];
  onEdit: (budget: Budget) => void;
  onDelete: (id: string) => void;
  month: number;
  year: number;
}

export const BudgetList: React.FC<BudgetListProps> = ({
  budgets,
  categories,
  transactions,
  onEdit,
  onDelete,
  month,
  year,
}) => {
  // Filter budgets for the current month/year
  const currentBudgets = useMemo(() => {
    return budgets.filter(budget => budget.month === month && budget.year === year);
  }, [budgets, month, year]);
  
  // Calculate total budget
  const totalBudget = useMemo(() => {
    return currentBudgets.reduce((total, budget) => total + budget.amount, 0);
  }, [currentBudgets]);
  
  // Calculate expenses for each category
  const getCategoryExpenses = (categoryId: string): number => {
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);
    
    return transactions
      .filter(
        t =>
          t.categoryId === categoryId &&
          t.type === 'expense' &&
          new Date(t.date) >= startDate &&
          new Date(t.date) <= endDate
      )
      .reduce((sum, t) => sum + t.amount, 0);
  };
  
  // Calculate total expenses
  const totalExpenses = useMemo(() => {
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);
    
    return transactions
      .filter(
        t =>
          t.type === 'expense' &&
          new Date(t.date) >= startDate &&
          new Date(t.date) <= endDate
      )
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions, month, year]);
  
  // Get category by ID
  const getCategoryById = (id: string): Category | undefined => {
    return categories.find(cat => cat.id === id);
  };
  
  return (
    <Card title={`Budget for ${formatMonth(month, year)}`}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Category
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Budget
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Spent
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Remaining
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Progress
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
            {currentBudgets.length > 0 ? (
              <>
                {currentBudgets.map(budget => {
                  const category = getCategoryById(budget.categoryId);
                  const spent = getCategoryExpenses(budget.categoryId);
                  const remaining = Math.max(0, budget.amount - spent);
                  const percentage = budget.amount > 0 ? Math.min(100, (spent / budget.amount) * 100) : 0;
                  const progressColor = percentage < 60 ? 'bg-green-600' : percentage < 90 ? 'bg-amber-500' : 'bg-red-600';
                  
                  return (
                    <tr key={budget.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        <span
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                          style={{
                            backgroundColor: category ? `${category.color}20` : '#e5e7eb',
                            color: category ? category.color : '#4b5563',
                          }}
                        >
                          {category ? category.name : 'Unknown'}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white text-right">
                        {formatCurrency(budget.amount)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white text-right">
                        {formatCurrency(spent)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white text-right">
                        {formatCurrency(remaining)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                            <div
                              className={`h-2 rounded-full ${progressColor}`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-xs">{Math.round(percentage)}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => onEdit(budget)}
                            className="text-blue-600 dark:text-blue-500 hover:text-blue-800 dark:hover:text-blue-300"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => onDelete(budget.id)}
                            className="text-red-600 dark:text-red-500 hover:text-red-800 dark:hover:text-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                <tr className="bg-gray-50 dark:bg-gray-800 font-medium">
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    Total
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white text-right">
                    {formatCurrency(totalBudget)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white text-right">
                    {formatCurrency(totalExpenses)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white text-right">
                    {formatCurrency(Math.max(0, totalBudget - totalExpenses))}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                        <div
                          className={`h-2 rounded-full ${
                            totalBudget > 0
                              ? totalExpenses / totalBudget < 0.6
                                ? 'bg-green-600'
                                : totalExpenses / totalBudget < 0.9
                                ? 'bg-amber-500'
                                : 'bg-red-600'
                              : 'bg-gray-400'
                          }`}
                          style={{
                            width: totalBudget > 0 ? `${Math.min(100, (totalExpenses / totalBudget) * 100)}%` : '0%',
                          }}
                        />
                      </div>
                      <span className="text-xs">
                        {totalBudget > 0 ? Math.round((totalExpenses / totalBudget) * 100) : 0}%
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-right">
                  </td>
                </tr>
              </>
            ) : (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
                  No budgets set for this month
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};