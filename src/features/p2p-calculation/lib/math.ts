/**
 * Парсер числа из строки.
 * Убирает пробелы, заменяет запятую на точку.
 */
export const parseNumber = (value: string): number => {
  const clean = value.replace(/\s/g, '').replace(',', '.');
  const num = parseFloat(clean);
  return isNaN(num) ? 0 : num;
};

/**
 * Расчет курса.
 * Формула: Сумма / Сумма команды
 */
export const calculateRate = (fiat: number, crypto: number): number => {
  if (!fiat || !crypto || crypto === 0) return 0;
  return fiat / crypto;
};