import { useState, useEffect, useMemo, useCallback, memo, useRef } from "react";
import { useCalculatorStore } from "../../features/p2p-calculation/model/store";
import { calculateRate, parseNumber } from "../../features/p2p-calculation/lib/math";
import { formatCurrency, formatInputNumber, cn, copyToClipboard } from "../../shared/lib/utils";
import { translations } from "../../shared/lib/translations";
import { v4 as uuidv4 } from 'uuid';
import WebApp from "@twa-dev/sdk";
import { 
  Copy, Info, Settings, Moon, Sun,
  MessageCircleQuestion, Check, Eraser, X, XCircle, Trash2
} from "lucide-react";
import React, { Suspense } from 'react';
const AnalyticsPanel = React.lazy(() => import('../../shared/ui/AnalyticsPanel/AnalyticsPanel'));

// Безопасные вызовы Haptic Feedback
const safeHaptic = {
  impactOccurred: (style: 'light' | 'medium' | 'heavy' = 'medium') => {
    try { WebApp?.HapticFeedback?.impactOccurred?.(style); } catch (e) { console.debug('Haptic not available'); }
  },
  notificationOccurred: (type: 'success' | 'error' | 'warning' = 'success') => {
    try { WebApp?.HapticFeedback?.notificationOccurred?.(type); } catch (e) { console.debug('Haptic not available'); }
  },
  selectionChanged: () => {
    try { WebApp?.HapticFeedback?.selectionChanged?.(); } catch (e) { console.debug('Haptic not available'); }
  }
};

// Безопасный WebApp
const safeWebApp = {
  showAlert: (text: string) => {
    try { WebApp?.showAlert?.(text); } catch (e) { alert(text); }
  },
  openTelegramLink: (url: string) => {
    try { WebApp?.openTelegramLink?.(url); } catch (e) { window.open(url, '_blank'); }
  }
};

interface IosInputProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  symbol: string;
  placeholder?: string;
  transparent?: boolean;
  onClear?: () => void;
}

