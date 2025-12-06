import { useState, useEffect } from "react";
import { useCalculatorStore } from "../../features/p2p-calculation/model/store";
import { calculateRate, parseNumber } from "../../features/p2p-calculation/lib/math";
import { formatCurrency, formatInputNumber, cn } from "../../shared/lib/utils";
import { translations } from "../../shared/lib/translations";
import { v4 as uuidv4 } from 'uuid';
import WebApp from "@twa-dev/sdk";
import { 
  Copy, Moon, Sun, Info, 
  MessageCircleQuestion, Check, Eraser, X, TrendingUp
} from "lucide-react";

export const CalculatorForm = () => {
  const store = useCalculatorStore();
  const t = translations[store.language];
  
  const [showHintModal, setShowHintModal] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // Локальный стейт для курса продажи (он нужен только здесь и сейчас)
  const [sellPrice, setSellPrice] = useState("");

  const fiat = parseNumber(store.fiatInput);
  const crypto = parseNumber(store.cryptoInput);
  const sellRate = parseNumber(sellPrice);
  
  // 1. Считаем себестоимость
  const breakEven = calculateRate(fiat, crypto);
  
  // 2. Считаем профит: (КурсПродажи * ОбъемКрипты) - ИзначальныеРубли
  const estimatedProfit = sellRate > 0 ? (sellRate * crypto) - fiat : 0;
  const isProfit = estimatedProfit > 0;

  useEffect(() => {
    if (showHintModal) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
  }, [showHintModal]);

  const handleSave = () => {
    if (!fiat || !crypto) return;
    WebApp.HapticFeedback.impactOccurred('medium');
    store.addToHistory({
      id: uuidv4(),
      timestamp: Date.now(),
      fiatAmount: fiat,
      cryptoAmount: crypto,
      profitTarget: estimatedProfit, // Сохраняем профит
      calculatedRate: breakEven
    });
  };

  const handleReset = () => {
    WebApp.HapticFeedback.impactOccurred('light');
    store.resetCalculator();
    setSellPrice("");
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
                {(store.fiatInput || store.cryptoInput || sellPrice) && (
                    <button 
                        onClick={handleReset}
                        className="p-2 rounded-full bg-gray-200/50 dark:bg-gray-800 text-gray-500 hover:text-ios-red transition-all active:scale-90"
                    >
                        <Eraser size={20} />
                    </button>
                )}
            </div>
            
            <div className="flex gap-2">
                 <button onClick={() => setShowHintModal(true)} className="w-10 h-10 rounded-full bg-white dark:bg-ios-dark-surface shadow-sm flex items-center justify-center text-ios-blue active:scale-90 transition-transform"><Info size={20} /></button>
                 <button onClick={store.toggleTheme} className="w-10 h-10 rounded-full bg-white dark:bg-ios-dark-surface shadow-sm flex items-center justify-center text-amber-500 dark:text-ios-blue active:scale-90 transition-transform">{store.theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}</button>
                 <button onClick={() => store.setLanguage(store.language === 'ru' ? 'en' : 'ru')} className="w-10 h-10 rounded-full bg-white dark:bg-ios-dark-surface shadow-sm flex items-center justify-center font-bold text-xs active:scale-90 transition-transform">{store.language.toUpperCase()}</button>
            </div>
        </div>

        {/* Карточка: Ввод данных */}
        <div className="bg-ios-light-surface dark:bg-ios-dark-surface rounded-[24px] p-5 shadow-ios space-y-4 transition-colors duration-300">
            <IosInput 
                label={t.give}
                value={store.fiatInput}
                onChange={(val: string) => handleInputChange(store.setFiat, val)}
                symbol="RUB"
                placeholder="0"
            />
            <div className="h-px bg-gray-100 dark:bg-gray-700 mx-2" />
            <IosInput 
                label={t.get}
                value={store.cryptoInput}
                onChange={(val: string) => handleInputChange(store.setCrypto, val)}
                symbol="USDT"
                placeholder="0"
            />
        </div>

        {/* Карточка: Себестоимость */}
        <div className="bg-ios-light-surface dark:bg-ios-dark-surface rounded-[24px] p-5 shadow-ios flex justify-between items-center transition-colors duration-300">
             <div className="flex flex-col">
                <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">{t.breakEven}</span>
                <span className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {breakEven > 0 ? formatCurrency(breakEven) : "0,00"}
                </span>
             </div>
             {breakEven > 0 && (
                <button 
                    onClick={() => copyToClipboard(breakEven.toFixed(2), "breakEven")}
                    className="p-3 rounded-xl bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-300 active:scale-90 transition-all"
                >
                    {copiedId === "breakEven" ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
                </button>
             )}
        </div>

        {/* Карточка: Расчет прибыли (Акцентная) */}
        <div className="bg-white dark:bg-ios-dark-surface rounded-[24px] p-1 shadow-ios border-2 border-ios-blue/10 dark:border-ios-blue/20 overflow-hidden">
            <div className="bg-ios-blue/5 dark:bg-ios-blue/10 p-4 rounded-[20px] space-y-4">
                
                {/* Поле ввода курса продажи */}
                <div className="flex items-center gap-3">
                    <div className="flex-1">
                        <IosInput 
                            label={t.sellPrice}
                            value={sellPrice}
                            onChange={(val: string) => handleInputChange(setSellPrice, val)}
                            symbol="RUB"
                            placeholder="0"
                            transparent // Прозрачный фон для красоты
                        />
                    </div>
                    {/* Кнопка вставки (если курс безубытка уже есть, можно нажать чтобы подставить его) */}
                    {breakEven > 0 && !sellPrice && (
                        <button 
                            onClick={() => setSellPrice(formatInputNumber(breakEven.toFixed(2)))}
                            className="text-xs font-bold text-ios-blue bg-ios-blue/10 px-3 py-2 rounded-lg active:scale-90 transition-transform"
                        >
                            Вставить<br/>свой
                        </button>
                    )}
                </div>

                {/* Итоговый Профит */}
                {estimatedProfit !== 0 && (
                    <div className="animate-ios-slide pt-2 border-t border-ios-blue/10 dark:border-white/10">
                        <div className="flex justify-between items-end">
                            <span className="text-xs font-bold text-ios-blue uppercase tracking-wider mb-1">{t.profit}</span>
                            <span className={cn(
                                "text-3xl font-black tracking-tight",
                                isProfit ? "text-green-500" : "text-red-500"
                            )}>
                                {estimatedProfit > 0 ? "+" : ""}{formatCurrency(estimatedProfit)} ₽
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>

        <button 
            onClick={handleSave}
            disabled={!fiat || !crypto}
            className="w-full py-4 bg-ios-blue hover:bg-blue-600 active:bg-blue-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:shadow-none"
        >
            {t.save}
        </button>

        <button onClick={openSupport} className="flex items-center justify-center gap-2 text-gray-400 hover:text-ios-blue transition-colors py-2 text-xs font-medium">
            <MessageCircleQuestion size={16} /> {t.support}
        </button>

      </div>

      {/* Модалка */}
      {showHintModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity" onClick={() => setShowHintModal(false)} />
            <div className="relative bg-white dark:bg-zinc-900 w-full max-w-sm rounded-3xl p-6 shadow-2xl animate-ios-slide">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold dark:text-white">{t.hints}</h3>
                    <button onClick={() => setShowHintModal(false)} className="p-1 rounded-full bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-white"><X size={20} /></button>
                </div>
                <div className="space-y-4 text-sm text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line"><p>{t.hintText}</p></div>
                <button onClick={() => setShowHintModal(false)} className="mt-6 w-full py-3 bg-gray-100 dark:bg-white/10 rounded-xl font-semibold text-gray-900 dark:text-white">Понятно</button>
            </div>
        </div>
      )}
    </div>
  );
};

const IosInput = ({ label, value, onChange, symbol, placeholder, transparent }: any) => (
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
        className={cn(
            "w-full h-12 pl-4 pr-12 rounded-xl text-2xl font-bold outline-none transition-all placeholder:text-gray-300 dark:placeholder:text-gray-700",
            transparent 
                ? "bg-transparent text-gray-900 dark:text-white border-b-2 border-ios-blue/20 focus:border-ios-blue" 
                : "bg-gray-100/50 dark:bg-white/5 border border-transparent focus:bg-white dark:focus:bg-black focus:border-ios-blue/50 text-gray-900 dark:text-white"
        )}
      />
      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm select-none">
        {symbol}
      </span>
    </div>
  </div>
);