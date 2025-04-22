import React, { useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Card } from '../components/ui/Card';
import { MonthPicker } from '../components/budget/MonthPicker';
import { ReportDownload } from '../components/reports/ReportDownload';
import { useBudget } from '../context/BudgetContext';
import { useAuth } from '../context/AuthContext';
import { generateMonthlyLabels } from '../utils/helpers';
import { formatCurrency } from '../utils/formatters';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const ReportPage: React.FC = () => {
  const { user } = useAuth();
  const { transactions, categories, budgets } = useBudget();
  
  // Set current month and year
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  
  // Go to previous month
  const goToPreviousMonth = () => {
    setMonth(prevMonth => {
      if (prevMonth === 0) {
        setYear(prevYear => prevYear - 1);
        return 11;
      }
      return prevMonth - 1;
    });
  };
  
  // Go to next month
  const goToNextMonth = () => {
    setMonth(prevMonth => {
      if (prevMonth === 11) {
        setYear(prevYear => prevYear + 1);
        return 0;
      }
      return prevMonth + 1;
    });
  };
  
  // Reset to current month
  const resetToCurrentMonth = () => {
    setMonth(today.getMonth());
    setYear(today.getFullYear());
  };
  
  // Filter transactions for the selected month
  const monthlyTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.date);
    return (
      transactionDate.getMonth() === month &&
      transactionDate.getFullYear() === year
    );
  });
  
  // Calculate total income and expenses for the month
  const totalIncome = monthlyTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = monthlyTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  // Calculate expenses by category
  const expensesByCategory = categories.reduce((acc, category) => {
    const amount = monthlyTransactions
      .filter(t => t.categoryId === category.id && t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    if (amount > 0) {
      acc[category.name] = amount;
    }
    
    return acc;
  }, {} as Record<string, number>);
  
  // Calculate monthly comparison data
  const generateMonthlyData = () => {
    const labels = generateMonthlyLabels();
    const incomeData = Array(12).fill(0);
    const expenseData = Array(12).fill(0);
    
    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const monthIndex = date.getMonth();
      
      if (date.getFullYear() === year) {
        if (transaction.type === 'income') {
          incomeData[monthIndex] += transaction.amount;
        } else {
          expenseData[monthIndex] += transaction.amount;
        }
      }
    });
    
    return {
      labels,
      datasets: [
        {
          label: 'Income',
          data: incomeData,
          backgroundColor: '#10B981',
        },
        {
          label: 'Expenses',
          data: expenseData,
          backgroundColor: '#EF4444',
        },
      ],
    };
  };
  
  const monthlyData = generateMonthlyData();
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.dataset.label || '';
            const value = context.raw || 0;
            return `${label}: ${formatCurrency(value)}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: number) {
            return formatCurrency(value, 'en-US', 'USD', 0);
          }
        }
      }
    }
  };
  
  // Calculate top spending categories
  const topCategories = Object.entries(expensesByCategory)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Reports
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          View and download your financial reports
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-8">
        <MonthPicker
          month={month}
          year={year}
          onPrevious={goToPreviousMonth}
          onNext={goToNextMonth}
          onReset={resetToCurrentMonth}
        />
        
        {user && (
          <ReportDownload
            transactions={transactions}
            categories={categories}
            budgets={budgets}
            user={user}
            month={month}
            year={year}
          />
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Income vs Expenses ({year})
            </h3>
            <div className="h-80">
              <Bar data={monthlyData} options={chartOptions} />
            </div>
          </Card>
          
          <Card>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Monthly Summary
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Income</p>
                <p className="text-xl font-semibold text-green-600 dark:text-green-500">
                  {formatCurrency(totalIncome)}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Expenses</p>
                <p className="text-xl font-semibold text-red-600 dark:text-red-500">
                  {formatCurrency(totalExpenses)}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Net Savings</p>
                <p className={`text-xl font-semibold ${totalIncome - totalExpenses >= 0 ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'}`}>
                  {formatCurrency(totalIncome - totalExpenses)}
                </p>
              </div>
              
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <h4 className="text-base font-medium text-gray-900 dark:text-white mb-2">
                  Top Spending Categories
                </h4>
                
                {topCategories.length > 0 ? (
                  <ul className="space-y-2">
                    {topCategories.map(([name, amount], index) => (
                      <li key={index} className="flex justify-between items-center">
                        <span className="text-sm text-gray-700 dark:text-gray-300">{name}</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {formatCurrency(amount)}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No expenses recorded for this month
                  </p>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};