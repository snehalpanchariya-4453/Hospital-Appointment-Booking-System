import React from 'react';

const LoadingSpinner = ({ size = 'medium', message = 'Loading...' }) => {
  const sizeClasses = {
    small: 'w-6 h-6 border-2',
    medium: 'w-10 h-10 border-3',
    large: 'w-16 h-16 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-3">
      <div
        className={`${sizeClasses[size] || sizeClasses.medium} border-brand-200 border-t-brand-500 rounded-full animate-spin`}
      />
      {message && <p className="text-sm font-medium text-brand-600 animate-pulse">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;
