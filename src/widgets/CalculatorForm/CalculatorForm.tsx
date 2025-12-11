import { useState, useEffect, useMemo, useCallback, memo, useRef } from "react";
import { useCalculatorStore } from "../../features/p2p-calculation/model/store";
import { calculateRate, parseNumber } from "../../features/p2p-calculation/lib/math";
import { formatCurrency, formatInputNumber, copyToClipboard } from "../../shared/lib/utils";
import { translations } from "../../shared/lib/translations";
import { v4 as uuidv4 } from 'uuid';
import WebApp from "@twa-dev/sdk";
import { Info, Settings, MessageCircleQuestion, Eraser } from "lucide-react";
import { 
  SettingsModal, 
  HintsModal, 
  CalculatorResults, 
  CalculatorInputs,
  CommissionSection 
} from "./components";

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
  const sanitizeInput = useCallback((value: string) => {
    return value.replace(/<[^>]*>?/gm, '').replace(/["'`]/g, '').trim();
  }, []);

  const handleInputChange = useCallback((setter: (val: string) => void, value: string) => {
    const sanitized = sanitizeInput(value);
    setter(formatInputNumber(sanitized));
  }, [sanitizeInput]);

  const handleQuickAmount = useCallback((amount: string) => {
    safeHaptic.selectionChanged();
    store.setFiat(amount);
  }, [store]);

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

        {/* Область для PDF экспорта */}
        <div ref={pdfRef} className="flex flex-col gap-5">
          {/* Основной блок */}
          <CalculatorInputs
            fiatInput={store.fiatInput}
            cryptoInput={store.cryptoInput}
            onFiatChange={store.setFiat}
            onCryptoChange={store.setCrypto}
            onFiatClear={() => store.setFiat("")}
            onCryptoClear={() => store.setCrypto("")}
            quickAmounts={quickAmounts}
            onQuickAmount={handleQuickAmount}
            translations={{ give: t.give, get: t.get }}
            handleInputChange={handleInputChange}
          />

          {/* Блок результатов */}
          <CalculatorResults
            breakEven={breakEven}
            sellPrice={sellPrice}
            setSellPrice={setSellPrice}
            estimatedProfit={estimatedProfit}
            isProfit={isProfit}
            copiedId={copiedId}
            onCopyToClipboard={handleCopyToClipboard}
            translations={{ breakEven: t.breakEven, sellPrice: t.sellPrice, profit: t.profit }}
            handleInputChange={handleInputChange}
          />

          {/* Комиссия и действия: шаринг / экспорт */}
          <CommissionSection
            commissionPercent={commissionPercent}
            commissionAmount={commissionAmount}
            netAfterCommission={netAfterCommission}
            onCommissionChange={(val) => setCommissionPercent(sanitizeInput(val))}
            onShare={handleShare}
            onExportPDF={handleExportPDF}
          />
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
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        theme={store.theme}
        language={store.language}
        quickButtons={store.quickButtons}
        quickEditor={quickEditor}
        setQuickEditor={setQuickEditor}
        onSetTheme={store.setTheme}
        onSetLanguage={store.setLanguage}
        onSaveQuickButtons={store.setQuickButtons}
        sanitizeInput={sanitizeInput}
      />

      {/* Hints modal */}
      <HintsModal
        isOpen={showHintModal}
        onClose={() => setShowHintModal(false)}
        translations={{
          step1Title: t.step1Title,
          step1Text: t.step1Text,
          step2Title: t.step2Title,
          step2Text: t.step2Text,
          step3Title: t.step3Title,
          step3Text: t.step3Text,
        }}
      />
    </div>
  );
});

CalculatorForm.displayName = 'CalculatorForm';
