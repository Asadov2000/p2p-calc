import { useEffect } from "react";
import { useCalculatorStore } from "../../features/p2p-calculation/model/store";
import { calculateP2P, parseNumber } from "../../features/p2p-calculation/lib/math";
import { Input } from "../../shared/ui/Input/Input";
import { Card } from "../../shared/ui/Card/Card";
import { Typography } from "../../shared/ui/Typography/Typography";
import { formatCurrency, cn } from "../../shared/lib/utils";
import { v4 as uuidv4 } from 'uuid'; // Нам понадобится uuid для ID (установим ниже)

export const CalculatorForm = () => {
  const { 
    fiatInput, cryptoInput, profitInput,
    setFiat, setCrypto, setProfit, addToHistory 
  } = useCalculatorStore();

  // 1. Вычисляем значения "на лету"
  const fiat = parseNumber(fiatInput);
  const crypto = parseNumber(cryptoInput);
  const profit = parseNumber(profitInput);

  const result = calculateP2P(fiat, crypto, profit);

  // 2. Функция сохранения в историю
  const handleSave = () => {
    if (!fiat || !crypto) return;
    
    addToHistory({
      id: uuidv4(),
      timestamp: Date.now(),
      fiatAmount: fiat,
      cryptoAmount: crypto,
      profitTarget: profit,
      calculatedRate: result.targetRate
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Секция ввода */}
      <div className="flex flex-col gap-3">
        <Input 
          label="Отдаю (RUB)" 
          value={fiatInput}
          onChange={(e) => setFiat(e.target.value)}
          placeholder="5000"
          rightSection="₽"
        />
        <Input 
          label="Получаю (USDT)" 
          value={cryptoInput}
          onChange={(e) => setCrypto(e.target.value)}
          placeholder="65.91"
          rightSection="₮"
        />
        <Input 
          label="Хочу заработать (RUB)" 
          value={profitInput}
          onChange={(e) => setProfit(e.target.value)}
          placeholder="100"
          rightSection="₽"
        />
      </div>

      {/* Секция результатов */}
      <Card className="flex flex-col gap-4 border border-tg-hint/10">
        <div className="flex justify-between items-center pb-3 border-b border-tg-hint/10">
          <Typography variant="label">Результат расчета</Typography>
          {result.spreadPercent > 0 && (
            <span className="text-green-500 font-bold text-sm">
              +{result.spreadPercent.toFixed(2)}%
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Typography variant="caption">Курс в ноль</Typography>
            <Typography variant="h2" className="text-red-500">
              {formatCurrency(result.breakEvenRate)}
            </Typography>
          </div>
          <div className="text-right">
            <Typography variant="caption">Курс продажи</Typography>
            <Typography variant="h2" className="text-tg-link">
              {formatCurrency(result.targetRate)}
            </Typography>
          </div>
        </div>
        
        {/* Кнопка сохранения */}
        <button 
          onClick={handleSave}
          disabled={!fiat || !crypto}
          className={cn(
            "mt-2 w-full py-3 rounded-lg font-medium transition-all active:scale-95",
            "bg-tg-button text-tg-button-text",
            "disabled:opacity-50 disabled:active:scale-100"
          )}
        >
          Сохранить расчет
        </button>
      </Card>
    </div>
  );
};