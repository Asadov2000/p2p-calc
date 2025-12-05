import { useCalculatorStore } from "../../features/p2p-calculation/model/store";
import { Card } from "../../shared/ui/Card/Card";
import { Typography } from "../../shared/ui/Typography/Typography";
import { formatCurrency } from "../../shared/lib/utils";

export const HistoryList = () => {
  const { history, clearHistory, setFiat, setCrypto, setProfit } = useCalculatorStore();

  if (history.length === 0) return null;

  const restore = (item: typeof history[0]) => {
    setFiat(item.fiatAmount.toString());
    setCrypto(item.cryptoAmount.toString());
    setProfit(item.profitTarget.toString());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col gap-3 mt-8 pb-10">
      <div className="flex justify-between items-center px-1">
        <Typography variant="h2">История</Typography>
        <button 
          onClick={clearHistory}
          className="text-sm text-red-500 font-medium active:opacity-60"
        >
          Очистить
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {history.map((item) => (
          <Card 
            key={item.id} 
            onClick={() => restore(item)}
            className="active:opacity-70 cursor-pointer flex justify-between items-center py-3"
          >
            <div className="flex flex-col gap-1">
              <Typography variant="body" className="font-medium">
                {formatCurrency(item.calculatedRate)} ₽
              </Typography>
              <Typography variant="caption">
                Банк: {formatCurrency(item.fiatAmount, '₽')}
              </Typography>
            </div>
            
            <div className="text-right">
              <Typography variant="caption" className="text-green-500 font-medium">
                +{item.profitTarget} ₽
              </Typography>
              <Typography variant="caption">
                {new Date(item.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </Typography>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};