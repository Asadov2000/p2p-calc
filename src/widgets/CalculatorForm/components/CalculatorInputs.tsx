import { memo } from 'react';
import { IosInput } from '../../../shared/ui/IosInput';
import { ArrowDownUp } from 'lucide-react';

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
    <div className="card-float p-6 space-y-5 animate-fade-in">
      {/* Секция: Отдаю (RUB) */}
      <div className="space-y-4">
        <IosInput 
          label={t.give}
          value={fiatInput}
          onChange={(val) => handleInputChange(onFiatChange, val)}
          onClear={onFiatClear}
          symbol="₽"
          placeholder="0"
        />
         
        {/* Быстрые кнопки */}
        <div className="grid grid-cols-3 gap-2">
          {quickAmounts.map((item, idx) => (
            <button
              key={item.value}
              onClick={() => onQuickAmount(item.value)}
              className={`btn-quick delay-${idx + 1}`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* Разделитель с иконкой */}
      <div className="flex items-center gap-4 py-2">
        <div className="flex-1 h-px bg-[var(--separator)]" />
        <div className="w-10 h-10 rounded-xl bg-[var(--fill-tertiary)] flex items-center justify-center">
          <ArrowDownUp size={18} className="text-[var(--text-tertiary)]" />
        </div>
        <div className="flex-1 h-px bg-[var(--separator)]" />
      </div>
      
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
