import React from 'react';
import { HistoryList } from '../../widgets/HistoryList/HistoryList';

const HistoryPage: React.FC = () => {
  return (
    <div className="flex flex-col gap-5">
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-500/20 dark:to-blue-500/10 rounded-[24px] p-6 border border-blue-200 dark:border-blue-500/30">
        <h1 className="text-2xl font-bold text-blue-900 dark:text-blue-100 mb-2">История транзакций</h1>
        <p className="text-sm text-blue-800 dark:text-blue-200">Все ваши расчеты сохранены и готовы к просмотру</p>
      </div>
      <HistoryList />
    </div>
  );
};

export default HistoryPage;
