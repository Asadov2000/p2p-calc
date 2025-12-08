import React from 'react';
import { Statistics } from '../../widgets/Statistics/Statistics';

const StatisticsPage: React.FC = () => {
  return (
    <div className="flex flex-col gap-5">
      <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-500/20 dark:to-purple-500/10 rounded-[24px] p-6 border border-purple-200 dark:border-purple-500/30 flex items-center gap-6">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-purple-900 dark:text-purple-100 mb-2">Статистика</h1>
          <p className="text-sm text-purple-800 dark:text-purple-200">Анализируйте ваши финансовые показатели</p>
        </div>
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="hidden sm:block">
          <rect x="8" y="32" width="8" height="24" rx="4" fill="#A78BFA" />
          <rect x="24" y="24" width="8" height="32" rx="4" fill="#7C3AED" />
          <rect x="40" y="16" width="8" height="40" rx="4" fill="#C4B5FD" />
          <rect x="56" y="40" width="8" height="16" rx="4" fill="#DDD6FE" />
        </svg>
      </div>
      <Statistics />
    </div>
  );
};

export default StatisticsPage;
