import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Профессиональная утилита для объединения классов Tailwind.
 * Позволяет избегать конфликтов стилей и использовать условия.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Форматирование денег (RUB, USDT)
 * Пример: formatCurrency(5000) -> "5 000,00"
 */
export const formatCurrency = (val: number, currency: string = '') => {
  const formatted = new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(val);
  
  return currency ? `${formatted} ${currency}` : formatted;
};