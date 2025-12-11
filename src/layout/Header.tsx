import React from 'react';
import { Sun, Moon, Calculator } from 'lucide-react';
import { useCalculatorStore } from '../features/p2p-calculation/model/store';

export const Header: React.FC = () => {
  const theme = useCalculatorStore((s) => s.theme);
  const toggle = useCalculatorStore((s) => s.toggleTheme);

  return (
    <header className="header w-full max-w-md mx-auto flex items-center justify-between gap-3">
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="w-12 h-12 rounded-2xl bg-gradient-blue flex items-center justify-center shadow-lg glow-blue">
            <Calculator size={24} className="text-white" />
          </div>
        </div>
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-[var(--text-primary)]">
            P2P <span className="text-gradient">Calc</span>
          </h1>
          <p className="text-xs text-[var(--text-tertiary)] font-medium">Калькулятор курса</p>
        </div>
      </div>

      <button 
        onClick={toggle} 
        title="Сменить тему" 
        aria-label="Сменить тему"
        className="btn-icon"
      >
        {theme === 'light' ? (
          <Moon size={20} className="text-[var(--text-tertiary)]" />
        ) : (
          <Sun size={20} className="text-amber-400" />
        )}
      </button>
    </header>
  );
};

export default Header;
