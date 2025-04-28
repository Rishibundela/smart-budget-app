import React, { useEffect, useState } from 'react';
import { BudgetSummary } from '../components/dashboard/BudgetSummary';
import { SpendingChart } from '../components/dashboard/SpendingChart';
import { RecentTransactions } from '../components/dashboard/RecentTransactions';
import { DateRangeFilter } from '../components/transactions/DateRangeFilter';
import { useBudget } from '../context/BudgetContext';
import { useAuth } from '../context/AuthContext';
import { createBudget, createTransaction, getTransactions } from '../utils/localStorage';
import { generateFakeBudgets, generateFakeTransactions } from '../utils/fakeData';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Zap } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { transactions, budgets, categories, filterOptions, setFilterOptions, refreshData } = useBudget();
  const [isLoading, setIsLoading] = useState(false);
  const [hasDemoData, setHasDemoData] = useState(false);
  
  // Check if user has any transactions
  useEffect(() => {
    if (user) {
      const userTransactions = getTransactions(user.id);
      setHasDemoData(userTransactions.length > 0);
    }
  }, [user, transactions]);
  
  // Generate demo data for new users
  const generateDemoData = () => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      // Generate fake transactions
      const fakeTransactions = generateFakeTransactions(user.id, 30);
      
      // Add fake transactions to localStorage
      fakeTransactions.forEach(transaction => {
        createTransaction({
          amount: transaction.amount,
          description: transaction.description,
          date: transaction.date,
          categoryId: transaction.categoryId,
          type: transaction.type,
          userId: user.id,
        });
      });
      
      // Generate fake budgets
      const fakeBudgets = generateFakeBudgets(user.id);
      
      // Add fake budgets to localStorage
      fakeBudgets.forEach(budget => {
        createBudget({
          amount: budget.amount,
          month: budget.month,
          year: budget.year,
          categoryId: budget.categoryId,
          userId: user.id,
        });
      });
      
      // Refresh data
      refreshData();
      setHasDemoData(true);
    } catch (error) {
      console.error('Error generating demo data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Welcome back! Here's an overview of your finances.
        </p>
      </div>
      
      {!hasDemoData && (
        <Card className="mb-8 bg-amber-50 dark:bg-amber-900 dark:bg-opacity-20 border border-amber-200 dark:border-amber-800">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div className="mb-4 sm:mb-0">
              <h3 className="text-lg font-medium text-amber-800 dark:text-amber-500 mb-1">
                No transactions yet
              </h3>
              <p className="text-amber-700 dark:text-amber-400">
                Add your first transaction or generate demo data to see how your dashboard will look.
              </p>
            </div>
            <Button
              leftIcon={<Zap className="h-5 w-5" />}
              onClick={generateDemoData}
              loading={isLoading}
            >
              Generate Demo Data
            </Button>
          </div>
        </Card>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-3">
          <DateRangeFilter
            dateRange={filterOptions.dateRange}
            onChange={(dateRange) => setFilterOptions({ ...filterOptions, dateRange })}
          />
        </div>
        
        <div className="lg:col-span-3">
          <BudgetSummary
            transactions={transactions}
            budgets={budgets}
            dateRange={filterOptions.dateRange}
          />
        </div>
        
        <div className="lg:col-span-2 space-y-8">
          <SpendingChart
            transactions={transactions}
            categories={categories}
            dateRange={filterOptions.dateRange}
          />
        </div>
        
        <div className="space-y-8">
          <RecentTransactions
            transactions={transactions}
            categories={categories}
          />
        </div>
      </div>
    </div>
  );
};