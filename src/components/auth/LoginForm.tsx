import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Mail, Lock } from 'lucide-react';
import { loginUser } from '../../utils/auth';
import { useAuth } from '../../context/AuthContext';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = loginUser(email, password);
      
      if ('error' in result) {
        setError(result.error);
        return;
      }
      
      login(result.user, result.token);
      navigate('/dashboard');
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 dark:bg-red-900 dark:bg-opacity-20 text-red-800 dark:text-red-400 p-3 rounded-md text-sm">
          {error}
        </div>
      )}
      
      <Input
        type="email"
        id="email"
        label="Email Address"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        leftIcon={<Mail className="h-5 w-5 text-gray-400" />}
        required
      />
      
      <Input
        type="password"
        id="password"
        label="Password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        leftIcon={<Lock className="h-5 w-5 text-gray-400" />}
        required
      />
      
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
            Remember me
          </label>
        </div>
        
        <div className="text-sm">
          <a href="#" className="font-medium text-emerald-600 dark:text-emerald-500 hover:underline">
            Forgot your password?
          </a>
        </div>
      </div>
      
      <Button
        type="submit"
        fullWidth
        loading={isLoading}
      >
        Login
      </Button>
    </form>
  );
};