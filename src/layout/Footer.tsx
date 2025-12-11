import React from 'react';
import { Calculator, Clock, BarChart3 } from 'lucide-react';

interface FooterProps {
  currentPage?: 'calculator' | 'history' | 'statistics';
  onPageChange?: (page: 'calculator' | 'history' | 'statistics') => void;
}

export const Footer: React.FC<FooterProps> = ({ currentPage = 'calculator', onPageChange }) => {
  const menuItems = [
    { id: 'calculator', label: 'Калькулятор', icon: Calculator },
    { id: 'history', label: 'История', icon: Clock },
    { id: 'statistics', label: 'Статистика', icon: BarChart3 },
  ] as const;

  const hasNavigation = !!onPageChange;

  if (!hasNavigation) {
    return (
      <footer className="w-full max-w-md mx-auto text-center text-xs text-[var(--text-tertiary)] py-6">
        <div>© {new Date().getFullYear()} P2P Calc</div>
      </footer>
    );
  }

  return (
    <footer className="nav-bottom">
      <nav className="nav-container">
        {menuItems.map(({ id, label, icon: Icon }) => {
          const isActive = currentPage === id;
          return (
            <button
              key={id}
              onClick={() => onPageChange(id as any)}
              className={`nav-item ${isActive ? 'active' : ''}`}
              title={label}
              aria-label={label}
              tabIndex={0}
              role="button"
            >
              <span className="nav-indicator" />
              <span className="nav-icon">
                <Icon size={24} strokeWidth={isActive ? 2.5 : 1.5} aria-hidden="true" />
              </span>
              <span>{label}</span>
            </button>
          );
        })}
      </nav>
    </footer>
  );
};

export default Footer;
