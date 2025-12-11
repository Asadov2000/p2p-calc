export interface CalculationResult {
  breakEvenRate: number;
  targetRate: number;
  profit: number;
  spreadPercent: number;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  fiatAmount: number;
  cryptoAmount: number;
  profitTarget: number;
  calculatedRate: number;
}
