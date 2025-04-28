import { User, Transaction, Budget, Category, ThemeMode } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { defaultCategories } from './defaults';

// Storage keys
const USERS_KEY = 'smart-budget-users';
const TRANSACTIONS_KEY = 'smart-budget-transactions';
const BUDGETS_KEY = 'smart-budget-budgets';
const CATEGORIES_KEY = 'smart-budget-categories';
const TOKENS_KEY = 'smart-budget-tokens';
const THEME_KEY = 'smart-budget-theme';

// Helper functions
const getFromStorage = <T>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') return defaultValue;
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : defaultValue;
};

const setToStorage = <T>(key: string, value: T): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
};

// Users
export const getUsers = (): User[] => {
  return getFromStorage<User[]>(USERS_KEY, []);
};

export const getUserByEmail = (email: string): User | undefined => {
  const users = getUsers();
  return users.find(user => user.email === email);
};

export const getUserById = (id: string): User | undefined => {
  const users = getUsers();
  return users.find(user => user.id === id);
};

export const createUser = (user: Omit<User, 'id'>): User => {
  const newUser = { ...user, id: uuidv4() };
  const users = getUsers();
  setToStorage(USERS_KEY, [...users, newUser]);
  
  // Initialize default categories for new user
  const categories = getCategories();
  defaultCategories.forEach(category => {
    const newCategory = { ...category, userId: newUser.id, id: uuidv4() };
    setToStorage(CATEGORIES_KEY, [...categories, newCategory]);
  });
  
  return newUser;
};

// Tokens (JWT simulation)
export const saveToken = (userId: string, token: string): void => {
  const tokens = getFromStorage<Record<string, string>>(TOKENS_KEY, {});
  tokens[userId] = token;
  setToStorage(TOKENS_KEY, tokens);
};

export const getToken = (userId: string): string | null => {
  const tokens = getFromStorage<Record<string, string>>(TOKENS_KEY, {});
  return tokens[userId] || null;
};

export const removeToken = (userId: string): void => {
  const tokens = getFromStorage<Record<string, string>>(TOKENS_KEY, {});
  delete tokens[userId];
  setToStorage(TOKENS_KEY, tokens);
};

// Transactions
export const getTransactions = (userId: string): Transaction[] => {
  const allTransactions = getFromStorage<Transaction[]>(TRANSACTIONS_KEY, []);
  return allTransactions.filter(transaction => transaction.userId === userId);
};

export const createTransaction = (transaction: Omit<Transaction, 'id'>): Transaction => {
  const newTransaction = { ...transaction, id: uuidv4() };
  const transactions = getFromStorage<Transaction[]>(TRANSACTIONS_KEY, []);
  setToStorage(TRANSACTIONS_KEY, [...transactions, newTransaction]);
  return newTransaction;
};

export const updateTransaction = (transaction: Transaction): Transaction => {
  const transactions = getFromStorage<Transaction[]>(TRANSACTIONS_KEY, []);
  const updatedTransactions = transactions.map(t => 
    t.id === transaction.id ? transaction : t
  );
  setToStorage(TRANSACTIONS_KEY, updatedTransactions);
  return transaction;
};

export const deleteTransaction = (id: string): void => {
  const transactions = getFromStorage<Transaction[]>(TRANSACTIONS_KEY, []);
  setToStorage(TRANSACTIONS_KEY, transactions.filter(t => t.id !== id));
};

// Budgets
export const getBudgets = (userId: string): Budget[] => {
  const allBudgets = getFromStorage<Budget[]>(BUDGETS_KEY, []);
  return allBudgets.filter(budget => budget.userId === userId);
};

export const getBudgetByCategoryAndMonth = (
  userId: string, 
  categoryId: string, 
  month: number, 
  year: number
): Budget | undefined => {
  const budgets = getBudgets(userId);
  return budgets.find(b => 
    b.categoryId === categoryId && 
    b.month === month && 
    b.year === year
  );
};

export const createBudget = (budget: Omit<Budget, 'id'>): Budget => {
  const newBudget = { ...budget, id: uuidv4() };
  const budgets = getFromStorage<Budget[]>(BUDGETS_KEY, []);
  setToStorage(BUDGETS_KEY, [...budgets, newBudget]);
  return newBudget;
};

export const updateBudget = (budget: Budget): Budget => {
  const budgets = getFromStorage<Budget[]>(BUDGETS_KEY, []);
  const updatedBudgets = budgets.map(b => 
    b.id === budget.id ? budget : b
  );
  setToStorage(BUDGETS_KEY, updatedBudgets);
  return budget;
};

export const deleteBudget = (id: string): void => {
  const budgets = getFromStorage<Budget[]>(BUDGETS_KEY, []);
  setToStorage(BUDGETS_KEY, budgets.filter(b => b.id !== id));
};

// Categories
export const getCategories = (): Category[] => {
  return getFromStorage<Category[]>(CATEGORIES_KEY, []);
};

export const getCategoriesByUser = (userId: string): Category[] => {
  const categories = getCategories();
  return categories.filter(cat => cat.userId === userId);
};

export const getCategoryById = (id: string): Category | undefined => {
  const categories = getCategories();
  return categories.find(cat => cat.id === id);
};

export const createCategory = (category: Omit<Category, 'id'>): Category => {
  const newCategory = { ...category, id: uuidv4() };
  const categories = getCategories();
  setToStorage(CATEGORIES_KEY, [...categories, newCategory]);
  return newCategory;
};

export const updateCategory = (category: Category): Category => {
  const categories = getCategories();
  const updatedCategories = categories.map(c => 
    c.id === category.id ? category : c
  );
  setToStorage(CATEGORIES_KEY, updatedCategories);
  return category;
};

export const deleteCategory = (id: string): void => {
  const categories = getCategories();
  setToStorage(CATEGORIES_KEY, categories.filter(c => c.id !== id));
};

// Theme preferences
export const getThemePreference = (): ThemeMode => {
  return getFromStorage<ThemeMode>(THEME_KEY, 'light');
};

export const setThemePreference = (mode: ThemeMode): void => {
  setToStorage(THEME_KEY, mode);
};