import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthState } from '../types';
import { getToken, getUserById, removeToken } from '../utils/localStorage';
import { parseToken } from '../utils/auth';

interface AuthContextType extends AuthState {
  login: (user: User, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
    error: null
  });

  // Check for existing token on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Get token from localStorage
        const savedToken = localStorage.getItem('auth_token');
        if (!savedToken) {
          setAuthState(prev => ({ ...prev, isLoading: false }));
          return;
        }

        // Parse token
        const parsedToken = parseToken(savedToken);
        if (!parsedToken) {
          localStorage.removeItem('auth_token');
          setAuthState(prev => ({ ...prev, isLoading: false }));
          return;
        }

        // Get user data
        const userData = getUserById(parsedToken.userId);
        if (!userData) {
          localStorage.removeItem('auth_token');
          setAuthState(prev => ({ ...prev, isLoading: false }));
          return;
        }

        // Set auth state
        setAuthState({
          user: userData,
          token: savedToken,
          isAuthenticated: true,
          isLoading: false,
          error: null
        });
      } catch (error) {
        setAuthState({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: 'Authentication failed'
        });
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = (user: User, token: string) => {
    // Save token to localStorage
    localStorage.setItem('auth_token', token);
    
    // Update auth state
    setAuthState({
      user,
      token,
      isAuthenticated: true,
      isLoading: false,
      error: null
    });
  };

  // Logout function
  const logout = () => {
    // Clear token from localStorage
    localStorage.removeItem('auth_token');
    
    // Clear user token from tokens store
    if (authState.user) {
      removeToken(authState.user.id);
    }
    
    // Reset auth state
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};