import React from 'react';
import { HistoryList } from '../../widgets/HistoryList/HistoryList';
import { Clock } from 'lucide-react';

const HistoryPage: React.FC = () => {
  return (
    <div className="space-y-5 animate-fade-in">
      <div className="page-header">
        <div className="page-header-icon">
          <Clock size={24} />
        </div>
        <div>
          <h1 className="page-title">История</h1>
          <p className="page-subtitle">Все расчёты сохранены</p>
        </div>
      </div>
      <HistoryList />
    </div>
  );
};

export default HistoryPage;
