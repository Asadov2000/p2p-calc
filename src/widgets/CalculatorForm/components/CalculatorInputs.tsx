import { memo } from 'react';
import { IosInput } from '../../../shared/ui/IosInput';

interface QuickButton {
  label: string;
  value: string;
}

interface CalculatorInputsProps {
  fiatInput: string;
  cryptoInput: string;
  onFiatChange: (val: string) => void;
  onCryptoChange: (val: string) => void;
  onFiatClear: () => void;
  onCryptoClear: () => void;
  quickAmounts: QuickButton[];
  onQuickAmount: (amount: string) => void;
  translations: {
    give: string;
    get: string;
  };
  handleInputChange: (setter: (val: string) => void, value: string) => void;
}

export const CalculatorInputs = memo(({
  fiatInput,
  cryptoInput,
  onFiatChange,
  onCryptoChange,
  onFiatClear,
  onCryptoClear,
  quickAmounts,
  onQuickAmount,
  translations: t,
  handleInputChange,
}: CalculatorInputsProps) => {
  return (
    <div className="bg-white dark:bg-[#1C1C1E] rounded-[28px] p-6 shadow-sm space-y-6">
      {/* Секция: Отдаю (RUB) */}
      <div className="space-y-3">
        <IosInput 
          label={t.give}
          value={fiatInput}
          onChange={(val) => handleInputChange(onFiatChange, val)}
          onClear={onFiatClear}
          symbol="RUB"
          placeholder="0"
        />
         
        {/* Быстрые кнопки */}
        <div className="grid grid-cols-3 gap-2">
          {quickAmounts.map((item, idx) => (
            <button
              key={item.value}
              onClick={() => onQuickAmount(item.value)}
              className={`py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 text-sm font-semibold text-gray-500 dark:text-gray-400 hover:bg-blue-500 hover:text-white dark:hover:bg-blue-600 transition-colors active:scale-95 border border-transparent animate-fade-in quick-btn-delay-${idx}`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
      
      <div className="h-px bg-gray-100 dark:bg-gray-800" />
      
      {/* Секция: Получаю (USDT) */}
      <IosInput 
        label={t.get}
        value={cryptoInput}
        onChange={(val) => handleInputChange(onCryptoChange, val)}
        onClear={onCryptoClear}
        symbol="USDT"
        placeholder="0"
      />
    </div>
  );
});

CalculatorInputs.displayName = 'CalculatorInputs';
