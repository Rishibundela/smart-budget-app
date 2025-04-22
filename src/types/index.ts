export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  date: string;
  categoryId: string;
  type: 'income' | 'expense';
  userId: string;
}

export interface Budget {
  id: string;
  amount: number;
  month: number;
  year: number;
  categoryId: string;
  userId: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface DateRange {
  startDate: Date;
  endDate: Date;
  label: 'daily' | 'weekly' | 'monthly' | 'custom';
}

export type ThemeMode = 'light' | 'dark';

export interface FilterOptions {
  dateRange: DateRange;
  categories: string[];
  type: 'all' | 'income' | 'expense';
}