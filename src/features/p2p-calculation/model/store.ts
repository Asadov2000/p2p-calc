import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Language, Theme } from '../../../shared/lib/translations';

// Обновляем интерфейс записи в истории
export interface HistoryItem {
  id: string;
  timestamp: number;
  fiatAmount: number;
  cryptoAmount: number;
  calculatedRate: number;
  // Добавляем новые поля (необязательные, чтобы старые записи не сломались)
  profitTarget?: number;
  sellPrice?: number;
}

interface CalculatorState {
  fiatInput: string;
  cryptoInput: string;
  history: HistoryItem[];
  language: Language;
  theme: Theme;
  
  setFiat: (value: string) => void;
  setCrypto: (value: string) => void;
  addToHistory: (item: HistoryItem) => void;
  clearHistory: () => void; // Добавили метод очистки
  resetCalculator: () => void;
  setLanguage: (lang: Language) => void;
  toggleTheme: () => void;
}

export const useCalculatorStore = create<CalculatorState>()(
  persist(
    (set) => ({
      fiatInput: "",
      cryptoInput: "",
      history: [],
      language: 'ru',
      theme: 'light',

      setFiat: (value) => set({ fiatInput: value }),
      setCrypto: (value) => set({ cryptoInput: value }),
      
      addToHistory: (item) => set((state) => ({ 
        history: [item, ...state.history].slice(0, 50) // Храним последние 50 записей
      })),

      clearHistory: () => set({ history: [] }), // Реализация очистки

      resetCalculator: () => set({ fiatInput: "", cryptoInput: "" }),
      
      setLanguage: (lang) => set({ language: lang }),
      
      toggleTheme: () => set((state) => {
        const newTheme = state.theme === 'light' ? 'dark' : 'light';
        // Меняем класс на html теге для Tailwind
        if (newTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        return { theme: newTheme };
      }),
    }),
    {
      name: 'p2p-calculator-storage',
    }
  )
);