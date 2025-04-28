import React from 'react';
import { Card } from '../ui/Card';
import { Transaction, Category } from '../../types';
import { formatCurrency, formatDate, truncateText } from '../../utils/formatters';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface RecentTransactionsProps {
  transactions: Transaction[];
  categories: Category[];
  limit?: number;
}

export const RecentTransactions: React.FC<RecentTransactionsProps> = ({
  transactions,
  categories,
  limit = 5,
}) => {
  // Sort transactions by date (newest first) and limit
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
  
  // Find category by ID
  const getCategoryById = (id: string): Category | undefined => {
    return categories.find((cat) => cat.id === id);
  };
  
  return (
    <Card title="Recent Transactions">
      <div className="overflow-hidden">
        {recentTransactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    Description
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    Category
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                {recentTransactions.map((transaction) => {
                  const category = getCategoryById(transaction.categoryId);
                  return (
                    <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(transaction.date)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {truncateText(transaction.description, 20)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <span
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                          style={{
                            backgroundColor: category ? `${category.color}20` : '#e5e7eb',
                            color: category ? category.color : '#4b5563',
                          }}
                        >
                          {category ? category.name : 'Unknown'}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-right">
                        <div className="flex items-center justify-end">
                          {transaction.type === 'income' ? (
                            <ArrowUpRight className="h-3 w-3 text-green-600 dark:text-green-500 mr-1" />
                          ) : (
                            <ArrowDownRight className="h-3 w-3 text-red-600 dark:text-red-500 mr-1" />
                          )}
                          <span
                            className={
                              transaction.type === 'income'
                                ? 'text-green-600 dark:text-green-500'
                                : 'text-red-600 dark:text-red-500'
                            }
                          >
                            {formatCurrency(transaction.amount)}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-8 text-center text-gray-500 dark:text-gray-400">
            No recent transactions
          </div>
        )}
      </div>
    </Card>
  );
};