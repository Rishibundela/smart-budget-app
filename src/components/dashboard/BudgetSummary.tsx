import React from 'react';
import { Card } from '../ui/Card';
import { ArrowUpRight, ArrowDownRight, Wallet } from 'lucide-react';
import { Budget, DateRange, Transaction } from '../../types';
import { calculateTotalExpense, calculateTotalIncome } from '../../utils/helpers';
import { formatCurrency, formatPercentage } from '../../utils/formatters';

interface BudgetSummaryProps {
  transactions: Transaction[];
  budgets: Budget[];
  dateRange: DateRange;
}

export const BudgetSummary: React.FC<BudgetSummaryProps> = ({
  transactions,
  budgets,
  dateRange,
}) => {
  // Calculate totals
  const totalIncome = calculateTotalIncome(transactions, dateRange);
  const totalExpenses = calculateTotalExpense(transactions, dateRange);
  const balance = totalIncome - totalExpenses;
  
  // Calculate total budget
  const totalBudget = budgets.reduce((sum, budget) => sum + budget.amount, 0);
  const budgetUsage = totalBudget > 0 ? Math.min(100, (totalExpenses / totalBudget) * 100) : 0;
  
  // Style classes
  const getBalanceColorClass = () => {
    if (balance > 0) return 'text-green-600 dark:text-green-500';
    if (balance < 0) return 'text-red-600 dark:text-red-500';
    return 'text-gray-500 dark:text-gray-400';
  };
  
  const getBudgetStatusClass = () => {
    if (budgetUsage < 60) return 'text-green-600 dark:text-green-500';
    if (budgetUsage < 90) return 'text-amber-600 dark:text-amber-500';
    return 'text-red-600 dark:text-red-500';
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="flex flex-col justify-between">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-base font-medium text-gray-700 dark:text-gray-300">Income</h3>
          <ArrowUpRight className="h-5 w-5 text-green-600 dark:text-green-500" />
        </div>
        <p className="text-2xl font-semibold text-gray-900 dark:text-white">{formatCurrency(totalIncome)}</p>
      </Card>
      
      <Card className="flex flex-col justify-between">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-base font-medium text-gray-700 dark:text-gray-300">Expenses</h3>
          <ArrowDownRight className="h-5 w-5 text-red-600 dark:text-red-500" />
        </div>
        <p className="text-2xl font-semibold text-gray-900 dark:text-white">{formatCurrency(totalExpenses)}</p>
      </Card>
      
      <Card className="flex flex-col justify-between">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-base font-medium text-gray-700 dark:text-gray-300">Balance</h3>
          <Wallet className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        </div>
        <p className={`text-2xl font-semibold ${getBalanceColorClass()}`}>
          {formatCurrency(balance)}
        </p>
      </Card>
      
      <Card className="md:col-span-3">
        <h3 className="text-base font-medium text-gray-700 dark:text-gray-300 mb-2">Budget Status</h3>
        <div className="flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-700 dark:text-gray-300">Overall Budget</p>
            <p className={`text-sm font-medium ${getBudgetStatusClass()}`}>
              {formatPercentage(budgetUsage)}
            </p>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div 
              className={`h-2.5 rounded-full ${
                budgetUsage < 60 ? 'bg-green-600' : budgetUsage < 90 ? 'bg-amber-500' : 'bg-red-600'
              }`}
              style={{ width: `${budgetUsage}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>{formatCurrency(totalExpenses)}</span>
            <span>{formatCurrency(totalBudget)}</span>
          </div>
        </div>
      </Card>
    </div>
  );
};