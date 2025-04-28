import { Category, DateRange } from '../types';
import { endOfDay, endOfMonth, endOfWeek, startOfDay, startOfMonth, startOfWeek } from 'date-fns';

export const defaultCategories: Omit<Category, 'id' | 'userId'>[] = [
  // Income Categories
  { 
    name: 'Salary',
    color: '#34D399',
    icon: 'wallet',
    group: 'Income'
  },
  { 
    name: 'Freelance / Side Hustle',
    color: '#60A5FA',
    icon: 'briefcase',
    group: 'Income'
  },
  { 
    name: 'Business Income',
    color: '#F59E0B',
    icon: 'building',
    group: 'Income'
  },
  { 
    name: 'Investment Returns',
    color: '#10B981',
    icon: 'trending-up',
    group: 'Income'
  },
  { 
    name: 'Gifts & Bonuses',
    color: '#A78BFA',
    icon: 'gift',
    group: 'Income'
  },
  { 
    name: 'Refunds / Reimbursements',
    color: '#6EE7B7',
    icon: 'rotate-ccw',
    group: 'Income'
  },

  // Essentials
  { 
    name: 'Rent / Mortgage',
    color: '#EF4444',
    icon: 'home',
    group: 'Essentials'
  },
  { 
    name: 'Utilities',
    color: '#F97316',
    icon: 'zap',
    group: 'Essentials'
  },
  { 
    name: 'Groceries',
    color: '#84CC16',
    icon: 'shopping-cart',
    group: 'Essentials'
  },
  { 
    name: 'Transportation',
    color: '#6366F1',
    icon: 'car',
    group: 'Essentials'
  },
  { 
    name: 'Internet / Mobile',
    color: '#8B5CF6',
    icon: 'wifi',
    group: 'Essentials'
  },

  // Personal
  { 
    name: 'Dining Out / Coffee',
    color: '#EC4899',
    icon: 'coffee',
    group: 'Personal'
  },
  { 
    name: 'Shopping',
    color: '#D946EF',
    icon: 'shopping-bag',
    group: 'Personal'
  },
  { 
    name: 'Subscriptions',
    color: '#6B7280',
    icon: 'tv',
    group: 'Personal'
  },
  { 
    name: 'Gym / Fitness',
    color: '#14B8A6',
    icon: 'dumbbell',
    group: 'Personal'
  },
  { 
    name: 'Salon / Spa',
    color: '#F472B6',
    icon: 'heart',
    group: 'Personal'
  },

  // Education & Work
  { 
    name: 'Tuition / Courses',
    color: '#3B82F6',
    icon: 'book',
    group: 'Education & Work'
  },
  { 
    name: 'Stationery / Books',
    color: '#64748B',
    icon: 'pen-tool',
    group: 'Education & Work'
  },
  { 
    name: 'Online Tools / Software',
    color: '#6B7280',
    icon: 'laptop',
    group: 'Education & Work'
  },
  { 
    name: 'Coworking / Study Materials',
    color: '#475569',
    icon: 'briefcase',
    group: 'Education & Work'
  },

  // Health
  { 
    name: 'Medicines',
    color: '#EF4444',
    icon: 'pill',
    group: 'Health'
  },
  { 
    name: 'Doctor Visits',
    color: '#DC2626',
    icon: 'stethoscope',
    group: 'Health'
  },
  { 
    name: 'Health Insurance',
    color: '#4B5563',
    icon: 'shield',
    group: 'Health'
  },

  // Leisure & Entertainment
  { 
    name: 'Movies / Shows',
    color: '#8B5CF6',
    icon: 'film',
    group: 'Leisure & Entertainment'
  },
  { 
    name: 'Travel / Vacations',
    color: '#0EA5E9',
    icon: 'plane',
    group: 'Leisure & Entertainment'
  },
  { 
    name: 'Games',
    color: '#EC4899',
    icon: 'gamepad',
    group: 'Leisure & Entertainment'
  },
  { 
    name: 'Events',
    color: '#F59E0B',
    icon: 'ticket',
    group: 'Leisure & Entertainment'
  },

  // Financial
  { 
    name: 'Loan EMIs',
    color: '#475569',
    icon: 'landmark',
    group: 'Financial'
  },
  { 
    name: 'Credit Card Payments',
    color: '#94A3B8',
    icon: 'credit-card',
    group: 'Financial'
  },
  { 
    name: 'Investments / Savings',
    color: '#059669',
    icon: 'pie-chart',
    group: 'Financial'
  },
  { 
    name: 'Insurance',
    color: '#4B5563',
    icon: 'shield',
    group: 'Financial'
  }
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