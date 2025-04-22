import React from 'react';
import { Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center md:flex-row md:justify-between">
          <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
            <span>© {new Date().getFullYear()} SmartBudget</span>
            <span>•</span>
            <span>Made with</span>
            <Heart className="h-4 w-4 text-red-500" />
            <span>for your financial health</span>
          </div>
          
          <div className="mt-4 md:mt-0">
            <ul className="flex space-x-6">
              <li>
                <a
                  href="#"
                  className="text-gray-500 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-500 text-sm"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-500 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-500 text-sm"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-500 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-500 text-sm"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};