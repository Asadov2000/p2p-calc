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
    <div className="space-y-4 animate-slide-up delay-1">
      {/* Себестоимость */}
      <div className="card-float p-5 flex-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[var(--primary-light)] flex-center">
            <Target size={22} className="text-[var(--primary)]" />
          </div>
          <div>
            <span className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wide">{t.breakEven}</span>
            <div className="text-3xl font-extrabold tracking-tight text-[var(--text-primary)]">
              {breakEven > 0 ? formatCurrency(breakEven) : "0,00"}
            </div>
          </div>
        </div>
        {breakEven > 0 && (
          <button 
            onClick={() => onCopyToClipboard(breakEven.toFixed(2), "breakEven")}
            className="btn-icon"
            title="Копировать курс"
            aria-label="Копировать курс"
          >
            {copiedId === "breakEven" ? <Check size={20} className="text-[var(--success)]" /> : <Copy size={20} />}
          </button>
        )}
      </div>

      {/* Профит калькулятор */}
      <div className={cn(
        "card-float overflow-hidden transition-all duration-300",
        estimatedProfit > 0 && "glow-green",
        estimatedProfit < 0 && "glow-red"
      )}>
        <div className="p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex-1">
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
                className="btn-tinted text-xs font-semibold px-4 py-3 rounded-xl whitespace-nowrap"
                aria-label="Копировать закуп"
              >
                Копировать<br/>закуп
              </button>
            )}
          </div>

          {estimatedProfit !== 0 && (
            <div className="pt-4 border-t border-[var(--separator)] animate-fade-in">
              <div className="flex-between">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-11 h-11 rounded-xl flex-center",
                    isProfit ? "bg-[var(--success-light)]" : "bg-[var(--danger-light)]"
                  )}>
                    {isProfit ? (
                      <TrendingUp size={22} className="text-[var(--success)]" />
                    ) : (
                      <TrendingDown size={22} className="text-[var(--danger)]" />
                    )}
                  </div>
                  <span className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wide">{t.profit}</span>
                </div>
                <span className={cn(
                  "text-2xl font-extrabold tracking-tight",
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
