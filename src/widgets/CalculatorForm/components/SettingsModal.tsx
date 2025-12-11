import React from 'react';
import { X, Sun, Moon, Trash2 } from 'lucide-react';
import { Suspense } from 'react';
const AnalyticsPanel = React.lazy(() => import('../../../shared/ui/AnalyticsPanel/AnalyticsPanel'));

interface QuickButton {
  label: string;
  value: string;
}

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'light' | 'dark';
  language: 'ru' | 'en' | 'tj';
  quickButtons: QuickButton[];
  quickEditor: QuickButton[];
  setQuickEditor: React.Dispatch<React.SetStateAction<QuickButton[]>>;
  onSetTheme: (theme: 'light' | 'dark') => void;
  onSetLanguage: (lang: 'ru' | 'en' | 'tj') => void;
  onSaveQuickButtons: (buttons: QuickButton[]) => void;
  sanitizeInput: (value: string) => string;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  theme,
  language,
  quickButtons,
  quickEditor,
  setQuickEditor,
  onSetTheme,
  onSetLanguage,
  onSaveQuickButtons,
  sanitizeInput,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="relative bg-white dark:bg-[#1C1C1E] w-full max-w-lg rounded-[28px] p-6 shadow-2xl max-h-[85vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold dark:text-white">Настройки</h3>
          <button 
            onClick={onClose} 
            className="p-2 rounded-full bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-white hover:bg-gray-200 transition-colors" 
            title="Закрыть" 
            aria-label="Закрыть" 
            tabIndex={0} 
            role="button"
          >
            <X size={18} />
          </button>
        </div>
        
        {/* Смена темы */}
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-3 dark:text-gray-300">Тема оформления</label>
          <div className="flex gap-2">
            <button 
              onClick={() => onSetTheme('light')} 
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${theme === 'light' ? 'bg-blue-500 text-white shadow-lg' : 'bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300'}`}
            >
              <Sun size={18} /> Светлая
            </button>
            <button 
              onClick={() => onSetTheme('dark')} 
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${theme === 'dark' ? 'bg-blue-500 text-white shadow-lg' : 'bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300'}`}
            >
              <Moon size={18} /> Тёмная
            </button>
          </div>
        </div>

        {/* Смена языка */}
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-3 dark:text-gray-300">Язык интерфейса</label>
          <div className="flex gap-2">
            <button 
              onClick={() => onSetLanguage('ru')} 
              className={`flex-1 py-3 px-4 rounded-lg font-bold transition-all ${language === 'ru' ? 'bg-blue-500 text-white shadow-lg' : 'bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300'}`}
            >
              РУ
            </button>
            <button 
              onClick={() => onSetLanguage('en')} 
              className={`flex-1 py-3 px-4 rounded-lg font-bold transition-all ${language === 'en' ? 'bg-blue-500 text-white shadow-lg' : 'bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300'}`}
            >
              EN
            </button>
            <button 
              onClick={() => onSetLanguage('tj')} 
              className={`flex-1 py-3 px-4 rounded-lg font-bold transition-all ${language === 'tj' ? 'bg-blue-500 text-white shadow-lg' : 'bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300'}`}
            >
              TJ
            </button>
          </div>
        </div>

        {/* Управление быстрыми кнопками */}
        <div>
          <label className="block text-sm font-semibold mb-3 dark:text-gray-300">Быстрые кнопки</label>
          <div className="space-y-2 mb-4">
            {quickEditor.map((it, idx) => (
              <div key={it.value + idx} className="flex gap-2 items-center">
                <input 
                  aria-label={`label-${idx}`} 
                  value={it.label} 
                  onChange={(e) => setQuickEditor(prev => prev.map((p,i) => i===idx?{...p,label:sanitizeInput(e.target.value)}:p))} 
                  className="flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-white/20 bg-gray-50 dark:bg-black/40 text-sm" 
                  placeholder="Ярлык" 
                  autoComplete="off" 
                  type="text" 
                  inputMode="text" 
                />
                <input 
                  aria-label={`value-${idx}`} 
                  value={it.value} 
                  onChange={(e) => setQuickEditor(prev => prev.map((p,i) => i===idx?{...p,value:sanitizeInput(e.target.value)}:p))} 
                  className="w-24 px-3 py-2 rounded-lg border border-gray-200 dark:border-white/20 bg-gray-50 dark:bg-black/40 text-sm" 
                  placeholder="Сумма" 
                  autoComplete="off" 
                  type="text" 
                  inputMode="numeric" 
                  pattern="[0-9]*" 
                />
                <button 
                  title="Удалить" 
                  aria-label={`delete-${idx}`} 
                  onClick={() => setQuickEditor(prev => prev.filter((_,i)=>i!==idx))} 
                  className="p-2 rounded-lg bg-red-50 dark:bg-red-500/20 text-red-600 hover:bg-red-100 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2 mb-4">
            <input 
              id="newQuickLabel" 
              aria-label="new-label" 
              placeholder="Ярлык" 
              className="flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-white/20 bg-gray-50 dark:bg-black/40 text-sm" 
              autoComplete="off" 
              type="text" 
              inputMode="text" 
            />
            <input 
              id="newQuickValue" 
              aria-label="new-value" 
              placeholder="Сумма" 
              className="w-24 px-3 py-2 rounded-lg border border-gray-200 dark:border-white/20 bg-gray-50 dark:bg-black/40 text-sm" 
              autoComplete="off" 
              type="text" 
              inputMode="numeric" 
              pattern="[0-9]*" 
            />
            <button 
              title="Добавить" 
              aria-label="add-new-quick" 
              onClick={() => {
                const labelEl = document.getElementById('newQuickLabel') as HTMLInputElement | null;
                const valueEl = document.getElementById('newQuickValue') as HTMLInputElement | null;
                if (!labelEl || !valueEl) return;
                const label = labelEl.value.trim();
                const value = valueEl.value.trim();
                if (!label || !value) return;
                setQuickEditor(prev => [{ label, value }, ...prev].slice(0, 12));
                labelEl.value=''; valueEl.value='';
              }} 
              className="px-3 py-2 rounded-lg bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 hover:bg-green-200 transition-colors font-medium text-sm"
            >
              +
            </button>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button 
            onClick={() => { onSaveQuickButtons(quickEditor); onClose(); }} 
            className="flex-1 py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors" 
            aria-label="Сохранить быстрые кнопки" 
            tabIndex={0} 
            role="button"
          >
            Сохранить
          </button>
          <button 
            onClick={() => { setQuickEditor(quickButtons); onClose(); }} 
            className="flex-1 py-2 px-4 bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-200 transition-colors" 
            aria-label="Отмена" 
            tabIndex={0} 
            role="button"
          >
            Отмена
          </button>
        </div>
        
        <div className="mt-6">
          <h4 className="text-sm font-bold dark:text-white mb-2">Аналитика</h4>
          <div className="text-sm text-gray-600 dark:text-gray-300">Просмотр локальных событий аналитики.</div>
          <div className="mt-3">
            <Suspense fallback={<div className="text-sm text-gray-400">Загрузка...</div>}>
              <AnalyticsPanel />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
};
