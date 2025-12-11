import React from 'react';
import { X, Sun, Moon, Trash2, Settings, Palette, Globe, Zap, BarChart3, Plus } from 'lucide-react';
import { Suspense } from 'react';
import { translations } from '../../../shared/lib/translations';
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

  const t = translations[language];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content max-w-lg animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="flex items-center gap-3">
            <div className="modal-icon">
              <Settings size={22} />
            </div>
            <h3 className="modal-title">{t.settings}</h3>
          </div>
          <button onClick={onClose} className="btn-icon" title={t.close} aria-label={t.close}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body space-y-6">
          {/* Смена темы */}
          <div className="settings-section">
            <div className="settings-label">
              <Palette size={16} />
              <span>{t.themeLabel}</span>
            </div>
            <div className="segmented-control">
              <button
                onClick={() => onSetTheme('light')}
                className={`segmented-item ${theme === 'light' ? 'active' : ''}`}
              >
                <Sun size={18} /> {t.themeLight}
              </button>
              <button
                onClick={() => onSetTheme('dark')}
                className={`segmented-item ${theme === 'dark' ? 'active' : ''}`}
              >
                <Moon size={18} /> {t.themeDark}
              </button>
            </div>
          </div>

          {/* Смена языка */}
          <div className="settings-section">
            <div className="settings-label">
              <Globe size={16} />
              <span>{t.languageLabel}</span>
            </div>
            <div className="segmented-control">
              {(['ru', 'en', 'tj'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => onSetLanguage(lang)}
                  className={`segmented-item ${language === lang ? 'active' : ''}`}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Управление быстрыми кнопками */}
          <div className="settings-section">
            <div className="settings-label">
              <Zap size={16} />
              <span>{t.quickButtons}</span>
            </div>
            <div className="space-y-2 mb-4">
              {quickEditor.map((it, idx) => (
                <div key={it.value + idx} className="flex gap-2 items-center">
                  <input
                    aria-label={`label-${idx}`}
                    value={it.label}
                    onChange={(e) =>
                      setQuickEditor((prev) =>
                        prev.map((p, i) =>
                          i === idx ? { ...p, label: sanitizeInput(e.target.value) } : p
                        )
                      )
                    }
                    className="settings-input flex-1"
                    placeholder={t.labelPlaceholder}
                    autoComplete="off"
                    type="text"
                    inputMode="text"
                  />
                  <input
                    aria-label={`value-${idx}`}
                    value={it.value}
                    onChange={(e) =>
                      setQuickEditor((prev) =>
                        prev.map((p, i) =>
                          i === idx ? { ...p, value: sanitizeInput(e.target.value) } : p
                        )
                      )
                    }
                    className="settings-input w-24"
                    placeholder={t.amountPlaceholder}
                    autoComplete="off"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                  />
                  <button
                    title={t.delete}
                    aria-label={`delete-${idx}`}
                    onClick={() => setQuickEditor((prev) => prev.filter((_, i) => i !== idx))}
                    className="settings-btn-danger"
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
                placeholder={t.labelPlaceholder}
                className="settings-input flex-1"
                autoComplete="off"
                type="text"
                inputMode="text"
              />
              <input
                id="newQuickValue"
                aria-label="new-value"
                placeholder={t.amountPlaceholder}
                className="settings-input w-24"
                autoComplete="off"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
              />
              <button
                title={t.add}
                aria-label="add-new-quick"
                onClick={() => {
                  const labelEl = document.getElementById(
                    'newQuickLabel'
                  ) as HTMLInputElement | null;
                  const valueEl = document.getElementById(
                    'newQuickValue'
                  ) as HTMLInputElement | null;
                  if (!labelEl || !valueEl) return;
                  const label = labelEl.value.trim();
                  const value = valueEl.value.trim();
                  if (!label || !value) return;
                  setQuickEditor((prev) => [{ label, value }, ...prev].slice(0, 12));
                  labelEl.value = '';
                  valueEl.value = '';
                }}
                className="settings-btn-success"
              >
                <Plus size={20} />
              </button>
            </div>
          </div>

          {/* Аналитика */}
          <div className="settings-section">
            <div className="settings-label">
              <BarChart3 size={16} />
              <span>{t.analytics}</span>
            </div>
            <p className="text-sm text-[var(--text-tertiary)] mb-3">{t.analyticsDesc}</p>
            <Suspense fallback={<div className="skeleton h-20 rounded-xl" />}>
              <AnalyticsPanel />
            </Suspense>
          </div>
        </div>

        <div className="modal-footer">
          <button
            onClick={() => {
              setQuickEditor(quickButtons);
              onClose();
            }}
            className="btn btn-secondary flex-1"
            aria-label={t.cancel}
          >
            {t.cancel}
          </button>
          <button
            onClick={() => {
              onSaveQuickButtons(quickEditor);
              onClose();
            }}
            className="btn btn-primary flex-1"
            aria-label={t.save}
          >
            {t.save}
          </button>
        </div>
      </div>
    </div>
  );
};
