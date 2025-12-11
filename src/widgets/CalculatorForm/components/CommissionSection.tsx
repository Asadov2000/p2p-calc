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
    <div className="card-solid space-y-4 sm:space-y-5 p-4 sm:p-5">
      <div>
        <IosInput
          label="Комиссия (%)"
          value={commissionPercent}
          onChange={onCommissionChange}
          symbol="%"
          placeholder="0"
        />
        <div className="flex-between mt-4 sm:mt-5 gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="stat-icon small flex-shrink-0" style={{ background: 'var(--danger-light)', color: 'var(--danger)' }}>
              <Percent size={12} className="sm:w-[14px] sm:h-[14px]" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] sm:text-xs text-[var(--text-tertiary)] block">Комиссия</span>
              <p className="font-semibold text-sm sm:text-base text-[var(--danger)] truncate">{formatCurrency(commissionAmount)} ₽</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="stat-icon small flex-shrink-0" style={{ background: 'var(--success-light)', color: 'var(--success)' }}>
              <Wallet size={12} className="sm:w-[14px] sm:h-[14px]" />
            </div>
            <div className="text-right min-w-0">
              <span className="text-[10px] sm:text-xs text-[var(--text-tertiary)] block">Чистыми</span>
              <p className="font-semibold text-sm sm:text-base text-[var(--success)] truncate">{formatCurrency(netAfterCommission)} ₽</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 sm:gap-3">
        <button 
          onClick={onShare} 
          className="btn btn-secondary flex-1 text-sm sm:text-base py-3 sm:py-3.5" 
          aria-label="Поделиться"
        >
          <Share2 size={16} className="sm:w-[18px] sm:h-[18px]" />
          <span className="hidden xs:inline">Поделиться</span>
          <span className="xs:hidden">Шейр</span>
        </button>
        <button 
          onClick={onExportPDF} 
          className="btn btn-primary flex-1 text-sm sm:text-base py-3 sm:py-3.5" 
          aria-label="Экспорт в PDF"
        >
          <FileDown size={16} className="sm:w-[18px] sm:h-[18px]" />
          PDF
        </button>
      </div>
    </div>
  );
});

CommissionSection.displayName = 'CommissionSection';
