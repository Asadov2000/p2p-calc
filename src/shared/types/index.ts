// Результат вычислений, который мы будем показывать
export interface CalculationResult {
  breakEvenRate: number; // Курс "в ноль" (например, 95.00)
  targetRate: number;    // Курс для желаемого профита
  profit: number;        // Итоговый заработок (если есть объем)
  spreadPercent: number; // Спред в %
}

// Данные для истории операций
export interface HistoryItem {
  id: string;            // Уникальный ID (uuid)
  timestamp: number;     // Время создания
  fiatAmount: number;    // Отдано (RUB)
  cryptoAmount: number;  // Получено (USDT)
  profitTarget: number;  // Цель по профиту
  calculatedRate: number;// Итоговый курс продажи
}