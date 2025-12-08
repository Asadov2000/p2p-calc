import { useMemo, memo } from "react";
import { useCalculatorStore } from "../../features/p2p-calculation/model/store";
import { formatCurrency } from "../../shared/lib/utils";
import { TrendingUp, Target, BarChart3 } from "lucide-react";

// Отдельные компоненты карточек для оптимизации
interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle: string;
  borderColor: string;
  textColor: string;
  delay: string;
}

const StatCard = memo(({ icon, title, value, subtitle, borderColor, textColor, delay }: StatCardProps) => (
  <div className={`bg-white dark:bg-[#1C1C1E] rounded-[20px] p-4 shadow-sm border ${borderColor} animate-scale-up ${delay}`}>
    <div className="flex items-center gap-2 mb-2">
      {icon}
      <span className="text-xs font-bold text-gray-400 uppercase">{title}</span>
    </div>
    <span className={`text-xl font-bold ${textColor}`}>
      {value}
    </span>
    <span className="text-xs text-gray-400 block mt-1">
      {subtitle}
    </span>
  </div>
));

StatCard.displayName = 'StatCard';

const Statistics = memo(() => {
  const store = useCalculatorStore();
  const history = store.history;

  // Мемоизируем все вычисления для предотвращения пересчётов
  const statistics = useMemo(() => {
    if (history.length === 0) {
      return null;
    }

    const totalProfit = history.reduce((sum, item) => sum + (item.profitTarget || 0), 0);
    const totalFiat = history.reduce((sum, item) => sum + item.fiatAmount, 0);
    const totalCrypto = history.reduce((sum, item) => sum + item.cryptoAmount, 0);
    const avgRate = history.reduce((sum, item) => sum + item.calculatedRate, 0) / history.length;
    const profitableTransactions = history.filter(item => (item.profitTarget || 0) > 0).length;
    const profitPercent = totalFiat > 0 ? (totalProfit / totalFiat * 100).toFixed(2) : '0';

    return {
      totalProfit,
      avgRate,
      totalCrypto,
      profitPercent,
      profitableCount: profitableTransactions,
      totalCount: history.length
    };
  }, [history]);

  if (!statistics) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold dark:text-white px-2">📊 Статистика</h3>
      
      <div className="grid grid-cols-2 gap-3">
        {/* Общий профит */}
        <StatCard
          icon={<TrendingUp size={16} className="text-green-500" />}
          title="Профит"
          value={`${formatCurrency(statistics.totalProfit)} ₽`}
          subtitle={`+${statistics.profitPercent}% от вложений`}
          borderColor="border-green-100 dark:border-green-900/20"
          textColor="text-green-600 dark:text-green-400"
          delay=""
        />

        {/* Среднее значение */}
        <StatCard
          icon={<Target size={16} className="text-blue-500" />}
          title="Ср. курс"
          value={statistics.avgRate.toFixed(2)}
          subtitle={`${statistics.totalCount} операций`}
          borderColor="border-blue-100 dark:border-blue-900/20"
          textColor="text-blue-600 dark:text-blue-400"
          delay="stat-card-delay-1"
        />

        {/* Объём */}
        <StatCard
          icon={<BarChart3 size={16} className="text-purple-500" />}
          title="Объём"
          value={`${statistics.totalCrypto.toFixed(2)} USDT`}
          subtitle="Всего получено"
          borderColor="border-purple-100 dark:border-purple-900/20"
          textColor="text-purple-600 dark:text-purple-400"
          delay="stat-card-delay-2"
        />

        {/* Прибыльные сделки */}
        <StatCard
          icon={<TrendingUp size={16} className="text-orange-500" />}
          title="Успех"
          value={`${statistics.profitableCount}/${statistics.totalCount}`}
          subtitle={`${((statistics.profitableCount / statistics.totalCount) * 100).toFixed(0)}% прибыльных`}
          borderColor="border-orange-100 dark:border-orange-900/20"
          textColor="text-orange-600 dark:text-orange-400"
          delay="stat-card-delay-3"
        />
      </div>
    </div>
  );
});

Statistics.displayName = 'Statistics';
export { Statistics };
