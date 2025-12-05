import { create } from 'zustand';
import { persist } from 'zustand/middleware'; // Для сохранения в памяти телефона
import { HistoryItem } from '../../../shared/types';

interface CalculatorState {
  // Значения полей ввода (храним как строки для удобства редактирования)
  fiatInput: string;
  cryptoInput: string;
  profitInput: string;

  // Действия
  setFiat: (val: string) => void;
  setCrypto: (val: string) => void;
  setProfit: (val: string) => void;
  
  // История
  history: HistoryItem[];
  addToHistory: (item: HistoryItem) => void;
  clearHistory: () => void;
}

export const useCalculatorStore = create<CalculatorState>()(
  persist(
    (set) => ({
      fiatInput: '',
      cryptoInput: '',
      profitInput: '',
      history: [],

      setFiat: (val) => set({ fiatInput: val }),
      setCrypto: (val) => set({ cryptoInput: val }),
      setProfit: (val) => set({ profitInput: val }),

      addToHistory: (item) => set((state) => ({
        // Добавляем новый элемент в начало и оставляем только последние 20
        history: [item, ...state.history].slice(0, 20)
      })),
      
      clearHistory: () => set({ history: [] }),
    }),
    {
      name: 'p2p-calculator-storage', // Имя ключа в LocalStorage
    }
  )
);