import React from 'react';
import { Loader2 } from 'lucide-react';

export const Spinner = ({ size = 'md', className = '', message }) => {
  const sizeMap = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-10 w-10',
  };

  return (
    <div className={`flex flex-col items-center justify-center p-6 ${className}`}>
      <Loader2 className={`animate-spin text-brand-600 ${sizeMap[size] || sizeMap.md}`} />
      {message && <p className="mt-2 text-xs font-medium text-slate-500">{message}</p>}
    </div>
  );
};
