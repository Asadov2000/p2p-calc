import { memo } from 'react';
import { Copy, Check, TrendingUp, TrendingDown, Target } from 'lucide-react';
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
    <div className="space-y-3 sm:space-y-4 animate-slide-up delay-1">
      {/* Себестоимость */}
      <div className="card-float p-4 sm:p-5 flex-between gap-3">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[var(--primary-light)] flex-center flex-shrink-0">
            <Target size={20} className="text-[var(--primary)] sm:w-[22px] sm:h-[22px]" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[10px] sm:text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wide block truncate">{t.breakEven}</span>
            <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--text-primary)] truncate">
              {breakEven > 0 ? formatCurrency(breakEven) : "0,00"}
            </div>
          </div>
        </div>
        {breakEven > 0 && (
          <button 
            onClick={() => onCopyToClipboard(breakEven.toFixed(2), "breakEven")}
            className="btn-icon flex-shrink-0"
            title="Копировать курс"
            aria-label="Копировать курс"
          >
            {copiedId === "breakEven" ? <Check size={18} className="text-[var(--success)] sm:w-5 sm:h-5" /> : <Copy size={18} className="sm:w-5 sm:h-5" />}
          </button>
        )}
      </div>

      {/* Профит калькулятор */}
      <div className={cn(
        "card-float overflow-hidden transition-all duration-300",
        estimatedProfit > 0 && "glow-green",
        estimatedProfit < 0 && "glow-red"
      )}>
        <div className="p-4 sm:p-5 space-y-3 sm:space-y-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex-1 min-w-0">
              <IosInput 
                label={t.sellPrice}
                value={sellPrice}
                onChange={(val) => handleInputChange(setSellPrice, val)}
                onClear={() => setSellPrice("")}
                symbol="₽"
                placeholder="0"
                transparent
              />
            </div>
            {breakEven > 0 && !sellPrice && (
              <button 
                onClick={() => setSellPrice(formatInputNumber(breakEven.toFixed(2)))}
                className="btn-tinted text-[10px] sm:text-xs font-semibold px-2.5 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl whitespace-nowrap flex-shrink-0"
                aria-label="Копировать закуп"
              >
                Копировать<br/>закуп
              </button>
            )}
          </div>

          {estimatedProfit !== 0 && (
            <div className="pt-3 sm:pt-4 border-t border-[var(--separator)] animate-fade-in">
              <div className="flex-between gap-3">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  <div className={cn(
                    "w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl flex-center flex-shrink-0",
                    isProfit ? "bg-[var(--success-light)]" : "bg-[var(--danger-light)]"
                  )}>
                    {isProfit ? (
                      <TrendingUp size={18} className="text-[var(--success)] sm:w-[22px] sm:h-[22px]" />
                    ) : (
                      <TrendingDown size={18} className="text-[var(--danger)] sm:w-[22px] sm:h-[22px]" />
                    )}
                  </div>
                  <span className="text-[10px] sm:text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wide truncate">{t.profit}</span>
                </div>
                <span className={cn(
                  "text-xl sm:text-2xl font-extrabold tracking-tight flex-shrink-0",
                  isProfit ? "text-[var(--success)]" : "text-[var(--danger)]"
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
