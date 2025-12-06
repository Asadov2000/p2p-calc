import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

// Вот эта функция, которой не хватало!
export function formatTime(timestamp: number): string {
  return new Intl.DateTimeFormat('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(timestamp));
}

export function formatInputNumber(value: string): string {
  // Разрешаем только цифры и одну запятую/точку
  let cleanValue = value.replace(/[^\d.,]/g, '');
  
  // Заменяем запятую на точку для унификации
  cleanValue = cleanValue.replace(',', '.');
  
  // Запрещаем вторую точку
  const parts = cleanValue.split('.');
  if (parts.length > 2) {
    cleanValue = parts[0] + '.' + parts.slice(1).join('');
  }
  
  return cleanValue;
}