import React from 'react';
import { DateRange } from '../../types';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { format } from 'date-fns';
import { CalendarRange } from 'lucide-react';
import { getDefaultDateRange } from '../../utils/defaults';

interface DateRangeFilterProps {
  dateRange: DateRange;
  onChange: (dateRange: DateRange) => void;
}

export const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  dateRange,
  onChange,
}) => {
  const handleRangeChange = (type: 'daily' | 'weekly' | 'monthly') => {
    onChange(getDefaultDateRange(type));
  };
  
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartDate = new Date(e.target.value);
    onChange({
      ...dateRange,
      startDate: newStartDate,
      label: 'custom',
    });
  };
  
  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEndDate = new Date(e.target.value);
    newEndDate.setHours(23, 59, 59, 999); // Set to end of day
    onChange({
      ...dateRange,
      endDate: newEndDate,
      label: 'custom',
    });
  };
  
  return (
    <Card className="p-0 overflow-hidden">
      <div className="flex flex-col sm:flex-row">
        <div className="flex-1 border-b sm:border-b-0 sm:border-r border-gray-200 dark:border-gray-700 p-4">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Quick Filters
          </h3>
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant={dateRange.label === 'daily' ? 'primary' : 'outline'}
              onClick={() => handleRangeChange('daily')}
            >
              Today
            </Button>
            <Button
              size="sm"
              variant={dateRange.label === 'weekly' ? 'primary' : 'outline'}
              onClick={() => handleRangeChange('weekly')}
            >
              This Week
            </Button>
            <Button
              size="sm"
              variant={dateRange.label === 'monthly' ? 'primary' : 'outline'}
              onClick={() => handleRangeChange('monthly')}
            >
              This Month
            </Button>
          </div>
        </div>
        
        <div className="flex-1 p-4">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Custom Range
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                Start Date
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-900 dark:text-white text-sm"
                value={format(dateRange.startDate, 'yyyy-MM-dd')}
                onChange={handleStartDateChange}
                max={format(dateRange.endDate, 'yyyy-MM-dd')}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                End Date
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-900 dark:text-white text-sm"
                value={format(dateRange.endDate, 'yyyy-MM-dd')}
                onChange={handleEndDateChange}
                min={format(dateRange.startDate, 'yyyy-MM-dd')}
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800 flex items-center border-t border-gray-200 dark:border-gray-700">
        <CalendarRange className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
        <span className="text-sm text-gray-700 dark:text-gray-300">
          {format(dateRange.startDate, 'MMM d, yyyy')} - {format(dateRange.endDate, 'MMM d, yyyy')}
        </span>
      </div>
    </Card>
  );
};