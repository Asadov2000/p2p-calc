import { CalculationResult } from "../../../shared/types";

/**
 * Основная функция расчета P2P сделки
 * @param fiatOut - Сколько рублей отдали (5000)
 * @param cryptoIn - Сколько USDT получили (65.91)
 * @param wantedProfit - Сколько хотим заработать сверху (100)
 */
export const calculateP2P = (
  fiatOut: number, 
  cryptoIn: number, 
  wantedProfit: number = 0
): CalculationResult => {
  
  // 1. Если данные не введены или равны 0, возвращаем нули
  if (!fiatOut || !cryptoIn || cryptoIn === 0) {
    return {
      breakEvenRate: 0,
      targetRate: 0,
      profit: 0,
      spreadPercent: 0
    };
  }

  // 2. Себестоимость (Точка безубыточности)
  // Курс = Рубли / Крипта
  const breakEvenRate = fiatOut / cryptoIn;

  // 3. Целевой сбор (Сколько рублей нам нужно получить в итоге)
  const totalFiatNeeded = fiatOut + wantedProfit;

  // 4. Целевой курс продажи
  const targetRate = totalFiatNeeded / cryptoIn;

  // 5. Спред (Наценка в процентах)
  // Формула: ((Продажа - Покупка) / Покупка) * 100
  const spreadPercent = ((targetRate - breakEvenRate) / breakEvenRate) * 100;

  return {
    breakEvenRate,
    targetRate,
    profit: wantedProfit,
    spreadPercent
  };
};

/**
 * Парсер числа из строки.
 * Заменяет запятые на точки и убирает пробелы.
 * "5 000,50" -> 5000.50
 */
export const parseNumber = (value: string): number => {
  const clean = value.replace(/\s/g, '').replace(',', '.');
  const num = parseFloat(clean);
  return isNaN(num) ? 0 : num;
};