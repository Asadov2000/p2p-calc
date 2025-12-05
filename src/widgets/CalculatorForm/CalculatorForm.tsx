import { useState, useEffect } from "react";
import { useCalculatorStore } from "../../features/p2p-calculation/model/store";
import { calculateRate, parseNumber } from "../../features/p2p-calculation/lib/math";
import { formatCurrency, formatInputNumber, cn } from "../../shared/lib/utils";
import { translations } from "../../shared/lib/translations";
import { v4 as uuidv4 } from 'uuid';
import WebApp from "@twa-dev/sdk";
import { 
  Copy, Moon, Sun, Info, 
  MessageCircleQuestion, Check, Eraser, X
} from "lucide-react";

export const CalculatorForm = () => {
  const store = useCalculatorStore();
  const t = translations[store.language];
  
  const [showHintModal, setShowHintModal] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fiat = parseNumber(store.fiatInput);
  const crypto = parseNumber(store.cryptoInput);
  
  // ПРОСТОЙ РАСЧЕТ: Сумма / Команда
  const rate = calculateRate(fiat, crypto);

  useEffect(() => {
    if (showHintModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [showHintModal]);

  const handleSave = () => {
    if (!fiat || !crypto) return;
    WebApp.HapticFeedback.impactOccurred('medium');
    store.addToHistory({
      id: uuidv4(),
      timestamp: Date.now(),
      fiatAmount: fiat,
      cryptoAmount: crypto,
      profitTarget: 0,
      calculatedRate: rate
    });
  };

  const handleReset = () => {
    WebApp.HapticFeedback.impactOccurred('light');
    store.resetCalculator();
  };

  const copyToClipboard = (text: string, id: string) => {
    if (!text || text === '0,00') return;
    navigator.clipboard.writeText(text);
    WebApp.HapticFeedback.notificationOccurred('success');
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const openSupport = () => WebApp.openTelegramLink('https://t.me/Asadov_p2p');

  const handleInputChange = (setter: (val: string) => void, value: string) => {
    setter(formatInputNumber(value));
  };

  return (
    <div className="min-h-screen -m-4 p-5 bg-ios-light-bg dark:bg-ios-dark-bg text-ios-light-text dark:text-ios-dark-text transition-colors duration-300 font-sans selection:bg-ios-blue/20">
      
      <div className="max-w-md mx-auto flex flex-col gap-6 animate-ios-slide pb-10">
        
        {/* Хедер */}
        <div className="flex justify-between items-center px-1 pt-2">
            <div className="flex items-center gap-3 min-h-[40px]">
                {(store.fiatInput || store.cryptoInput) && (
                    <button 
                        onClick={handleReset}
                        className="p-2 rounded-full bg-gray-200/50 dark:bg-gray-800 text-gray-500 hover:text-ios-red transition-all active:scale-90"
                    >
                        <Eraser size={20} />
                    </button>
                )}
            </div>
            
            <div className="flex gap-2">
                 <button 
                    onClick={() => setShowHintModal(true)}
                    className="w-10 h-10 rounded-full bg-white dark:bg-ios-dark-surface shadow-sm flex items-center justify-center text-ios-blue active:scale-90 transition-transform"
                >
                    <Info size={20} />
                </button>

                <button 
                    onClick={store.toggleTheme}
                    className="w-10 h-10 rounded-full bg-white dark:bg-ios-dark-surface shadow-sm flex items-center justify-center text-amber-500 dark:text-ios-blue active:scale-90 transition-transform"
                >
                    {store.theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                </button>

                <button 
                    onClick={() => store.setLanguage(store.language === 'ru' ? 'en' : 'ru')}
                    className="w-10 h-10 rounded-full bg-white dark:bg-ios-dark-surface shadow-sm flex items-center justify-center font-bold text-xs active:scale-90 transition-transform"
                >
                    {store.language.toUpperCase()}
                </button>
            </div>
        </div>

        {/* Форма ввода (2 поля) */}
        <div className="bg-ios-light-surface dark:bg-ios-dark-surface rounded-[24px] p-5 shadow-ios space-y-4 transition-colors duration-300">
            <IosInput 
                label={t.give} // "Сумма"
                value={store.fiatInput}
                onChange={(val: string) => handleInputChange(store.setFiat, val)}
                symbol="RUB"
                placeholder="0"
            />
            
            <div className="h-px bg-gray-100 dark:bg-gray-700 mx-2" />

            <IosInput 
                label={t.get} // "Сумма зачисляемая команде"
                value={store.cryptoInput}
                onChange={(val: string) => handleInputChange(store.setCrypto, val)}
                symbol="USDT"
                placeholder="0"
            />
        </div>

        {/* Результат (Только Курс) */}
        <div className="bg-ios-light-surface dark:bg-ios-dark-surface rounded-[24px] p-6 shadow-ios transition-colors duration-300 relative overflow-hidden">
             
             <div className="space-y-2 text-center py-2">
                <span className="text-gray-400 dark:text-gray-500 text-xs font-bold uppercase tracking-wider block mb-2">{t.breakEven}</span>
                
                <div className="flex items-center justify-center gap-3">
                    <span className={cn(
                        "font-bold tracking-tight text-5xl transition-all", 
                        rate > 0 ? "text-ios-blue" : "text-gray-300 dark:text-gray-700"
                    )}>
                        {rate > 0 ? formatCurrency(rate) : "0,00"}
                    </span>
                    
                    {/* Кнопка копирования */}
                    {rate > 0 && (
                        <button 
                            onClick={() => copyToClipboard(rate.toFixed(2), "mainResult")}
                            className="p-3 rounded-2xl bg-ios-blue/10 text-ios-blue hover:bg-ios-blue/20 transition-colors active:scale-90"
                        >
                            {copiedId === "mainResult" ? <Check size={24} /> : <Copy size={24} />}
                        </button>
                    )}
                </div>
             </div>

             <button 
                onClick={handleSave}
                disabled={!fiat || !crypto}
                className="mt-6 w-full py-4 bg-ios-blue hover:bg-blue-600 active:bg-blue-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:shadow-none"
             >
                {t.save}
             </button>
        </div>

        <button 
            onClick={openSupport}
            className="flex items-center justify-center gap-2 text-gray-400 hover:text-ios-blue transition-colors py-4 text-xs font-medium"
        >
            <MessageCircleQuestion size={16} />
            {t.support}
        </button>

      </div>

      {/* Модалка с подсказками */}
      {showHintModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
            <div 
                className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
                onClick={() => setShowHintModal(false)}
            />
            <div className="relative bg-white dark:bg-zinc-900 w-full max-w-sm rounded-3xl p-6 shadow-2xl animate-ios-slide">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold dark:text-white">{t.hints}</h3>
                    <button 
                        onClick={() => setShowHintModal(false)}
                        className="p-1 rounded-full bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-white"
                    >
                        <X size={20} />
                    </button>
                </div>
                <div className="space-y-4 text-sm text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                    <p>{t.hintText}</p>
                </div>
                <button 
                    onClick={() => setShowHintModal(false)}
                    className="mt-6 w-full py-3 bg-gray-100 dark:bg-white/10 rounded-xl font-semibold text-gray-900 dark:text-white"
                >
                    Понятно
                </button>
            </div>
        </div>
      )}

    </div>
  );
};

// Компонент ввода остался тем же, но дублирую для целостности
const IosInput = ({ label, value, onChange, symbol, placeholder }: any) => (
  <div className="flex flex-col gap-1.5 w-full">
    <label className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide ml-1 truncate pr-2">
      {label}
    </label>
    <div className="relative group">
      <input
        type="text"
        inputMode="decimal"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-14 pl-4 pr-12 rounded-xl bg-gray-100/50 dark:bg-white/5 border border-transparent focus:bg-white dark:focus:bg-black focus:border-ios-blue/50 text-2xl font-bold text-gray-900 dark:text-white outline-none transition-all placeholder:text-gray-300 dark:placeholder:text-gray-700"
      />
      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm select-none">
        {symbol}
      </span>
    </div>
  </div>
);