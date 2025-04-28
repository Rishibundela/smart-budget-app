import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { Card } from '../ui/Card';
import { Category, DateRange, Transaction } from '../../types';
import { getCategoryData } from '../../utils/helpers';

ChartJS.register(ArcElement, Tooltip, Legend);

interface SpendingChartProps {
  transactions: Transaction[];
  categories: Category[];
  dateRange: DateRange;
}

export const SpendingChart: React.FC<SpendingChartProps> = ({
  transactions,
  categories,
  dateRange,
}) => {
  const { labels, data, backgroundColor } = getCategoryData(
    transactions,
    categories,
    dateRange
  );
  
  const chartData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor,
        borderColor: backgroundColor.map(() => '#ffffff'),
        borderWidth: 1,
      },
    ],
  };
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          boxWidth: 12,
          padding: 15,
          font: {
            size: 11,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.chart.data.datasets[0].data.reduce((a: number, b: number) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: $${value.toFixed(2)} (${percentage}%)`;
          }
        }
      }
    },
  };
  
  return (
    <Card title="Spending by Category">
      <div className="h-64">
        {data.length > 0 ? (
          <Pie data={chartData} options={options} />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
            No data available for the selected period
          </div>
        )}
      </div>
    </Card>
  );
};