import React from 'react';
import { X, Lightbulb } from 'lucide-react';

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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content animate-scale-in" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="flex items-center gap-3">
            <div className="modal-icon">
              <Lightbulb size={22} />
            </div>
            <h2 className="modal-title">Как это работает</h2>
          </div>
          <button 
            onClick={onClose} 
            className="btn-icon" 
            title="Закрыть" 
            aria-label="Закрыть"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="modal-body space-y-4">
          {/* Шаг 1 */}
          <div className="step-card step-primary">
            <div className="step-number">1</div>
            <div className="step-content">
              <h3 className="step-title">{t.step1Title}</h3>
              <p className="step-text">{t.step1Text}</p>
            </div>
          </div>

          {/* Шаг 2 */}
          <div className="step-card step-secondary">
            <div className="step-number">2</div>
            <div className="step-content">
              <h3 className="step-title">{t.step2Title}</h3>
              <p className="step-text">{t.step2Text}</p>
            </div>
          </div>

          {/* Шаг 3 */}
          <div className="step-card step-success">
            <div className="step-number">3</div>
            <div className="step-content">
              <h3 className="step-title">{t.step3Title}</h3>
              <p className="step-text">{t.step3Text}</p>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button 
            onClick={onClose} 
            className="btn btn-primary w-full" 
            aria-label="Понятно"
          >
            Понятно
          </button>
        </div>
      </div>
    </div>
  );
};
