import { memo } from 'react';
import { Copy, Check } from 'lucide-react';
import { formatCurrency, formatInputNumber, cn } from '../../../shared/lib/utils';
import { IosInput } from '../../../shared/ui/IosInput';

interface CalculatorResultsProps {
  breakEven: number;
  sellPrice: string;
  setSellPrice: (val: string) => void;
  estimatedProfit: number;
  isProfit: boolean;
  copiedId: string | null;
  onCopyToClipboard: (text: string, id: string) => void;
  translations: {
    breakEven: string;
    sellPrice: string;
    profit: string;
  };
  handleInputChange: (setter: (val: string) => void, value: string) => void;
}

export const CalculatorResults = memo(({
  breakEven,
  sellPrice,
  setSellPrice,
  estimatedProfit,
  isProfit,
  copiedId,
  onCopyToClipboard,
  translations: t,
  handleInputChange,
}: CalculatorResultsProps) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      {/* Себестоимость */}
      <div className="bg-white dark:bg-[#1C1C1E] rounded-[24px] p-5 shadow-sm flex justify-between items-center">
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{t.breakEven}</span>
          <span className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {breakEven > 0 ? formatCurrency(breakEven) : "0,00"}
          </span>
        </div>
        {breakEven > 0 && (
          <button 
            onClick={() => onCopyToClipboard(breakEven.toFixed(2), "breakEven")}
            className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-white/10 text-gray-400 dark:text-gray-300 flex items-center justify-center active:scale-90 transition-all hover:text-blue-500"
            title="Копировать курс"
            aria-label="Копировать курс"
            tabIndex={0}
            role="button"
          >
            {copiedId === "breakEven" ? <Check size={22} className="text-green-500" /> : <Copy size={22} />}
          </button>
        )}
      </div>

      {/* Профит калькулятор */}
      <div className="bg-white dark:bg-[#1C1C1E] rounded-[24px] p-2 shadow-sm border border-blue-100 dark:border-blue-900/30 overflow-hidden relative animate-scale-up">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent dark:from-blue-900/10 pointer-events-none" />
        
        <div className="relative p-4 space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <IosInput 
                label={t.sellPrice}
                value={sellPrice}
                onChange={(val) => handleInputChange(setSellPrice, val)}
                onClear={() => setSellPrice("")}
                symbol="RUB"
                placeholder="0"
                transparent
              />
            </div>
            {breakEven > 0 && !sellPrice && (
              <button 
                onClick={() => setSellPrice(formatInputNumber(breakEven.toFixed(2)))}
                className="text-[11px] font-bold text-blue-600 bg-blue-100 dark:bg-blue-500/20 px-3 py-2.5 rounded-xl active:scale-90 transition-transform"
                aria-label="Копировать закуп"
                tabIndex={0}
                role="button"
              >
                Копировать<br/>закуп
              </button>
            )}
          </div>

          {estimatedProfit !== 0 && (
            <div className="pt-3 border-t border-blue-100 dark:border-white/10 animate-ios-slide">
              <div className="flex justify-between items-end">
                <span className="text-[11px] font-bold text-blue-500 uppercase tracking-widest mb-1">{t.profit}</span>
                <span className={cn(
                  "text-3xl font-black tracking-tight",
                  isProfit ? "text-[#34C759]" : "text-[#FF3B30]"
                )}>
                  {estimatedProfit > 0 ? "+" : ""}{formatCurrency(estimatedProfit)} ₽
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

CalculatorResults.displayName = 'CalculatorResults';