export const CalculatorForm = memo(() => {
  const store = useCalculatorStore();
  const t = translations[store.language];
  
  const [showHintModal, setShowHintModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [sellPrice, setSellPrice] = useState("");
  const [commissionPercent, setCommissionPercent] = useState("0");
  const [quickEditor, setQuickEditor] = useState<{ label: string; value: string }[]>([]);

  // Используем быстрые кнопки из состояние хранилища — пользовательские возможны
  const quickAmounts = store.quickButtons;

  const fiat = useMemo(() => parseNumber(store.fiatInput), [store.fiatInput]);
  const crypto = useMemo(() => parseNumber(store.cryptoInput), [store.cryptoInput]);
  const sellRate = useMemo(() => parseNumber(sellPrice), [sellPrice]);
  
  const breakEven = useMemo(() => calculateRate(fiat, crypto), [fiat, crypto]);
  
  const estimatedProfit = useMemo(() => {
    if (sellRate <= 0) return 0;
    return (sellRate * crypto) - fiat;
  }, [sellRate, crypto, fiat]);

  const isProfit = estimatedProfit > 0;

  // Комиссия и чистая сумма
  const commissionAmount = useMemo(() => {
    const p = parseNumber(commissionPercent);
    if (!fiat || !p || p <= 0) return 0;
    return (fiat * p) / 100;
  }, [fiat, commissionPercent]);

  const netAfterCommission = useMemo(() => {
    return Math.max(0, fiat - commissionAmount);
  }, [fiat, commissionAmount]);
  
  useEffect(() => {
    const locked = showHintModal || showSettings;
    document.body.style.overflow = locked ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [showHintModal, showSettings]);

  useEffect(() => {
    if (showSettings) {
      setQuickEditor(store.quickButtons || []);
    }
  }, [showSettings, store.quickButtons]);

  // Ref на область, которую будем экспортировать в PDF
  const pdfRef = useRef<HTMLDivElement | null>(null);

  const handleExportPDF = useCallback(async () => {
    const node = pdfRef.current;
    if (!node) {
      safeWebApp.showAlert('Нет содержимого для экспорта');
      return;
    }

    try {
      const html2canvasModule = await import('html2canvas');
      const jspdfModule = await import('jspdf');
      const html2canvas = (html2canvasModule as any).default || html2canvasModule;
      const { jsPDF } = jspdfModule as any;

      const canvas = await html2canvas(node, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
      const pageWidth = pdf.internal.pageSize.getWidth();

      // Пропорционально подгоняем изображение под ширину страницы
      const imgProps = (pdf as any).getImageProperties ? pdf.getImageProperties(imgData) : { width: canvas.width, height: canvas.height };
      const imgWidth = pageWidth;
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save('p2p-calc.pdf');
      safeHaptic.notificationOccurred('success');
    } catch (e) {
      console.debug('PDF export failed, falling back to print', e);
      // fallback: открыть окно с html и вызвать печать
      const html = `
        <html>
          <head>
            <title>P2P Calc — Export</title>
            <meta charset="utf-8" />
            <style>body{font-family: Arial, Helvetica, sans-serif;padding:20px;color:#111} .row{margin-bottom:8px}</style>
          </head>
          <body>
            <h2>P2P Calc — Результат</h2>
            <div class="row">Отдаю (fiat): ${formatCurrency(fiat)}</div>
            <div class="row">Получаю (crypto): ${crypto.toFixed(6)}</div>
            <div class="row">Курс (break-even): ${breakEven.toFixed(6)}</div>
            <div class="row">Ожидаемая прибыль: ${formatCurrency(estimatedProfit)}</div>
            <div class="row">Комиссия (${commissionPercent}%): ${formatCurrency(commissionAmount)}</div>
            <div class="row"><strong>Чистыми после комиссии: ${formatCurrency(netAfterCommission)}</strong></div>
          </body>
        </html>
      `;
      const w = window.open('', '_blank');
      if (!w) {
        safeWebApp.showAlert('Не удалось открыть окно вывода. Проверьте блокировщик всплывающих окон.');
        return;
      }
      w.document.open();
      w.document.write(html);
      w.document.close();
      w.focus();
      setTimeout(() => { try { w.print(); } catch (e) { console.debug('Print not available', e); } }, 300);
    }
  }, [fiat, crypto, breakEven, estimatedProfit, commissionPercent, commissionAmount, netAfterCommission]);

  const handleShare = useCallback(async () => {
    const text = `P2P Calc\nОтдаю: ${formatCurrency(fiat)}\nПолучаю: ${crypto.toFixed(6)}\nКурс: ${breakEven.toFixed(6)}\nПрибыль: ${formatCurrency(estimatedProfit)}`;
    try {
      if ((navigator as any).share) {
        await (navigator as any).share({ title: 'P2P Calc', text });
        safeHaptic.notificationOccurred('success');
        return;
      }

      // fallback — копируем в буфер обмена
      copyToClipboard(text);
      setCopiedId('share');
      setTimeout(() => setCopiedId(null), 1500);
      safeHaptic.notificationOccurred('success');
    } catch (e) {
      safeWebApp.showAlert('Ошибка при шаринге');
    }
  }, [fiat, crypto, breakEven, estimatedProfit]);

  const handleSave = useCallback(() => {
    if (!fiat || !crypto) return;
    safeHaptic.impactOccurred('medium');
    
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
    safeWebApp.showAlert(`Сохранено! Профит: ${formatCurrency(estimatedProfit)} ₽`);
    
  }, [fiat, crypto, estimatedProfit, breakEven, sellRate, store]);

  const handleReset = useCallback(() => {
    safeHaptic.impactOccurred('light');
    store.resetCalculator();
    setSellPrice("");
  }, [store]);

  const handleCopyToClipboard = useCallback((text: string, id: string) => {
    if (!text || text === '0,00') return;
    copyToClipboard(text);
    safeHaptic.notificationOccurred('success');
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  }, []);

  const openSupport = () => safeWebApp.openTelegramLink('https://t.me/Asadov_p2p');

  // Базовая валидация и защита от XSS для числовых вводов
  const sanitizeInput = (value: string) => {
    // Удаляем все теги и потенциально опасные символы
    return value.replace(/<[^>]*>?/gm, '').replace(/["'`]/g, '').trim();
  };

  const handleInputChange = useCallback((setter: (val: string) => void, value: string) => {
    const sanitized = sanitizeInput(value);
    setter(formatInputNumber(sanitized));
  }, []);

  const handleQuickAmount = (amount: string) => {
    safeHaptic.selectionChanged();
    store.setFiat(amount);
  };

  return (
    <div className="min-h-screen -m-4 p-5 bg-[#F2F2F7] dark:bg-black text-black dark:text-white transition-colors duration-300 font-sans">
      
      <div className="max-w-md mx-auto flex flex-col gap-5 animate-ios-slide pb-10">
        
        {/* Очистить, подсказки и настройки */}
        <div className="flex items-center justify-center gap-3 mb-5">
            {(store.fiatInput || store.cryptoInput || sellPrice) && (
                <button 
                    onClick={handleReset}
                    className="w-10 h-10 rounded-full bg-white dark:bg-[#1C1C1E] flex items-center justify-center text-gray-500 hover:text-red-500 shadow-sm transition-all active:scale-90"
                    title="Очистить все"
                    aria-label="Очистить все"
                    tabIndex={0}
                    role="button"
                >
                    <Eraser size={20} aria-hidden="true" />
                </button>
            )}
            <button onClick={() => setShowHintModal(true)} className="w-10 h-10 rounded-full bg-white dark:bg-[#1C1C1E] shadow-sm flex items-center justify-center text-blue-500 active:scale-90 transition-transform" title="Подсказки" aria-label="Подсказки" tabIndex={0} role="button"><Info size={22} aria-hidden="true" /></button>
            <button onClick={() => setShowSettings(true)} className="w-10 h-10 rounded-full bg-white dark:bg-[#1C1C1E] shadow-sm flex items-center justify-center text-gray-600 dark:text-gray-400 active:scale-90 transition-transform" title="Настройки" aria-label="Настройки" tabIndex={0} role="button"><Settings size={20} aria-hidden="true" /></button>
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
                  {quickAmounts.map((item, idx) => (
                    <button
                      key={item.value}
                      onClick={() => handleQuickAmount(item.value)}
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
                        onClick={() => handleCopyToClipboard(breakEven.toFixed(2), "breakEven")}
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

        {/* Комиссия и действия: шаринг / экспорт */}
        <div className="bg-white dark:bg-[#1C1C1E] rounded-[20px] p-4 shadow-sm space-y-3">
          <div>
            <IosInput
              label="Комиссия (%)"
              value={commissionPercent}
              onChange={(val) => setCommissionPercent(sanitizeInput(val))}
              symbol="%"
              placeholder="0"
            />
            <div className="flex justify-between text-sm mt-2 text-gray-500">
              <div>Комиссия: <span className="font-bold text-gray-900 dark:text-white">{formatCurrency(commissionAmount)}</span></div>
              <div>Чистыми: <span className="font-bold text-gray-900 dark:text-white">{formatCurrency(netAfterCommission)}</span></div>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={handleShare} className="flex-1 py-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg font-medium hover:bg-blue-50 active:scale-95 transition-colors" aria-label="Поделиться">
              Поделиться
            </button>
            <button onClick={handleExportPDF} className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium active:scale-95 transition-colors" aria-label="Экспорт в PDF">
              Экспорт PDF
            </button>
          </div>
        </div>

        <button 
            onClick={handleSave}
            disabled={!fiat || !crypto}
            className="w-full py-4 bg-[#007AFF] hover:bg-blue-600 active:bg-blue-700 text-white rounded-[20px] font-bold text-[17px] shadow-lg shadow-blue-500/30 active:scale-[0.98] transition-all disabled:opacity-50 disabled:shadow-none animate-pulse-glow"
            aria-label="Сохранить"
            tabIndex={0}
            role="button"
        >
            {t.save}
        </button>

        <button onClick={openSupport} className="flex items-center justify-center gap-2 text-gray-400 hover:text-blue-500 transition-colors py-2 text-xs font-medium opacity-70" aria-label="Поддержка" tabIndex={0} role="button">
            <MessageCircleQuestion size={16} /> {t.support}
        </button>

      </div>

      {/* Settings modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={() => setShowSettings(false)} />
          <div className="relative bg-white dark:bg-[#1C1C1E] w-full max-w-lg rounded-[28px] p-6 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold dark:text-white">Настройки</h3>
              <button onClick={() => setShowSettings(false)} className="p-2 rounded-full bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-white hover:bg-gray-200 transition-colors" title="Закрыть" aria-label="Закрыть" tabIndex={0} role="button"><X size={18} /></button>
            </div>
            
            {/* Смена темы */}
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-3 dark:text-gray-300">Тема оформления</label>
              <div className="flex gap-2">
                <button onClick={() => store.setTheme('light')} className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${store.theme === 'light' ? 'bg-blue-500 text-white shadow-lg' : 'bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300'}`}><Sun size={18} /> Светлая</button>
                <button onClick={() => store.setTheme('dark')} className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${store.theme === 'dark' ? 'bg-blue-500 text-white shadow-lg' : 'bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300'}`}><Moon size={18} /> Тёмная</button>
              </div>
            </div>

            {/* Смена языка */}
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-3 dark:text-gray-300">Язык интерфейса</label>
              <div className="flex gap-2">
                <button onClick={() => store.setLanguage('ru')} className={`flex-1 py-3 px-4 rounded-lg font-bold transition-all ${store.language === 'ru' ? 'bg-blue-500 text-white shadow-lg' : 'bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300'}`}>РУ</button>
                <button onClick={() => store.setLanguage('en')} className={`flex-1 py-3 px-4 rounded-lg font-bold transition-all ${store.language === 'en' ? 'bg-blue-500 text-white shadow-lg' : 'bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300'}`}>EN</button>
                <button onClick={() => store.setLanguage('tj')} className={`flex-1 py-3 px-4 rounded-lg font-bold transition-all ${store.language === 'tj' ? 'bg-blue-500 text-white shadow-lg' : 'bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300'}`}>TJ</button>
              </div>
            </div>

            {/* Управление быстрыми кнопками */}
            <div>
              <label className="block text-sm font-semibold mb-3 dark:text-gray-300">Быстрые кнопки</label>
              <div className="space-y-2 mb-4">
                {quickEditor.map((it, idx) => (
                  <div key={it.value + idx} className="flex gap-2 items-center">
                    <input aria-label={`label-${idx}`} value={it.label} onChange={(e) => setQuickEditor(prev => prev.map((p,i) => i===idx?{...p,label:sanitizeInput(e.target.value)}:p))} className="flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-white/20 bg-gray-50 dark:bg-black/40 text-sm" placeholder="Ярлык" autoComplete="off" type="text" inputMode="text" />
                    <input aria-label={`value-${idx}`} value={it.value} onChange={(e) => setQuickEditor(prev => prev.map((p,i) => i===idx?{...p,value:sanitizeInput(e.target.value)}:p))} className="w-24 px-3 py-2 rounded-lg border border-gray-200 dark:border-white/20 bg-gray-50 dark:bg-black/40 text-sm" placeholder="Сумма" autoComplete="off" type="text" inputMode="numeric" pattern="[0-9]*" />
                    <button title="Удалить" aria-label={`delete-${idx}`} onClick={() => setQuickEditor(prev => prev.filter((_,i)=>i!==idx))} className="p-2 rounded-lg bg-red-50 dark:bg-red-500/20 text-red-600 hover:bg-red-100 transition-colors"><Trash2 size={16} /></button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mb-4">
                <input id="newQuickLabel" aria-label="new-label" placeholder="Ярлык" className="flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-white/20 bg-gray-50 dark:bg-black/40 text-sm" autoComplete="off" type="text" inputMode="text" />
                <input id="newQuickValue" aria-label="new-value" placeholder="Сумма" className="w-24 px-3 py-2 rounded-lg border border-gray-200 dark:border-white/20 bg-gray-50 dark:bg-black/40 text-sm" autoComplete="off" type="text" inputMode="numeric" pattern="[0-9]*" />
                <button title="Добавить" aria-label="add-new-quick" onClick={() => {
                  const labelEl = document.getElementById('newQuickLabel') as HTMLInputElement | null;
                  const valueEl = document.getElementById('newQuickValue') as HTMLInputElement | null;
                  if (!labelEl || !valueEl) return;
                  const label = labelEl.value.trim();
                  const value = valueEl.value.trim();
                  if (!label || !value) return;
                  setQuickEditor(prev => [{ label, value }, ...prev].slice(0, 12));
                  labelEl.value=''; valueEl.value='';
                }} className="px-3 py-2 rounded-lg bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 hover:bg-green-200 transition-colors font-medium text-sm">+</button>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button onClick={() => { store.setQuickButtons(quickEditor); setShowSettings(false); }} className="flex-1 py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors" aria-label="Сохранить быстрые кнопки" tabIndex={0} role="button">
                Сохранить
              </button>
              <button onClick={() => { setQuickEditor(store.quickButtons); setShowSettings(false); }} className="flex-1 py-2 px-4 bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-200 transition-colors" aria-label="Отмена" tabIndex={0} role="button">
                Отмена
              </button>
            </div>
            
            <div className="mt-6">
              <h4 className="text-sm font-bold dark:text-white mb-2">Аналитика</h4>
              <div className="text-sm text-gray-600 dark:text-gray-300">Просмотр локальных событий аналитики.</div>
              <div className="mt-3">
                {/* Lazy-load panel to avoid adding bundle size in main flow */}
                <Suspense fallback={<div className="text-sm text-gray-400">Загрузка...</div>}>
                  <AnalyticsPanel />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      )}

      {showHintModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={() => setShowHintModal(false)} />
            <div className="relative bg-white dark:bg-[#1C1C1E] w-full max-w-md rounded-[28px] p-6 shadow-2xl animate-ios-slide max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold dark:text-white">Как это работает</h2>
                    <button onClick={() => setShowHintModal(false)} className="p-2 rounded-full bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-white hover:bg-gray-200 dark:hover:bg-white/20 transition-colors" title="Закрыть" aria-label="Закрыть" tabIndex={0} role="button"><X size={20} /></button>
                </div>
                
                <div className="space-y-4">
                    {/* Шаг 1 */}
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-500/20 dark:to-blue-500/10 rounded-[20px] p-4 border border-blue-200 dark:border-blue-500/30">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center shrink-0 font-bold text-sm">1</div>
                            <div>
                                <h3 className="font-bold text-blue-900 dark:text-blue-100 mb-1">{t.step1Title}</h3>
                                <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">{t.step1Text}</p>
                            </div>
                        </div>
                    </div>

                    {/* Шаг 2 */}
                    <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-500/20 dark:to-indigo-500/10 rounded-[20px] p-4 border border-indigo-200 dark:border-indigo-500/30">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center shrink-0 font-bold text-sm">2</div>
                            <div>
                                <h3 className="font-bold text-indigo-900 dark:text-indigo-100 mb-1">{t.step2Title}</h3>
                                <p className="text-sm text-indigo-800 dark:text-indigo-200 leading-relaxed">{t.step2Text}</p>
                            </div>
                        </div>
                    </div>

                    {/* Шаг 3 */}
                    <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-500/20 dark:to-green-500/10 rounded-[20px] p-4 border border-green-200 dark:border-green-500/30">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center shrink-0 font-bold text-sm">3</div>
                            <div>
                                <h3 className="font-bold text-green-900 dark:text-green-100 mb-1">{t.step3Title}</h3>
                                <p className="text-sm text-green-800 dark:text-green-200 leading-relaxed">{t.step3Text}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <button onClick={() => setShowHintModal(false)} className="mt-6 w-full py-3 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white rounded-[16px] font-bold transition-colors" aria-label="Понятно" tabIndex={0} role="button">
                    Понятно
                </button>
            </div>
        </div>
      )}
    </div>
  );
});

CalculatorForm.displayName = 'CalculatorForm';

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
             <button onClick={onClear} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors" title="Очистить">
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