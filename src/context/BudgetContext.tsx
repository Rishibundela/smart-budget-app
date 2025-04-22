import React, { createContext, useContext, useEffect, useState } from 'react';
import { Budget, Category, DateRange, FilterOptions, Transaction } from '../types';
import { getBudgets, getCategories, getTransactions } from '../utils/localStorage';
import { getDefaultDateRange } from '../utils/defaults';
import { useAuth } from './AuthContext';

interface BudgetContextType {
  transactions: Transaction[];
  budgets: Budget[];
  categories: Category[];
  filterOptions: FilterOptions;
  setFilterOptions: (options: FilterOptions) => void;
  refreshData: () => void;
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export const BudgetProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const { user, isAuthenticated } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    dateRange: getDefaultDateRange('monthly'),
    categories: [],
    type: 'all'
  });

  // Fetch user data when authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      refreshData();
    } else {
      // Clear data when not authenticated
      setTransactions([]);
      setBudgets([]);
      setCategories([]);
    }
  }, [isAuthenticated, user]);

  // Refresh all data
  const refreshData = () => {
    if (!user) return;
    
    const userId = user.id;
    setTransactions(getTransactions(userId));
    setBudgets(getBudgets(userId));
    setCategories(getCategories().filter(cat => cat.userId === userId));
  };

  return (
    <BudgetContext.Provider
      value={{
        transactions,
        budgets,
        categories,
        filterOptions,
        setFilterOptions,
        refreshData
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
};

export const useBudget = (): BudgetContextType => {
  const context = useContext(BudgetContext);
  if (!context) {
    throw new Error('useBudget must be used within a BudgetProvider');
  }
  return context;
};