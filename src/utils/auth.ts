import { v4 as uuidv4 } from 'uuid';
import { createUser, getUserByEmail, saveToken, createCategory } from './localStorage';
import { User } from '../types';
import { defaultCategories } from './defaults';

// Simulate JWT creation
const generateToken = (userId: string): string => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({
    sub: userId,
    iat: Date.now(),
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  }));
  const signature = btoa(uuidv4()); // Simulated signature
  
  return `${header}.${payload}.${signature}`;
};

export const registerUser = (
  name: string, 
  email: string, 
  password: string
): { user: User; token: string } | { error: string } => {
  try {
    // Check if user already exists
    const existingUser = getUserByEmail(email);
    if (existingUser) {
      return { error: 'User with this email already exists' };
    }
    
    // Create new user
    const user = createUser({ name, email });
    
    // Initialize default categories for the new user
    defaultCategories.forEach(category => {
      createCategory({ ...category, userId: user.id });
    });
    
    // Generate token
    const token = generateToken(user.id);
    saveToken(user.id, token);
    
    return { user, token };
  } catch (error) {
    return { error: 'Failed to register user' };
  }
};

export const loginUser = (
  email: string, 
  password: string
): { user: User; token: string } | { error: string } => {
  try {
    // Find user
    const user = getUserByEmail(email);
    if (!user) {
      return { error: 'Invalid credentials' };
    }
    
    // Generate token
    const token = generateToken(user.id);
    saveToken(user.id, token);
    
    return { user, token };
  } catch (error) {
    return { error: 'Failed to login' };
  }
};

export const parseToken = (token: string): { userId: string } | null => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = JSON.parse(atob(parts[1]));
    if (!payload.sub || !payload.exp) return null;
    
    if (payload.exp < Date.now()) return null; // Token expired
    
    return { userId: payload.sub };
  } catch (error) {
    return null;
  }
};