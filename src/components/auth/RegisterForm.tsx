import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Mail, Lock, User } from 'lucide-react';
import { registerUser } from '../../utils/auth';
import { useAuth } from '../../context/AuthContext';

export const RegisterForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = registerUser(name, email, password);
      
      if ('error' in result) {
        setError(result.error);
        return;
      }
      
      login(result.user, result.token);
      navigate('/dashboard');
    } catch (err) {
      setError('Registration failed. Please try again.');
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
        type="text"
        id="name"
        label="Full Name"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        leftIcon={<User className="h-5 w-5 text-gray-400" />}
        required
      />
      
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
        placeholder="Create a password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        leftIcon={<Lock className="h-5 w-5 text-gray-400" />}
        required
      />
      
      <Input
        type="password"
        id="confirmPassword"
        label="Confirm Password"
        placeholder="Confirm your password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        leftIcon={<Lock className="h-5 w-5 text-gray-400" />}
        required
      />
      
      <Button
        type="submit"
        fullWidth
        loading={isLoading}
      >
        Create Account
      </Button>
    </form>
  );
};