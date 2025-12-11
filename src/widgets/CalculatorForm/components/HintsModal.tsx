import React from 'react';
import { X } from 'lucide-react';

interface HintsModalProps {
  isOpen: boolean;
  onClose: () => void;
  translations: {
    step1Title: string;
    step1Text: string;
    step2Title: string;
    step2Text: string;
    step3Title: string;
    step3Text: string;
  };
}

export const HintsModal: React.FC<HintsModalProps> = ({
  isOpen,
  onClose,
  translations: t,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="relative bg-white dark:bg-[#1C1C1E] w-full max-w-md rounded-[28px] p-6 shadow-2xl animate-ios-slide max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold dark:text-white">Как это работает</h2>
          <button 
            onClick={onClose} 
            className="p-2 rounded-full bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-white hover:bg-gray-200 dark:hover:bg-white/20 transition-colors" 
            title="Закрыть" 
            aria-label="Закрыть" 
            tabIndex={0} 
            role="button"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="space-y-4">
          {/* Шаг 1 */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-500/20 dark:to-blue-500/10 rounded-[20px] p-4 border border-blue-200 dark:border-blue-500/30">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center shrink-0 font-bold text-sm">1</div>
              <div>
                <h3 className="font-bold text-blue-900 dark:text-blue-100 mb-1">{t.step1Title}</h3>
                <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">{t.step1Text}</p>
              </div>
            </div>
          </div>

          {/* Шаг 2 */}
          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-500/20 dark:to-indigo-500/10 rounded-[20px] p-4 border border-indigo-200 dark:border-indigo-500/30">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center shrink-0 font-bold text-sm">2</div>
              <div>
                <h3 className="font-bold text-indigo-900 dark:text-indigo-100 mb-1">{t.step2Title}</h3>
                <p className="text-sm text-indigo-800 dark:text-indigo-200 leading-relaxed">{t.step2Text}</p>
              </div>
            </div>
          </div>

          {/* Шаг 3 */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-500/20 dark:to-green-500/10 rounded-[20px] p-4 border border-green-200 dark:border-green-500/30">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center shrink-0 font-bold text-sm">3</div>
              <div>
                <h3 className="font-bold text-green-900 dark:text-green-100 mb-1">{t.step3Title}</h3>
                <p className="text-sm text-green-800 dark:text-green-200 leading-relaxed">{t.step3Text}</p>
              </div>
            </div>
          </div>
        </div>

        <button 
          onClick={onClose} 
          className="mt-6 w-full py-3 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white rounded-[16px] font-bold transition-colors" 
          aria-label="Понятно" 
          tabIndex={0} 
          role="button"
        >
          Понятно
        </button>
      </div>
    </div>
  );
};
