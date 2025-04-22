import { Category, DateRange } from '../types';
import { endOfDay, endOfMonth, endOfWeek, startOfDay, startOfMonth, startOfWeek } from 'date-fns';

export const defaultCategories: Omit<Category, 'id' | 'userId'>[] = [
  { name: 'Food & Dining', color: '#10B981', icon: 'utensils' },
  { name: 'Transportation', color: '#6366F1', icon: 'car' },
  { name: 'Housing', color: '#F59E0B', icon: 'home' },
  { name: 'Entertainment', color: '#EC4899', icon: 'tv' },
  { name: 'Shopping', color: '#8B5CF6', icon: 'shopping-bag' },
  { name: 'Health', color: '#EF4444', icon: 'heart-pulse' },
  { name: 'Education', color: '#3B82F6', icon: 'book' },
  { name: 'Travel', color: '#14B8A6', icon: 'plane' },
  { name: 'Utilities', color: '#F97316', icon: 'plug' },
  { name: 'Others', color: '#9CA3AF', icon: 'more-horizontal' },
  { name: 'Income', color: '#34D399', icon: 'trending-up' },
];

export const getDefaultDateRange = (type: 'daily' | 'weekly' | 'monthly' = 'monthly'): DateRange => {
  const today = new Date();
  
  switch (type) {
    case 'daily':
      return {
        startDate: startOfDay(today),
        endDate: endOfDay(today),
        label: 'daily'
      };
    case 'weekly':
      return {
        startDate: startOfWeek(today, { weekStartsOn: 1 }),
        endDate: endOfWeek(today, { weekStartsOn: 1 }),
        label: 'weekly'
      };
    case 'monthly':
    default:
      return {
        startDate: startOfMonth(today),
        endDate: endOfMonth(today),
        label: 'monthly'
      };
  }
};