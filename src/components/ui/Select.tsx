import React from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
  fullWidth?: boolean;
}

export const Select: React.FC<SelectProps> = ({
  label,
  options,
  error,
  fullWidth = true,
  className = '',
  id,
  ...props
}) => {
  const selectId = id || `select-${Math.random().toString(36).substring(2, 9)}`;
  const widthClass = fullWidth ? 'w-full' : '';
  
  return (
    <div className={`${widthClass} ${className}`}>
      {label && (
        <label
          htmlFor={selectId}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          {label}
        </label>
      )}
      <div className="relative rounded-md shadow-sm">
        <select
          id={selectId}
          className={`
            ${widthClass}
            appearance-none pl-4 pr-10 py-2 bg-white dark:bg-gray-900 
            border border-gray-300 dark:border-gray-700 rounded-md shadow-sm 
            focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 
            sm:text-sm dark:text-white
            ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}
          `}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <ChevronDown className="h-4 w-4 text-gray-400 dark:text-gray-500" />
        </div>
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-500">{error}</p>
      )}
    </div>
  );
};