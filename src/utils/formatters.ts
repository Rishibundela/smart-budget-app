import { format, isThisYear } from 'date-fns';

// Format currency
export const formatCurrency = (amount: number, locale = 'en-IN', currency = 'INR'): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Format date for display
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  if (isThisYear(date)) {
    return format(date, 'MMM d');
  }
  return format(date, 'MMM d, yyyy');
};

// Format full date with time
export const formatFullDate = (dateString: string): string => {
  const date = new Date(dateString);
  return format(date, 'PPP');
};

// Format month for display
export const formatMonth = (month: number, year: number): string => {
  const date = new Date(year, month);
  return format(date, 'MMMM yyyy');
};

// Format percentage
export const formatPercentage = (value: number, decimals = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

// Get short month name
export const getShortMonthName = (month: number): string => {
  const date = new Date();
  date.setMonth(month);
  return format(date, 'MMM');
};

// Truncate long text
export const truncateText = (text: string, maxLength = 30): string => {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 3)}...`;
};