import { memo } from 'react';
import { formatCurrency } from '../../../shared/lib/utils';
import { IosInput } from '../../../shared/ui/IosInput';

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
    <div className="bg-white dark:bg-[#1C1C1E] rounded-[20px] p-4 shadow-sm space-y-3">
      <div>
        <IosInput
          label="Комиссия (%)"
          value={commissionPercent}
          onChange={onCommissionChange}
          symbol="%"
          placeholder="0"
        />
        <div className="flex justify-between text-sm mt-2 text-gray-500">
          <div>Комиссия: <span className="font-bold text-gray-900 dark:text-white">{formatCurrency(commissionAmount)}</span></div>
          <div>Чистыми: <span className="font-bold text-gray-900 dark:text-white">{formatCurrency(netAfterCommission)}</span></div>
        </div>
      </div>

      <div className="flex gap-3">
        <button 
          onClick={onShare} 
          className="flex-1 py-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg font-medium hover:bg-blue-50 active:scale-95 transition-colors" 
          aria-label="Поделиться"
        >
          Поделиться
        </button>
        <button 
          onClick={onExportPDF} 
          className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium active:scale-95 transition-colors" 
          aria-label="Экспорт в PDF"
        >
          Экспорт PDF
        </button>
      </div>
    </div>
  );
});

CommissionSection.displayName = 'CommissionSection';
