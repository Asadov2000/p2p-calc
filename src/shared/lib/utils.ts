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

// Безопасное копирование в буфер обмена с fallback
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    // Современный способ
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback для старых браузеров и HTTP
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      
      const success = document.execCommand('copy');
      document.body.removeChild(textarea);
      return success;
    }
  } catch (err) {
    console.error('Failed to copy to clipboard:', err);
    return false;
  }
}

// Экспорт в JSON
export function downloadJSON(data: unknown, filename: string = 'export.json') {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  downloadFile(blob, filename);
}

// Экспорт в CSV
export function downloadCSV(data: any[], filename: string = 'export.csv') {
  if (data.length === 0) return;
  
  const headers = Object.keys(data[0]);
  const csv = [
    headers.join(','),
    ...data.map(row => headers.map(h => {
      const val = row[h];
      // Экранируем значения с запятыми
      return typeof val === 'string' && val.includes(',') ? `"${val}"` : val;
    }).join(','))
  ].join('\n');
  
  const blob = new Blob([csv], { type: 'text/csv' });
  downloadFile(blob, filename);
}

// Скачивание файла (вспомогательная функция)
function downloadFile(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Импорт истории из JSON файла
export async function importHistoryFromFile(file: File): Promise<any[] | null> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);
        
        // Валидация: проверяем, что это массив с нужной структурой
        if (Array.isArray(data) && data.length > 0) {
          const hasRequiredFields = data.every(item => 
            item.id && typeof item.fiatAmount === 'number' && typeof item.cryptoAmount === 'number'
          );
          if (hasRequiredFields) {
            resolve(data);
            return;
          }
        }
        
        // Если это объект с полем history
        if (data.history && Array.isArray(data.history)) {
          resolve(data.history);
          return;
        }
        
        resolve(null);
      } catch (err) {
        console.error('Failed to parse file:', err);
        resolve(null);
      }
    };
    reader.onerror = () => resolve(null);
    reader.readAsText(file);
  });
}