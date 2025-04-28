import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { formatMonth } from '../../utils/formatters';

interface MonthPickerProps {
  month: number;
  year: number;
  onPrevious: () => void;
  onNext: () => void;
  onReset: () => void;
}

export const MonthPicker: React.FC<MonthPickerProps> = ({
  month,
  year,
  onPrevious,
  onNext,
  onReset,
}) => {
  const isCurrentMonth = () => {
    const now = new Date();
    return month === now.getMonth() && year === now.getFullYear();
  };
  
  return (
    <Card>
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={onPrevious}
          leftIcon={<ChevronLeft className="h-5 w-5" />}
          aria-label="Previous month"
        >
          Previous
        </Button>
        
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">
          {formatMonth(month, year)}
        </h2>
        
        <div className="flex space-x-2">
          {!isCurrentMonth() && (
            <Button variant="outline" size="sm" onClick={onReset}>
              Today
            </Button>
          )}
          
          <Button
            variant="ghost"
            onClick={onNext}
            rightIcon={<ChevronRight className="h-5 w-5" />}
            aria-label="Next month"
          >
            Next
          </Button>
        </div>
      </div>
    </Card>
  );
};