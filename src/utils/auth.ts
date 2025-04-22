import { v4 as uuidv4 } from 'uuid';
import { createUser, getUserByEmail, saveToken } from './localStorage';
import { User } from '../types';

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
    
    // Create new user (in a real app, we would hash the password)
    const user = createUser({ 
      name, 
      email,
      // We don't actually store the password in localStorage for security reasons
      // In a real app, we would hash the password with bcrypt and store that
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
    
    // In a real app, we would verify the password hash here
    // For this demo, we just assume the password is correct
    
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