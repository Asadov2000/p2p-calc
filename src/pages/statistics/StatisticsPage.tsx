import React from 'react';
import { Statistics } from '../../widgets/Statistics/Statistics';
import { BarChart3 } from 'lucide-react';

const StatisticsPage: React.FC = () => {
  return (
    <div className="space-y-5 animate-fade-in">
      <div className="page-header">
        <div className="page-header-icon" style={{ background: 'var(--apple-purple)' }}>
          <BarChart3 size={24} />
        </div>
        <div>
          <h1 className="page-title">Статистика</h1>
          <p className="page-subtitle">Ваши финансовые показатели</p>
        </div>
      </div>
      <Statistics />
    </div>
  );
};

export default StatisticsPage;
