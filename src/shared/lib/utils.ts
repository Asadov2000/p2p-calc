import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatCurrency = (val: number, currency: string = '') => {
  const formatted = new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(val);
  
  return currency ? `${formatted} ${currency}` : formatted;
};

// НОВАЯ ФУНКЦИЯ: Делает "1 000 000" при вводе
export const formatInputNumber = (value: string) => {
  if (!value) return '';
  
  // 1. Оставляем только цифры и точку (заменяем запятую на точку)
  let val = value.replace(/,/g, '.').replace(/[^\d.]/g, '');
  
  // 2. Защита от лишних точек (1.2.3 -> 1.23)
  const parts = val.split('.');
  
  // 3. Форматируем целую часть (добавляем пробелы)
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  
  // 4. Собираем обратно
  // Если есть дробная часть, обрезаем её до 8 знаков (чтобы не было 0.0000000001)
  if (parts.length > 1) {
    return `${parts[0]}.${parts[1].slice(0, 8)}`;
  }
  
  // Если пользователь поставил точку в конце ("123."), возвращаем с точкой
  if (val.endsWith('.')) {
    return `${parts[0]}.`;
  }

  return parts[0];
};