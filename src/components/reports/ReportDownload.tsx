import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { DownloadCloud, FileText } from 'lucide-react';
import { Budget, Category, Transaction, User } from '../../types';
import { formatMonth } from '../../utils/formatters';
import { exportTransactionsAsPdf } from '../../utils/exportPdf';

interface ReportDownloadProps {
  transactions: Transaction[];
  categories: Category[];
  budgets: Budget[];
  user: User;
  month: number;
  year: number;
}

export const ReportDownload: React.FC<ReportDownloadProps> = ({
  transactions,
  categories,
  budgets,
  user,
  month,
  year,
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  
  // Filter transactions for the selected month
  const monthlyTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.date);
    return (
      transactionDate.getMonth() === month &&
      transactionDate.getFullYear() === year
    );
  });
  
  const downloadReport = () => {
    setIsDownloading(true);
    
    try {
      exportTransactionsAsPdf(
        monthlyTransactions,
        categories,
        user,
        month,
        year
      );
    } catch (error) {
      console.error('Failed to generate PDF:', error);
    } finally {
      setIsDownloading(false);
    }
  };
  
  return (
    <Card>
      <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
        <div className="flex items-center">
          <FileText className="h-6 w-6 text-gray-600 dark:text-gray-400 mr-3" />
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Monthly Report
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Download your financial report for {formatMonth(month, year)}
            </p>
          </div>
        </div>
        
        <Button
          leftIcon={<DownloadCloud className="h-5 w-5" />}
          onClick={downloadReport}
          loading={isDownloading}
          disabled={monthlyTransactions.length === 0}
        >
          Download PDF
        </Button>
      </div>
    </Card>
  );
};