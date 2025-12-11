import React, { memo, useCallback } from 'react';
import { XCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface IosInputProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  symbol: string;
  placeholder?: string;
  transparent?: boolean;
  onClear?: () => void;
}

export const IosInput = memo(({ label, value, onChange, symbol, placeholder, transparent, onClear }: IosInputProps) => {
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  }, [onChange]);

  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider ml-1 truncate">
        {label}
      </label>
      <div className="relative group">
        <input
          type="text"
          inputMode="decimal"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className={cn(
              "w-full h-[52px] pl-4 pr-12 rounded-2xl text-[22px] font-semibold outline-none transition-all placeholder:text-gray-300 dark:placeholder:text-gray-700",
              transparent 
                  ? "bg-transparent text-gray-900 dark:text-white border-b-2 border-gray-100 dark:border-white/10 focus:border-blue-500 px-0 rounded-none h-14" 
                  : "bg-gray-100/70 dark:bg-black/40 border border-transparent focus:bg-white dark:focus:bg-black focus:border-blue-500/50 text-gray-900 dark:text-white shadow-inner"
          )}
        />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center pr-4 gap-3">
           {value && onClear && !transparent && (
               <button 
                 onClick={onClear} 
                 className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors" 
                 title="Очистить"
                 type="button"
               >
                 <XCircle size={18} fill="currentColor" className="opacity-40" />
               </button>
           )}
           <span className="text-gray-400 font-bold text-sm select-none">
              {symbol}
           </span>
        </div>
      </div>
    </div>
  );
});

IosInput.displayName = 'IosInput';
