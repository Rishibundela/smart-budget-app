import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, BarChart2, DollarSign, PieChart, User, LogOut } from 'lucide-react';
import { ThemeToggle } from '../ui/ThemeToggle';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const closeMenu = () => {
    setIsMenuOpen(false);
  };
  
  const handleLogout = () => {
    logout();
    closeMenu();
  };
  
  const navLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: <BarChart2 className="h-5 w-5" /> },
    { path: '/transactions', label: 'Transactions', icon: <DollarSign className="h-5 w-5" /> },
    { path: '/budgets', label: 'Budgets', icon: <PieChart className="h-5 w-5" /> },
    { path: '/profile', label: 'Profile', icon: <User className="h-5 w-5" /> },
  ];
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-10 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <DollarSign className="h-8 w-8 text-emerald-600 dark:text-emerald-500" />
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
                SmartBudget
              </span>
            </Link>
          </div>
          
          {isAuthenticated && (
            <nav className="hidden md:flex space-x-8 items-center">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors duration-200 ${
                    isActive(link.path)
                      ? 'text-emerald-600 dark:text-emerald-500 border-b-2 border-emerald-500'
                      : 'text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-500'
                  }`}
                >
                  {link.icon}
                  <span className="ml-1">{link.label}</span>
                </Link>
              ))}
              <div className="ml-4 flex items-center space-x-4">
                <ThemeToggle />
                <Button
                  variant="ghost"
                  size="sm"
                  leftIcon={<LogOut className="h-5 w-5" />}
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </div>
            </nav>
          )}
          
          {!isAuthenticated && (
            <div className="hidden md:flex items-center space-x-4">
              <ThemeToggle />
              <Link to="/login">
                <Button variant="ghost" size="sm">Login</Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">Sign Up</Button>
              </Link>
            </div>
          )}
          
          <div className="flex items-center md:hidden">
            <ThemeToggle />
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 ml-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-500 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 shadow-lg absolute w-full transition-all duration-200 transform ease-in-out">
          <div className="pt-2 pb-3 space-y-1">
            {isAuthenticated ? (
              <>
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={closeMenu}
                    className={`block pl-3 pr-4 py-2 text-base font-medium ${
                      isActive(link.path)
                        ? 'text-emerald-600 dark:text-emerald-500 bg-emerald-50 dark:bg-emerald-900 dark:bg-opacity-10 border-l-4 border-emerald-500'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    <div className="flex items-center">
                      {link.icon}
                      <span className="ml-2">{link.label}</span>
                    </div>
                  </Link>
                ))}
                <button
                  onClick={handleLogout}
                  className="w-full text-left block pl-3 pr-4 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <div className="flex items-center">
                    <LogOut className="h-5 w-5" />
                    <span className="ml-2">Logout</span>
                  </div>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={closeMenu}
                  className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};