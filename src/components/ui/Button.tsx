import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  leftIcon,
  rightIcon,
  loading = false,
  disabled,
  className = '',
  ...props
}) => {
  const variantClasses = {
    primary: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm',
    secondary: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-sm',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 dark:text-gray-300 dark:hover:bg-gray-800',
    outline: 'bg-transparent border border-gray-300 hover:bg-gray-50 text-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800'
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  const baseClasses = 'inline-flex items-center justify-center font-medium transition-colors duration-200 ease-in-out rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-opacity-50';
  const widthClass = fullWidth ? 'w-full' : '';
  const disabledClass = (disabled || loading) ? 'opacity-60 cursor-not-allowed' : '';
  const focusRingColor = {
    primary: 'focus:ring-emerald-500',
    secondary: 'focus:ring-indigo-500',
    danger: 'focus:ring-red-500',
    ghost: 'focus:ring-gray-500',
    outline: 'focus:ring-gray-500'
  };

  return (
    <button
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${widthClass}
        ${disabledClass}
        ${focusRingColor[variant]}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {!loading && leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {!loading && rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
};