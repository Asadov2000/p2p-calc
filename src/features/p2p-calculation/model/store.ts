import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { HistoryItem } from '../../../shared/types';
import { Language, Theme } from '../../../shared/lib/translations';

interface CalculatorState {
  fiatInput: string;
  cryptoInput: string;
  profitInput: string;
  commissionInput: string;
  
  isCommissionVisible: boolean;
  language: Language;
  theme: Theme;

  setFiat: (val: string) => void;
  setCrypto: (val: string) => void;
  setProfit: (val: string) => void;
  setCommission: (val: string) => void;
  toggleCommission: () => void;
  setLanguage: (lang: Language) => void;
  toggleTheme: () => void;
  resetCalculator: () => void;

  history: HistoryItem[];
  addToHistory: (item: HistoryItem) => void;
  clearHistory: () => void;
}

export const useCalculatorStore = create<CalculatorState>()(
  persist(
    (set) => ({
      // 1. Очистили строки (были '5000' и т.д.)
      fiatInput: '',
      cryptoInput: '',
      profitInput: '',
      commissionInput: '', 
      
      isCommissionVisible: false,
      language: 'ru',
      theme: 'light',
      history: [],

      setFiat: (val) => set({ fiatInput: val }),
      setCrypto: (val) => set({ cryptoInput: val }),
      setProfit: (val) => set({ profitInput: val }),
      setCommission: (val) => set({ commissionInput: val }),
      toggleCommission: () => set((state) => ({ isCommissionVisible: !state.isCommissionVisible })),
      
      setLanguage: (lang) => set({ language: lang }),
      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),

      resetCalculator: () => set({
        fiatInput: '',
        cryptoInput: '',
        profitInput: '',
        commissionInput: '',
        isCommissionVisible: false
      }),

      addToHistory: (item) => set((state) => ({
        history: [item, ...state.history].slice(0, 20)
      })),
      
      clearHistory: () => set({ history: [] }),
    }),
    {
      name: 'p2p-calculator-v3-clean', // Новое имя хранилища для сброса старых данных
    }
  )
);