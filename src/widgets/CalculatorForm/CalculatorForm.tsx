import { useState, useEffect, useMemo, useCallback } from "react";
import { useCalculatorStore } from "../../features/p2p-calculation/model/store";
import { calculateRate, parseNumber } from "../../features/p2p-calculation/lib/math";
import { formatCurrency, formatInputNumber, cn } from "../../shared/lib/utils";
import { translations } from "../../shared/lib/translations";
import { v4 as uuidv4 } from 'uuid';
import WebApp from "@twa-dev/sdk";
import { 
  Copy, Moon, Sun, Info, 
  MessageCircleQuestion, Check, Eraser, X, XCircle,
  TrendingUp, Wallet, ArrowRightLeft
} from "lucide-react";

interface IosInputProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  symbol: string;
  placeholder?: string;
  transparent?: boolean;
  onClear?: () => void;
}

export const CalculatorForm = () => {
  const store = useCalculatorStore();
  const t = translations[store.language];
  
  const [showHintModal, setShowHintModal] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [sellPrice, setSellPrice] = useState("");

  const quickAmounts = [
    { value: "5000", label: "5k" },
    { value: "10000", label: "10k" },
    { value: "15000", label: "15k" },
    { value: "25000", label: "25k" },
    { value: "50000", label: "50k" },
    { value: "100000", label: "100k" },
  ];

  const fiat = useMemo(() => parseNumber(store.fiatInput), [store.fiatInput]);
  const crypto = useMemo(() => parseNumber(store.cryptoInput), [store.cryptoInput]);
  const sellRate = useMemo(() => parseNumber(sellPrice), [sellPrice]);
  
  const breakEven = useMemo(() => calculateRate(fiat, crypto), [fiat, crypto]);
  
  const estimatedProfit = useMemo(() => {
    if (sellRate <= 0) return 0;
    return (sellRate * crypto) - fiat;
  }, [sellRate, crypto, fiat]);

  const isProfit = estimatedProfit > 0;

  useEffect(() => {
    document.body.style.overflow = showHintModal ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [showHintModal]);

  const handleSave = useCallback(() => {
    if (!fiat || !crypto) return;
    WebApp.HapticFeedback.impactOccurred('medium');
    
    const historyItem = {
      id: uuidv4(),
      timestamp: Date.now(),
      fiatAmount: fiat,
      cryptoAmount: crypto,
      profitTarget: estimatedProfit,
      calculatedRate: breakEven,
      sellPrice: sellRate > 0 ? sellRate : undefined 
    };

    store.addToHistory(historyItem);
    WebApp.showAlert(`Сохранено! Профит: ${formatCurrency(estimatedProfit)} ₽`);
    
  }, [fiat, crypto, estimatedProfit, breakEven, sellRate, store]);

  const handleReset = useCallback(() => {
    WebApp.HapticFeedback.impactOccurred('light');
    store.resetCalculator();
    setSellPrice("");
  }, [store]);

  const copyToClipboard = useCallback((text: string, id: string) => {
    if (!text || text === '0,00') return;
    navigator.clipboard.writeText(text);
    WebApp.HapticFeedback.notificationOccurred('success');
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  }, []);

  const openSupport = () => WebApp.openTelegramLink('https://t.me/Asadov_p2p');

  const handleInputChange = useCallback((setter: (val: string) => void, value: string) => {
    setter(formatInputNumber(value));
  }, []);

  const handleQuickAmount = (amount: string) => {
    WebApp.HapticFeedback.selectionChanged();
    store.setFiat(amount);
  };

  return (
    <div className="min-h-screen -m-4 p-5 bg-[#F2F2F7] dark:bg-black text-black dark:text-white transition-colors duration-300 font-sans">
      
      <div className="max-w-md mx-auto flex flex-col gap-5 animate-ios-slide pb-10">
        
        {/* Хедер */}
        <div className="flex justify-between items-center px-2 py-1">
            <div className="flex items-center gap-3 min-h-[40px]">
                {(store.fiatInput || store.cryptoInput || sellPrice) && (
                    <button 
                        onClick={handleReset}
                        className="w-10 h-10 rounded-full bg-white dark:bg-[#1C1C1E] flex items-center justify-center text-gray-500 hover:text-red-500 shadow-sm transition-all active:scale-90"
                    >
                        <Eraser size={20} />
                    </button>
                )}
            </div>
            
            <div className="flex gap-3">
                 <button onClick={() => setShowHintModal(true)} className="w-10 h-10 rounded-full bg-white dark:bg-[#1C1C1E] shadow-sm flex items-center justify-center text-blue-500 active:scale-90 transition-transform"><Info size={22} /></button>
                 <button onClick={store.toggleTheme} className="w-10 h-10 rounded-full bg-white dark:bg-[#1C1C1E] shadow-sm flex items-center justify-center text-amber-500 dark:text-yellow-400 active:scale-90 transition-transform">{store.theme === 'light' ? <Moon size={22} /> : <Sun size={22} />}</button>
                 <button onClick={() => store.setLanguage(store.language === 'ru' ? 'en' : 'ru')} className="w-10 h-10 rounded-full bg-white dark:bg-[#1C1C1E] shadow-sm flex items-center justify-center font-bold text-xs active:scale-90 transition-transform text-gray-600 dark:text-gray-300">{store.language.toUpperCase()}</button>
            </div>
        </div>

        {/* Основной блок */}
        <div className="bg-white dark:bg-[#1C1C1E] rounded-[28px] p-6 shadow-sm space-y-6">
            
            {/* Секция: Отдаю (RUB) */}
            <div className="space-y-3">
                <IosInput 
                    label={t.give}
                    value={store.fiatInput}
                    onChange={(val) => handleInputChange(store.setFiat, val)}
                    onClear={() => store.setFiat("")}
                    symbol="RUB"
                    placeholder="0"
                />
                 
                 {/* Быстрые кнопки */}
                 <div className="grid grid-cols-3 gap-2">
                  {quickAmounts.map((item) => (
                    <button
                      key={item.value}
                      onClick={() => handleQuickAmount(item.value)}
                      className="py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 text-sm font-semibold text-gray-500 dark:text-gray-400 hover:bg-blue-500 hover:text-white dark:hover:bg-blue-600 transition-colors active:scale-95 border border-transparent"
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
                value={store.cryptoInput}
                onChange={(val) => handleInputChange(store.setCrypto, val)}
                onClear={() => store.setCrypto("")}
                symbol="USDT"
                placeholder="0"
            />
        </div>

        {/* Блок результатов */}
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
                        onClick={() => copyToClipboard(breakEven.toFixed(2), "breakEven")}
                        className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-white/10 text-gray-400 dark:text-gray-300 flex items-center justify-center active:scale-90 transition-all hover:text-blue-500"
                    >
                        {copiedId === "breakEven" ? <Check size={22} className="text-green-500" /> : <Copy size={22} />}
                    </button>
                 )}
            </div>

            {/* Профит калькулятор */}
            <div className="bg-white dark:bg-[#1C1C1E] rounded-[24px] p-2 shadow-sm border border-blue-100 dark:border-blue-900/30 overflow-hidden relative">
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

        <button 
            onClick={handleSave}
            disabled={!fiat || !crypto}
            className="w-full py-4 bg-[#007AFF] hover:bg-blue-600 active:bg-blue-700 text-white rounded-[20px] font-bold text-[17px] shadow-lg shadow-blue-500/30 active:scale-[0.98] transition-all disabled:opacity-50 disabled:shadow-none"
        >
            {t.save}
        </button>

        <button onClick={openSupport} className="flex items-center justify-center gap-2 text-gray-400 hover:text-blue-500 transition-colors py-2 text-xs font-medium opacity-70">
            <MessageCircleQuestion size={16} /> {t.support}
        </button>

      </div>

      {/* Модалка с подсказками */}
      {showHintModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 pb-6 sm:pb-0">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={() => setShowHintModal(false)} />
            <div className="relative bg-white dark:bg-[#1C1C1E] w-full max-w-sm rounded-[36px] p-8 shadow-2xl animate-ios-slide max-h-[85vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-2xl font-bold dark:text-white">{t.hints}</h3>
                    <button onClick={() => setShowHintModal(false)} className="p-2 rounded-full bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-white hover:bg-gray-200 transition-colors"><X size={20} /></button>
                </div>
                <div className="space-y-8 relative">
                    <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-gray-100 dark:bg-white/5 -z-10" />
                    <StepItem 
                        icon={<Wallet size={20} />} 
                        title={t.step1Title} 
                        text={t.step1Text}
                        color="text-blue-500" bg="bg-blue-50 dark:bg-blue-500/20"
                    />
                    <StepItem 
                        icon={<ArrowRightLeft size={20} />} 
                        title={t.step2Title} 
                        text={t.step2Text}
                        color="text-indigo-500" bg="bg-indigo-50 dark:bg-indigo-500/20"
                    />
                    <StepItem 
                        icon={<TrendingUp size={20} />} 
                        title={t.step3Title} 
                        text={t.step3Text}
                        color="text-green-500" bg="bg-green-50 dark:bg-green-500/20"
                    />
                </div>
                <button onClick={() => setShowHintModal(false)} className="mt-8 w-full py-4 bg-[#007AFF] text-white rounded-[20px] font-bold text-[17px] active:scale-[0.98] transition-transform">
                    {t.gotIt}
                </button>
            </div>
        </div>
      )}
    </div>
  );
};

const StepItem = ({ icon, title, text, color, bg }: any) => (
    <div className="flex gap-5">
        <div className={`w-10 h-10 rounded-full ${bg} ${color} flex items-center justify-center shrink-0 ring-4 ring-white dark:ring-[#1C1C1E]`}>
            {icon}
        </div>
        <div>
            <h4 className="font-bold text-gray-900 dark:text-white text-[17px] mb-1">{title}</h4>
            <p className="text-[15px] text-gray-500 dark:text-gray-400 leading-snug">
                {text}
            </p>
        </div>
    </div>
);

const IosInput = ({ label, value, onChange, symbol, placeholder, transparent, onClear }: IosInputProps) => (
  <div className="flex flex-col gap-2 w-full">
    <label className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider ml-1 truncate">
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
            "w-full h-[52px] pl-4 pr-12 rounded-2xl text-[22px] font-semibold outline-none transition-all placeholder:text-gray-300 dark:placeholder:text-gray-700",
            transparent 
                ? "bg-transparent text-gray-900 dark:text-white border-b-2 border-gray-100 dark:border-white/10 focus:border-blue-500 px-0 rounded-none h-14" 
                : "bg-gray-100/70 dark:bg-black/40 border border-transparent focus:bg-white dark:focus:bg-black focus:border-blue-500/50 text-gray-900 dark:text-white shadow-inner"
        )}
      />
      <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center pr-4 gap-3">
         {value && onClear && !transparent && (
             <button onClick={onClear} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
               <XCircle size={18} fill="currentColor" className="opacity-40" />
             </button>
         )}
         <span className="text-gray-400 font-bold text-sm select-none">
            {symbol}
         </span>
      </div>
    </div>
  </div>
);