export const parseNumber = (value: string): number => {
  const clean = value.replace(/\s/g, '').replace(',', '.');
  const num = parseFloat(clean);
  return isNaN(num) ? 0 : num;
};

export const calculateRate = (fiat: number, crypto: number): number => {
  if (!fiat || !crypto || crypto === 0) return 0;
  const rate = fiat / crypto;
  return isFinite(rate) ? rate : 0;
};
