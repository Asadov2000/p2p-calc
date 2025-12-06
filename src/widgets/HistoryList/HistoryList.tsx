import { useCalculatorStore } from "../../features/p2p-calculation/model/store";
import { formatCurrency, formatTime } from "../../shared/lib/utils";
import { translations } from "../../shared/lib/translations";
import { Trash2, TrendingUp, ArrowRight } from "lucide-react";

export const HistoryList = () => {
  const store = useCalculatorStore();
  const t = translations[store.language];

  if (store.history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 opacity-40">
        <div className="w-16 h-16 bg-gray-200 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
            <Trash2 size={32} />
        </div>
        <p className="text-sm font-medium">{t.historyEmpty || "История пуста"}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-20 animate-ios-slide">
      <div className="flex justify-between items-end px-2">
         <h2 className="text-xl font-bold dark:text-white">История</h2>
         <button 
           onClick={store.clearHistory}
           className="text-xs font-medium text-red-500 bg-red-50 dark:bg-red-500/10 px-3 py-1.5 rounded-lg active:scale-95 transition-transform"
         >
           Очистить
         </button>
      </div>

      <div className="flex flex-col gap-3">
        {store.history.map((item) => (
          <div 
            key={item.id} 
            className="bg-white dark:bg-ios-dark-surface p-4 rounded-[20px] shadow-sm border border-gray-100 dark:border-white/5 flex justify-between items-center"
          >
            {/* Левая часть: Суммы обмена */}
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white">
                    <span>{formatCurrency(item.fiatAmount)} ₽</span>
                    <ArrowRight size={14} className="text-gray-400" />
                    <span>{item.cryptoAmount} USDT</span>
                </div>
                <div className="text-[10px] text-gray-400 font-medium flex gap-2">
                    <span>{formatTime(item.timestamp)}</span>
                    <span className="w-px h-3 bg-gray-300 dark:bg-gray-600"></span>
                    <span>Курс: {item.calculatedRate.toFixed(2)}</span>
                </div>
            </div>

            {/* Правая часть: ПРОФИТ */}
            <div className="flex flex-col items-end">
                <span className="text-[10px] uppercase font-bold text-gray-400 mb-0.5">Профит</span>
                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${
                    (item.profitTarget || 0) > 0 
                    ? "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400" 
                    : "bg-gray-100 dark:bg-gray-800 text-gray-500"
                }`}>
                    {(item.profitTarget || 0) > 0 && <TrendingUp size={12} />}
                    <span className="font-bold text-sm">
                        {item.profitTarget ? `+${formatCurrency(item.profitTarget)}` : "0"} ₽
                    </span>
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};