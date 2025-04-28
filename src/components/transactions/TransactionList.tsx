import React, { useState, useMemo } from 'react';
import { Edit2, Trash2, Filter, ArrowUpRight, ArrowDownRight, Search, MoreHorizontal } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Category, DateRange, Transaction } from '../../types';
import { formatCurrency, formatDate, truncateText } from '../../utils/formatters';
import { Select } from '../ui/Select';

interface TransactionListProps {
  transactions: Transaction[];
  categories: Category[];
  dateRange: DateRange;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  categories,
  dateRange,
  onEdit,
  onDelete,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<'date' | 'amount' | 'category'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Filter and sort transactions
  const filteredTransactions = useMemo(() => {
    let results = [...transactions].filter(transaction => {
      const isInDateRange = 
        new Date(transaction.date) >= dateRange.startDate && 
        new Date(transaction.date) <= dateRange.endDate;
      
      const matchesSearch = 
        transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = 
        typeFilter === 'all' ? true : transaction.type === typeFilter;
      
      const matchesCategory = 
        categoryFilter === 'all' ? true : transaction.categoryId === categoryFilter;
        
      return isInDateRange && matchesSearch && matchesType && matchesCategory;
    });
    
    // Sort results
    results.sort((a, b) => {
      if (sortField === 'date') {
        return sortDirection === 'desc' 
          ? new Date(b.date).getTime() - new Date(a.date).getTime()
          : new Date(a.date).getTime() - new Date(b.date).getTime();
      }
      
      if (sortField === 'amount') {
        return sortDirection === 'desc' 
          ? b.amount - a.amount
          : a.amount - b.amount;
      }
      
      if (sortField === 'category') {
        const catA = categories.find(c => c.id === a.categoryId)?.name || '';
        const catB = categories.find(c => c.id === b.categoryId)?.name || '';
        return sortDirection === 'desc'
          ? catB.localeCompare(catA)
          : catA.localeCompare(catB);
      }
      
      return 0;
    });
    
    return results;
  }, [transactions, dateRange, searchTerm, typeFilter, categoryFilter, sortField, sortDirection, categories]);
  
  // Get category by ID
  const getCategoryById = (id: string): Category | undefined => {
    return categories.find(cat => cat.id === id);
  };
  
  // Toggle sort direction
  const toggleSort = (field: 'date' | 'amount' | 'category') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };
  
  // Get sort icon
  const getSortIcon = (field: 'date' | 'amount' | 'category') => {
    if (sortField !== field) return null;
    
    return sortDirection === 'asc' ? '↑' : '↓';
  };
  
  const toggleFilters = () => {
    setIsFilterOpen(!isFilterOpen);
  };
  
  return (
    <Card className="overflow-hidden">
      <div className="mb-4 flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative flex-1">
          <Input
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search className="h-5 w-5 text-gray-400" />}
          />
        </div>
        
        <Button 
          variant="outline" 
          leftIcon={<Filter className="h-5 w-5" />}
          onClick={toggleFilters}
        >
          Filters
        </Button>
      </div>
      
      {isFilterOpen && (
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <Select
            label="Type"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as 'all' | 'income' | 'expense')}
            options={[
              { value: 'all', label: 'All Transactions' },
              { value: 'income', label: 'Income Only' },
              { value: 'expense', label: 'Expenses Only' },
            ]}
          />
          
          <Select
            label="Category"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All Categories' },
              ...categories.map(cat => ({
                value: cat.id,
                label: cat.name,
              })),
            ]}
          />
          
          <Select
            label="Sort By"
            value={`${sortField}-${sortDirection}`}
            onChange={(e) => {
              const [field, direction] = e.target.value.split('-');
              setSortField(field as 'date' | 'amount' | 'category');
              setSortDirection(direction as 'asc' | 'desc');
            }}
            options={[
              { value: 'date-desc', label: 'Date (Newest First)' },
              { value: 'date-asc', label: 'Date (Oldest First)' },
              { value: 'amount-desc', label: 'Amount (Highest First)' },
              { value: 'amount-asc', label: 'Amount (Lowest First)' },
              { value: 'category-asc', label: 'Category (A-Z)' },
              { value: 'category-desc', label: 'Category (Z-A)' },
            ]}
          />
        </div>
      )}
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                onClick={() => toggleSort('date')}
              >
                <div className="flex items-center">
                  <span>Date</span>
                  {getSortIcon('date') && <span className="ml-1">{getSortIcon('date')}</span>}
                </div>
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Description
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                onClick={() => toggleSort('category')}
              >
                <div className="flex items-center">
                  <span>Category</span>
                  {getSortIcon('category') && <span className="ml-1">{getSortIcon('category')}</span>}
                </div>
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                onClick={() => toggleSort('amount')}
              >
                <div className="flex items-center justify-end">
                  <span>Amount</span>
                  {getSortIcon('amount') && <span className="ml-1">{getSortIcon('amount')}</span>}
                </div>
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((transaction) => {
                const category = getCategoryById(transaction.categoryId);
                return (
                  <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(transaction.date)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {truncateText(transaction.description, 30)}
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
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => onEdit(transaction)}
                          className="text-blue-600 dark:text-blue-500 hover:text-blue-800 dark:hover:text-blue-300"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onDelete(transaction.id)}
                          className="text-red-600 dark:text-red-500 hover:text-red-800 dark:hover:text-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
                  No transactions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};