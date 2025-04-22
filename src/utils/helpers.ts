import { format } from 'date-fns';
import { Budget, Category, DateRange, Transaction } from '../types';

// Calculate total expenditure for a specific category in a date range
export const calculateCategoryExpense = (
  transactions: Transaction[],
  categoryId: string,
  dateRange: DateRange
): number => {
  return transactions
    .filter(t => 
      t.categoryId === categoryId &&
      t.type === 'expense' &&
      new Date(t.date) >= dateRange.startDate &&
      new Date(t.date) <= dateRange.endDate
    )
    .reduce((sum, t) => sum + t.amount, 0);
};

// Calculate total income in a date range
export const calculateTotalIncome = (
  transactions: Transaction[],
  dateRange: DateRange
): number => {
  return transactions
    .filter(t => 
      t.type === 'income' &&
      new Date(t.date) >= dateRange.startDate &&
      new Date(t.date) <= dateRange.endDate
    )
    .reduce((sum, t) => sum + t.amount, 0);
};

// Calculate total expenses in a date range
export const calculateTotalExpense = (
  transactions: Transaction[],
  dateRange: DateRange
): number => {
  return transactions
    .filter(t => 
      t.type === 'expense' &&
      new Date(t.date) >= dateRange.startDate &&
      new Date(t.date) <= dateRange.endDate
    )
    .reduce((sum, t) => sum + t.amount, 0);
};

// Calculate percentage of budget used
export const calculateBudgetUsage = (
  spent: number,
  budget: number
): number => {
  if (budget <= 0) return 0;
  return Math.min(100, (spent / budget) * 100);
};

// Calculate the data for category spending pie chart
export const getCategoryData = (
  transactions: Transaction[],
  categories: Category[],
  dateRange: DateRange
): { labels: string[]; data: number[]; backgroundColor: string[] } => {
  const expenseTransactions = transactions.filter(t => 
    t.type === 'expense' &&
    new Date(t.date) >= dateRange.startDate &&
    new Date(t.date) <= dateRange.endDate
  );
  
  const categoryMap = new Map<string, number>();
  
  // Sum up expenses by category
  expenseTransactions.forEach(t => {
    const currentAmount = categoryMap.get(t.categoryId) || 0;
    categoryMap.set(t.categoryId, currentAmount + t.amount);
  });
  
  // Prepare chart data
  const labels: string[] = [];
  const data: number[] = [];
  const backgroundColor: string[] = [];
  
  // Map category IDs to names and colors
  Array.from(categoryMap.entries()).forEach(([categoryId, amount]) => {
    const category = categories.find(c => c.id === categoryId);
    if (category) {
      labels.push(category.name);
      data.push(amount);
      backgroundColor.push(category.color);
    }
  });
  
  return { labels, data, backgroundColor };
};

// Calculate monthly budget status for a specific category
export const getBudgetStatus = (
  budget: Budget | undefined,
  transactions: Transaction[]
): { allocated: number; spent: number; remaining: number; percentage: number } => {
  if (!budget) {
    return { allocated: 0, spent: 0, remaining: 0, percentage: 0 };
  }
  
  const { month, year, categoryId, amount } = budget;
  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0);
  
  const spent = transactions
    .filter(t =>
      t.categoryId === categoryId &&
      t.type === 'expense' &&
      new Date(t.date) >= startDate &&
      new Date(t.date) <= endDate
    )
    .reduce((sum, t) => sum + t.amount, 0);
  
  const remaining = Math.max(0, amount - spent);
  const percentage = amount > 0 ? Math.min(100, (spent / amount) * 100) : 0;
  
  return { allocated: amount, spent, remaining, percentage };
};

// Generate chart labels for a monthly chart
export const generateMonthlyLabels = (): string[] => {
  return Array.from({ length: 12 }, (_, i) => {
    const date = new Date();
    date.setMonth(i);
    return format(date, 'MMM');
  });
};