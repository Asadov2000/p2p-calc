import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Language, Theme } from '../../../shared/lib/translations';

export interface HistoryItem {
  id: string;
  timestamp: number;
  fiatAmount: number;
  cryptoAmount: number;
  calculatedRate: number;
  profitTarget?: number;
  sellPrice?: number;
}

interface CalculatorState {
  fiatInput: string;
  cryptoInput: string;
  history: HistoryItem[];
  language: Language;
  theme: Theme;
  quickButtons: { label: string; value: string }[];
  showCommission: boolean;
  setFiat: (value: string) => void;
  setCrypto: (value: string) => void;
  setQuickButtons: (items: { label: string; value: string }[]) => void;
  addQuickButton: (item: { label: string; value: string }) => void;
  removeQuickButton: (value: string) => void;
  updateQuickButton: (value: string, label: string) => void;
  addToHistory: (item: HistoryItem) => void;
  setHistory: (items: HistoryItem[]) => void;
  clearHistory: () => void;
  resetCalculator: () => void;
  setLanguage: (lang: Language) => void;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  setShowCommission: (show: boolean) => void;
}

export const useCalculatorStore = create<CalculatorState>()(
  persist(
    (set) => ({
      fiatInput: '',
      cryptoInput: '',
      quickButtons: [
        { value: '5000', label: '5k' },
        { value: '10000', label: '10k' },
        { value: '15000', label: '15k' },
        { value: '25000', label: '25k' },
        { value: '50000', label: '50k' },
        { value: '100000', label: '100k' },
      ],
      history: [],
      language: 'ru',
      theme: 'light',
      showCommission: false,

      setFiat: (value) => set({ fiatInput: value }),
      setCrypto: (value) => set({ cryptoInput: value }),
      setQuickButtons: (items) => set({ quickButtons: items }),
      addQuickButton: (item) => set((state) => ({ quickButtons: [item, ...state.quickButtons].slice(0, 12) })),
      removeQuickButton: (value) => set((state) => ({ quickButtons: state.quickButtons.filter((i) => i.value !== value) })),
      updateQuickButton: (value, label) => set((state) => ({
        quickButtons: state.quickButtons.map((i) => (i.value === value ? { ...i, label } : i)),
      })),
      addToHistory: (item) => set((state) => ({ history: [item, ...state.history].slice(0, 50) })),
      setHistory: (items) => set({ history: items }),
      clearHistory: () => set({ history: [] }),
      resetCalculator: () => set({ fiatInput: '', cryptoInput: '' }),
      setLanguage: (lang) => set({ language: lang }),
      toggleTheme: () => set((state) => {
        const newTheme = state.theme === 'light' ? 'dark' : 'light';
        if (newTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        return { theme: newTheme };
      }),
      setTheme: (theme) => set(() => {
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        return { theme };
      }),
      setShowCommission: (show) => set({ showCommission: show }),
    }),
    { name: 'p2p-calculator-storage' }
  )
);
