import { useCalculatorStore } from "../../features/p2p-calculation/model/store";
import { formatCurrency } from "../../shared/lib/utils";
import { TrendingUp, Target, BarChart3 } from "lucide-react";

export const Statistics = () => {
  const store = useCalculatorStore();
  const history = store.history;

  if (history.length === 0) {
    return null;
  }

  // Расчет статистики
  const totalProfit = history.reduce((sum, item) => sum + (item.profitTarget || 0), 0);
  const totalFiat = history.reduce((sum, item) => sum + item.fiatAmount, 0);
  const totalCrypto = history.reduce((sum, item) => sum + item.cryptoAmount, 0);
  const avgRate = history.length > 0 
    ? history.reduce((sum, item) => sum + item.calculatedRate, 0) / history.length 
    : 0;
  const profitableTransactions = history.filter(item => (item.profitTarget || 0) > 0).length;
  const profitPercent = totalFiat > 0 ? (totalProfit / totalFiat * 100).toFixed(2) : 0;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold dark:text-white px-2">📊 Статистика</h3>
      
      <div className="grid grid-cols-2 gap-3">
        {/* Общий профит */}
        <div className="bg-white dark:bg-[#1C1C1E] rounded-[20px] p-4 shadow-sm border border-green-100 dark:border-green-900/20 animate-scale-up">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={16} className="text-green-500" />
            <span className="text-xs font-bold text-gray-400 uppercase">Профит</span>
          </div>
          <span className="text-xl font-bold text-green-600 dark:text-green-400">
            {formatCurrency(totalProfit)} ₽
          </span>
          <span className="text-xs text-gray-400 block mt-1">
            +{profitPercent}% от вложений
          </span>
        </div>

        {/* Среднее значение */}
        <div className="bg-white dark:bg-[#1C1C1E] rounded-[20px] p-4 shadow-sm border border-blue-100 dark:border-blue-900/20 animate-scale-up stat-card-delay-1">
          <div className="flex items-center gap-2 mb-2">
            <Target size={16} className="text-blue-500" />
            <span className="text-xs font-bold text-gray-400 uppercase">Ср. курс</span>
          </div>
          <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
            {avgRate.toFixed(2)}
          </span>
          <span className="text-xs text-gray-400 block mt-1">
            {history.length} операций
          </span>
        </div>

        {/* Объем */}
        <div className="bg-white dark:bg-[#1C1C1E] rounded-[20px] p-4 shadow-sm border border-purple-100 dark:border-purple-900/20 animate-scale-up stat-card-delay-2">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 size={16} className="text-purple-500" />
            <span className="text-xs font-bold text-gray-400 uppercase">Объем</span>
          </div>
          <span className="text-xl font-bold text-purple-600 dark:text-purple-400">
            {totalCrypto.toFixed(2)} USDT
          </span>
          <span className="text-xs text-gray-400 block mt-1">
            Всего получено
          </span>
        </div>

        {/* Прибыльные сделки */}
        <div className="bg-white dark:bg-[#1C1C1E] rounded-[20px] p-4 shadow-sm border border-orange-100 dark:border-orange-900/20 animate-scale-up stat-card-delay-3">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={16} className="text-orange-500" />
            <span className="text-xs font-bold text-gray-400 uppercase">Успех</span>
          </div>
          <span className="text-xl font-bold text-orange-600 dark:text-orange-400">
            {profitableTransactions}/{history.length}
          </span>
          <span className="text-xs text-gray-400 block mt-1">
            {((profitableTransactions / history.length) * 100).toFixed(0)}% прибыльных
          </span>
        </div>
      </div>
    </div>
  );
};
