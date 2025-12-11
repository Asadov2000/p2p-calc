import { useMemo, memo } from "react";
import { useCalculatorStore } from "../../features/p2p-calculation/model/store";
import { formatCurrency } from "../../shared/lib/utils";
import { TrendingUp, TrendingDown, Target, BarChart3, Percent } from "lucide-react";

// Отдельные компоненты карточек для оптимизации
interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle: string;
  iconBg: string;
  textColor: string;
  delay: string;
}

const StatCard = memo(({ icon, title, value, subtitle, iconBg, textColor, delay }: StatCardProps) => (
  <div className={`stat-card animate-scale-in ${delay}`}>
    <div className={`stat-icon ${iconBg}`}>
      {icon}
    </div>
    <div className={`stat-value ${textColor}`}>
      {value}
    </div>
    <div className="stat-label">{title}</div>
    <div className="text-xs text-[var(--text-quaternary)] mt-1">{subtitle}</div>
  </div>
));

StatCard.displayName = 'StatCard';

const Statistics = memo(() => {
  const store = useCalculatorStore();
  const history = store.history;

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
    <div className="space-y-5">
      <h3 className="section-header">Статистика</h3>
      
      <div className="grid grid-cols-2 gap-4">
        {/* Общий профит */}
        <StatCard
          icon={statistics.totalProfit >= 0 
            ? <TrendingUp size={20} className="text-white" />
            : <TrendingDown size={20} className="text-white" />
          }
          title="Профит"
          value={`${statistics.totalProfit >= 0 ? '+' : ''}${formatCurrency(statistics.totalProfit)} ₽`}
          subtitle={`${parseFloat(statistics.profitPercent) >= 0 ? '+' : ''}${statistics.profitPercent}%`}
          iconBg={statistics.totalProfit >= 0 
            ? "bg-[var(--success)]" 
            : "bg-[var(--danger)]"
          }
          textColor={statistics.totalProfit >= 0 
            ? "text-[var(--success)]" 
            : "text-[var(--danger)]"
          }
          delay=""
        />

        {/* Среднее значение */}
        <StatCard
          icon={<Target size={20} className="text-white" />}
          title="Ср. курс"
          value={statistics.avgRate.toFixed(2)}
          subtitle={`${statistics.totalCount} операций`}
          iconBg="bg-[var(--primary)]"
          textColor="text-[var(--primary)]"
          delay="delay-1"
        />

        {/* Объём */}
        <StatCard
          icon={<BarChart3 size={20} className="text-white" />}
          title="Объём"
          value={`${statistics.totalCrypto.toFixed(2)}`}
          subtitle="USDT получено"
          iconBg="bg-[var(--apple-purple)]"
          textColor="text-[var(--apple-purple)]"
          delay="delay-2"
        />

        {/* Прибыльные сделки */}
        <StatCard
          icon={<Percent size={20} className="text-white" />}
          title="Успешность"
          value={`${((statistics.profitableCount / statistics.totalCount) * 100).toFixed(0)}%`}
          subtitle={`${statistics.profitableCount}/${statistics.totalCount} сделок`}
          iconBg="bg-[var(--apple-orange)]"
          textColor="text-[var(--apple-orange)]"
          delay="delay-3"
        />
      </div>
    </div>
  );
});

Statistics.displayName = 'Statistics';
export { Statistics };
