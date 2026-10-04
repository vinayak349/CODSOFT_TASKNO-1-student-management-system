import React from 'react';

export const LoadingSpinner: React.FC<{ label?: string }> = ({ label = 'Loading EduManage...' }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[250px] p-6">
      <div className="relative w-12 h-12">
        <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-brand-200 dark:border-brand-950"></div>
        <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-brand-600 border-t-transparent animate-spin"></div>
      </div>
      <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</p>
    </div>
  );
};
