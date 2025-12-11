import { useCalculatorStore } from "../../features/p2p-calculation/model/store";
import { formatCurrency, formatTime, downloadJSON, downloadCSV, importHistoryFromFile } from "../../shared/lib/utils";
import { translations } from "../../shared/lib/translations";
import { Trash2, TrendingUp, TrendingDown, ArrowRight, Search, Download, Upload, Clock } from "lucide-react";
import { useState, useMemo, useRef, useCallback, memo } from "react";

// Отдельный компонент для элемента истории (memo для оптимизации)
interface HistoryItemProps {
  item: any;
  index: number;
}

const HistoryItemComponent = memo(({ item, index }: HistoryItemProps) => {
  const isProfit = (item.profitTarget || 0) > 0;
  
  return (
    <div 
      className={`history-item animate-slide-in-right history-item-delay-${Math.min(index, 5)}`}
    >
      {/* Левая часть: Суммы обмена */}
      <div className="flex flex-col gap-1.5 flex-1">
        <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
          <span>{formatCurrency(item.fiatAmount)} ₽</span>
          <ArrowRight size={14} className="text-[var(--text-quaternary)]" />
          <span>{item.cryptoAmount} USDT</span>
        </div>
        <div className="text-xs text-[var(--text-tertiary)] flex items-center gap-2">
          <span>{formatTime(item.timestamp)}</span>
          <span className="w-1 h-1 rounded-full bg-[var(--separator-opaque)]"></span>
          <span>Курс: {item.calculatedRate.toFixed(2)}</span>
        </div>
      </div>

      {/* Правая часть: ПРОФИТ */}
      <div className={`badge ${isProfit ? "badge-success" : "badge-danger"}`}>
        {isProfit ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
        <span>
          {item.profitTarget ? `${isProfit ? '+' : ''}${formatCurrency(item.profitTarget)}` : "0"} ₽
        </span>
      </div>
    </div>
  );
});

HistoryItemComponent.displayName = 'HistoryItem';

export const HistoryList = memo(() => {
  const store = useCalculatorStore();
  const t = translations[store.language];
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "profit" | "loss">("all");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredHistory = useMemo(() => {
    let filtered = store.history;

    // Фильтр по типу (прибыль/убыток)
    if (filterType === "profit") {
      filtered = filtered.filter(item => (item.profitTarget || 0) > 0);
    } else if (filterType === "loss") {
      filtered = filtered.filter(item => (item.profitTarget || 0) <= 0);
    }

    // Поиск по сумме или курсу
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        formatCurrency(item.fiatAmount).includes(query) ||
        item.cryptoAmount.toString().includes(query) ||
        item.calculatedRate.toFixed(2).includes(query)
      );
    }

    return filtered;
  }, [store.history, searchQuery, filterType]);

  // useCallback для предотвращения создания новых функций на каждый рендер
  const handleExportJSON = useCallback(() => {
    downloadJSON(store.history, `p2p-calc-history-${new Date().toISOString().split('T')[0]}.json`);
  }, [store.history]);

  const handleExportCSV = useCallback(() => {
    const csvData = store.history.map(item => ({
      дата: new Date(item.timestamp).toLocaleString('ru-RU'),
      рубли: item.fiatAmount,
      усдт: item.cryptoAmount,
      курс: item.calculatedRate.toFixed(2),
      профит: item.profitTarget || 0
    }));
    downloadCSV(csvData, `p2p-calc-history-${new Date().toISOString().split('T')[0]}.csv`);
  }, [store.history]);

  const handleImport = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const imported = await importHistoryFromFile(file);
    if (imported && Array.isArray(imported)) {
      // Объединяем историю и удаляем дубликаты по ID
      const existingIds = new Set(store.history.map(item => item.id));
      const newItems = imported.filter(item => !existingIds.has(item.id));
      
      if (newItems.length > 0) {
        store.setHistory([...store.history, ...newItems]);
        alert(`✓ Импортировано ${newItems.length} операций`);
      } else {
        alert('Нет новых операций для импорта');
      }
    } else {
      alert('❌ Ошибка при импорте файла');
    }

    // Очищаем input для возможности загрузки одного файла дважды
    event.target.value = '';
  }, [store]);

  // Очистка истории с подтверждением
  const handleClearHistory = useCallback(() => {
    if (window.confirm('Вы уверены, что хотите очистить всю историю? Это действие нельзя отменить.')) {
      store.clearHistory();
    }
  }, [store]);

  if (store.history.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">
          <Clock size={36} />
        </div>
        <p className="empty-state-title">{t.historyEmpty || "История пуста"}</p>
        <p className="empty-state-text">Начните расчёты, чтобы увидеть историю</p>
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-20 animate-fade-in">
      <div className="flex-between">
        <div>
          <h2 className="section-header mb-0">История</h2>
          <span className="text-xs text-[var(--text-tertiary)]">
            {store.history.length}/50 записей
          </span>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleExportJSON}
            className="btn-icon"
            title="Экспорт в JSON"
          >
            <Download size={18} />
          </button>
          <button 
            onClick={handleExportCSV}
            className="btn-icon"
            title="Экспорт в CSV"
          >
            <Download size={18} />
          </button>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="btn-icon"
            title="Импорт из файла"
          >
            <Upload size={18} />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
            aria-label="Импорт истории из файла"
          />
          <button 
            onClick={handleClearHistory}
            className="btn-icon btn-icon-danger"
            title="Очистить историю"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Поиск и фильтры */}
      <div className="space-y-3">
        {/* Поисковая строка */}
        <div className="search-input">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Поиск по суммам..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-field"
          />
        </div>

        {/* Кнопки фильтра */}
        <div className="filter-pills">
          {(["all", "profit", "loss"] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`filter-pill ${
                filterType === type
                  ? type === "profit" 
                    ? "filter-pill-success"
                    : type === "loss"
                    ? "filter-pill-danger"
                    : "filter-pill-active"
                  : ""
              }`}
            >
              {type === "all" ? "Все" : type === "profit" ? "Прибыль" : "Убыток"}
            </button>
          ))}
        </div>
      </div>

      {/* Результаты поиска */}
      {filteredHistory.length === 0 ? (
        <div className="empty-state py-12">
          <p className="empty-state-text">Ничего не найдено</p>
        </div>
      ) : (
        <div className="list-container">
          {filteredHistory.map((item, index) => (
            <HistoryItemComponent key={item.id} item={item} index={index} />
          ))}
        </div>
      )}
    </div>
  );
});

HistoryList.displayName = 'HistoryList';