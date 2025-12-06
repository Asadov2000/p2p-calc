import { useCalculatorStore } from "../../features/p2p-calculation/model/store";
import { formatCurrency } from "../../shared/lib/utils";
import { translations } from "../../shared/lib/translations";
import { Trash2 } from "lucide-react";
import WebApp from "@twa-dev/sdk";

export const HistoryList = () => {
  const store = useCalculatorStore();
  const t = translations[store.language];

  if (store.history.length === 0) return null;

  const handleClear = () => {
    WebApp.HapticFeedback.impactOccurred('medium');
    store.clearHistory();
  };

  const restore = (item: typeof store.history[0]) => {
    WebApp.HapticFeedback.selectionChanged();
    store.setFiat(item.fiatAmount.toString());
    store.setCrypto(item.cryptoAmount.toString());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col gap-4 pt-4 border-t border-gray-200 dark:border-white/5">
      {/* Заголовок истории */}
      <div className="flex justify-between items-center px-1">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">{t.history}</h2>
        <button 
          onClick={handleClear}
          className="flex items-center gap-1 text-xs font-medium text-red-500 hover:text-red-600 transition-colors p-2 active:opacity-60"
        >
          <Trash2 size={14} />
          {t.clear}
        </button>
      </div>

      {/* Список */}
      <div className="flex flex-col gap-3">
        {store.history.map((item) => (
          <div 
            key={item.id} 
            onClick={() => restore(item)}
            className="group active:scale-[0.98] transition-all cursor-pointer bg-ios-light-surface dark:bg-ios-dark-surface p-4 rounded-2xl shadow-sm border border-transparent hover:border-ios-blue/20 dark:hover:border-ios-blue/30"
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-semibold text-gray-400 dark:text-gray-500">
                {new Date(item.timestamp).toLocaleDateString()} {new Date(item.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </span>
              <span className="text-lg font-bold text-ios-blue">
                {formatCurrency(item.calculatedRate)}
              </span>
            </div>
            
            <div className="flex justify-between items-end text-sm">
                <div className="flex flex-col gap-0.5">
                    <span className="text-gray-500 dark:text-gray-400">{t.give}: <span className="font-semibold text-gray-900 dark:text-white">{formatCurrency(item.fiatAmount)} ₽</span></span>
                    <span className="text-gray-500 dark:text-gray-400">{t.get}: <span className="font-semibold text-gray-900 dark:text-white">{item.cryptoAmount} ₮</span></span>
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};