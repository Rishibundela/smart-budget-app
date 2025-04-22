import { faker } from '@faker-js/faker';
import { Budget, Category, Transaction, User } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { getCategoriesByUser } from './localStorage';

// Generate random date in the last 6 months
const getRandomDate = (months = 6): string => {
  const now = new Date();
  const past = new Date();
  past.setMonth(now.getMonth() - months);
  return faker.date.between({ from: past, to: now }).toISOString();
};

// Generate fake transactions
export const generateFakeTransactions = (
  userId: string, 
  count = 50
): Transaction[] => {
  const categories = getCategoriesByUser(userId);
  if (categories.length === 0) return [];
  
  return Array.from({ length: count }, () => {
    const isExpense = Math.random() > 0.3; // 70% chance of being an expense
    const categoryId = isExpense 
      ? categories.find(c => c.name !== 'Income')?.id || categories[0].id
      : categories.find(c => c.name === 'Income')?.id || categories[0].id;
    
    return {
      id: uuidv4(),
      amount: isExpense 
        ? faker.number.float({ min: 5, max: 200, precision: 0.01 })
        : faker.number.float({ min: 500, max: 5000, precision: 0.01 }),
      description: isExpense 
        ? faker.commerce.productName()
        : faker.company.name() + ' Salary',
      date: getRandomDate(),
      categoryId,
      type: isExpense ? 'expense' : 'income',
      userId
    };
  });
};

// Generate fake budgets for all categories (except income)
export const generateFakeBudgets = (
  userId: string
): Budget[] => {
  const categories = getCategoriesByUser(userId).filter(c => c.name !== 'Income');
  if (categories.length === 0) return [];
  
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  return categories.map(category => {
    return {
      id: uuidv4(),
      amount: faker.number.float({ min: 200, max: 1000, precision: 0.01 }),
      month: currentMonth,
      year: currentYear,
      categoryId: category.id,
      userId
    };
  });
};

// Generate a demo user
export const generateDemoUser = (): User => {
  return {
    id: uuidv4(),
    name: 'Demo User',
    email: 'demo@example.com',
    avatar: faker.image.avatar()
  };
};