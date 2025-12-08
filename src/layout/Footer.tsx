import React from 'react';
import { Calculator, History, BarChart3 } from 'lucide-react';

interface FooterProps {
  currentPage?: 'calculator' | 'history' | 'statistics';
  onPageChange?: (page: 'calculator' | 'history' | 'statistics') => void;
}

export const Footer: React.FC<FooterProps> = ({ currentPage = 'calculator', onPageChange }) => {
  const menuItems = [
    { id: 'calculator', label: 'Калькулятор', icon: Calculator },
    { id: 'history', label: 'История', icon: History },
    { id: 'statistics', label: 'Статистика', icon: BarChart3 },
  ] as const;

  const hasNavigation = !!onPageChange;

  if (!hasNavigation) {
    return (
      <footer className="w-full max-w-md mx-auto text-center text-xs text-gray-400 py-6">
        <div>© {new Date().getFullYear()} P2P Calc — lightweight, privacy-first</div>
      </footer>
    );
  }

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#1C1C1E] border-t border-gray-200 dark:border-white/10">
      <div className="max-w-md mx-auto px-4 py-2">
        <div className="flex justify-around items-center">
          {menuItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onPageChange(id as any)}
              className={`flex flex-col items-center gap-1 py-3 px-4 rounded-[16px] transition-all text-xs font-medium min-w-[64px] min-h-[56px] active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-black ${
                currentPage === id
                  ? 'text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-500/30'
                  : 'text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400'
              }`}
              title={label}
              aria-label={label}
              tabIndex={0}
              role="button"
            >
              <Icon size={28} aria-hidden="true" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
