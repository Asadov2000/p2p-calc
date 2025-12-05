import { CalculationResult } from "../../../shared/types";

export const calculateP2P = (
  fiatOut: number, 
  cryptoIn: number, 
  wantedProfit: number = 0,
  commissionPercent: number = 0 // Комиссия в %
): CalculationResult => {
  
  if (!fiatOut || !cryptoIn || cryptoIn === 0) {
    return {
      breakEvenRate: 0,
      targetRate: 0,
      profit: 0,
      spreadPercent: 0
    };
  }

  // Эффективный объем крипты (сколько останется после вычета комиссии)
  // Если комиссия 0.1%, то от 100 USDT останется 99.9 USDT
  const effectiveCrypto = cryptoIn * (1 - commissionPercent / 100);

  // 1. Себестоимость (Точка безубыточности)
  // Чтобы вернуть 5000 руб, продавая 99.9 USDT, курс должен быть выше
  const breakEvenRate = fiatOut / effectiveCrypto;

  // 2. Целевой сбор
  const totalFiatNeeded = fiatOut + wantedProfit;

  // 3. Целевой курс продажи
  const targetRate = totalFiatNeeded / effectiveCrypto;

  // 4. Спред
  const spreadPercent = ((targetRate - breakEvenRate) / breakEvenRate) * 100;

  return {
    breakEvenRate,
    targetRate,
    profit: wantedProfit,
    spreadPercent
  };
};

export const parseNumber = (value: string): number => {
  // Разрешаем запятую и точку, убираем пробелы
  const clean = value.replace(/\s/g, '').replace(',', '.');
  const num = parseFloat(clean);
  return isNaN(num) ? 0 : num;
};