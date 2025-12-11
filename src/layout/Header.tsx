import React from 'react';
import { Avatar } from '../shared/ui/Avatar';
import { Sun, Moon, Settings } from 'lucide-react';
import { useCalculatorStore } from '../features/p2p-calculation/model/store';

export const Header: React.FC = () => {
  const theme = useCalculatorStore((s) => s.theme);
  const toggle = useCalculatorStore((s) => s.toggleTheme);

  return (
    <header className="w-full max-w-md mx-auto flex items-center justify-between gap-3 py-4">
      <div className="flex items-center gap-3">
        <Avatar size={40} className="shadow-lg" />
        <div>
          <h1 className="text-lg font-bold">P2P Calc</h1>
          <p className="text-xs text-gray-500">Fast P2P rate & profit calculator</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button onClick={toggle} title="Toggle theme" className="w-10 h-10 rounded-full bg-white dark:bg-[#1C1C1E] flex items-center justify-center shadow-sm">
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>
        <button title="Settings" className="w-10 h-10 rounded-full bg-white dark:bg-[#1C1C1E] flex items-center justify-center shadow-sm">
          <Settings size={18} />
        </button>
      </div>
    </header>
  );
};

export default Header;
