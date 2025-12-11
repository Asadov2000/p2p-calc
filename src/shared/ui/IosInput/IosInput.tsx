import React, { memo, useCallback, useState } from 'react';
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
  const [isFocused, setIsFocused] = useState(false);
  
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  }, [onChange]);

  return (
    <div className="input-group w-full">
      <label className={cn(
        "input-label transition-colors duration-200",
        isFocused && "text-[var(--primary)]"
      )}>
        {label}
      </label>
      <div className={cn(
        "input-container",
        transparent && "bg-transparent border-b border-[var(--separator)] rounded-none p-0 pb-3",
        !transparent && isFocused && "bg-[var(--bg-primary)] border-[var(--primary)] shadow-[0_0_0_4px_var(--primary-light)]"
      )}>
        <input
          type="text"
          inputMode="decimal"
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="input-field pr-20"
        />
        <div className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          {value && onClear && !transparent && (
            <button 
              onClick={onClear} 
              className="text-[var(--text-quaternary)] hover:text-[var(--text-tertiary)] transition-colors active:scale-90 flex-shrink-0" 
              title="Очистить"
              type="button"
            >
              <XCircle size={18} fill="currentColor" className="sm:w-5 sm:h-5" />
            </button>
          )}
          <span className={cn(
            "font-semibold text-xs sm:text-sm px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md transition-all flex-shrink-0",
            isFocused 
              ? "text-[var(--primary)] bg-[var(--primary-light)]" 
              : "text-[var(--text-tertiary)]"
          )}>
            {symbol}
          </span>
        </div>
      </div>
    </div>
  );
});

IosInput.displayName = 'IosInput';
