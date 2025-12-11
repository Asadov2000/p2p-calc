import { memo } from 'react';
import { formatCurrency } from '../../../shared/lib/utils';
import { IosInput } from '../../../shared/ui/IosInput';
import { Share2, FileDown, Percent, Wallet } from 'lucide-react';

interface CommissionSectionProps {
  commissionPercent: string;
  commissionAmount: number;
  netAfterCommission: number;
  onCommissionChange: (val: string) => void;
  onShare: () => void;
  onExportPDF: () => void;
}

export const CommissionSection = memo(({
  commissionPercent,
  commissionAmount,
  netAfterCommission,
  onCommissionChange,
  onShare,
  onExportPDF,
}: CommissionSectionProps) => {
  return (
    <div className="card-solid space-y-5">
      <div>
        <IosInput
          label="Комиссия (%)"
          value={commissionPercent}
          onChange={onCommissionChange}
          symbol="%"
          placeholder="0"
        />
        <div className="flex-between mt-5">
          <div className="flex items-center gap-3">
            <div className="stat-icon small" style={{ background: 'var(--danger-light)', color: 'var(--danger)' }}>
              <Percent size={14} />
            </div>
            <div>
              <span className="text-xs text-[var(--text-tertiary)]">Комиссия</span>
              <p className="font-semibold text-[var(--danger)]">{formatCurrency(commissionAmount)} ₽</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="stat-icon small" style={{ background: 'var(--success-light)', color: 'var(--success)' }}>
              <Wallet size={14} />
            </div>
            <div className="text-right">
              <span className="text-xs text-[var(--text-tertiary)]">Чистыми</span>
              <p className="font-semibold text-[var(--success)]">{formatCurrency(netAfterCommission)} ₽</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button 
          onClick={onShare} 
          className="btn btn-secondary flex-1" 
          aria-label="Поделиться"
        >
          <Share2 size={18} />
          Поделиться
        </button>
        <button 
          onClick={onExportPDF} 
          className="btn btn-primary flex-1" 
          aria-label="Экспорт в PDF"
        >
          <FileDown size={18} />
          PDF
        </button>
      </div>
    </div>
  );
});

CommissionSection.displayName = 'CommissionSection';
