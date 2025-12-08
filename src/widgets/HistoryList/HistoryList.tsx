import { useCalculatorStore } from "../../features/p2p-calculation/model/store";
import { formatCurrency, formatTime, downloadJSON, downloadCSV, importHistoryFromFile } from "../../shared/lib/utils";
import { translations } from "../../shared/lib/translations";
import { Trash2, TrendingUp, ArrowRight, Search } from "lucide-react";
import { useState, useMemo, useRef } from "react";

export const HistoryList = () => {
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

  const handleExportJSON = () => {
    downloadJSON(store.history, `p2p-calc-history-${new Date().toISOString().split('T')[0]}.json`);
  };

  const handleExportCSV = () => {
    const csvData = store.history.map(item => ({
      дата: new Date(item.timestamp).toLocaleString('ru-RU'),
      рубли: item.fiatAmount,
      усдт: item.cryptoAmount,
      курс: item.calculatedRate.toFixed(2),
      профит: item.profitTarget || 0
    }));
    downloadCSV(csvData, `p2p-calc-history-${new Date().toISOString().split('T')[0]}.csv`);
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
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
  };

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
         <div className="flex gap-2">
           <button 
             onClick={handleExportJSON}
             className="text-xs font-medium text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 px-2 py-1.5 rounded-lg active:scale-95 transition-transform"
             title="Экспорт в JSON"
           >
             📥 JSON
           </button>
           <button 
             onClick={handleExportCSV}
             className="text-xs font-medium text-green-500 hover:bg-green-50 dark:hover:bg-green-500/10 px-2 py-1.5 rounded-lg active:scale-95 transition-transform"
             title="Экспорт в CSV"
           >
             📊 CSV
           </button>
           <button 
             onClick={() => fileInputRef.current?.click()}
             className="text-xs font-medium text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-500/10 px-2 py-1.5 rounded-lg active:scale-95 transition-transform"
             title="Импорт из файла"
           >
             📤 Импорт
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
             onClick={store.clearHistory}
             className="text-xs font-medium text-red-500 bg-red-50 dark:bg-red-500/10 px-3 py-1.5 rounded-lg active:scale-95 transition-transform"
           >
             Очистить
           </button>
         </div>
      </div>

      {/* Поиск и фильтры */}
      <div className="space-y-3">
        {/* Поисковая строка */}
        <div className="flex items-center gap-2 bg-white dark:bg-ios-dark-surface rounded-[16px] px-3 py-2.5 border border-gray-100 dark:border-white/5">
          <Search size={16} className="text-gray-400" />
          <input
            type="text"
            placeholder="Поиск сумм..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent outline-none text-sm dark:text-white placeholder:text-gray-400"
          />
        </div>

        {/* Кнопки фильтра */}
        <div className="flex gap-2">
          {(["all", "profit", "loss"] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`text-xs font-medium px-3 py-2 rounded-lg transition-all ${
                filterType === type
                  ? "bg-ios-blue text-white"
                  : "bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300"
              }`}
            >
              {type === "all" ? "Все" : type === "profit" ? "Прибыль" : "Убыток"}
            </button>
          ))}
        </div>
      </div>

      {/* Результаты поиска */}
      {filteredHistory.length === 0 ? (
        <div className="text-center py-10 opacity-40">
          <p className="text-sm text-gray-500">Ничего не найдено</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filteredHistory.map((item, index) => (
            <div 
              key={item.id} 
              className={`bg-white dark:bg-ios-dark-surface p-4 rounded-[20px] shadow-sm border border-gray-100 dark:border-white/5 flex justify-between items-center animate-slide-in-right history-item-delay-${Math.min(index, 5)}`}
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
      )}
    </div>
  );
};