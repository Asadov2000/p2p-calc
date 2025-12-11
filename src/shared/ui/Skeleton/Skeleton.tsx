import { memo } from 'react';
import { cn } from '../../lib/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  lines?: number;
}

export const Skeleton = memo(({
  className,
  variant = 'rectangular',
  width,
  height,
  lines = 1,
}: SkeletonProps) => {
  const baseClasses = 'animate-pulse bg-gray-200 dark:bg-gray-700';
  
  const variantClasses = {
    text: 'rounded h-4',
    circular: 'rounded-full',
    rectangular: '',
    rounded: 'rounded-2xl',
  };

  const style = {
    width: width ? (typeof width === 'number' ? `${width}px` : width) : undefined,
    height: height ? (typeof height === 'number' ? `${height}px` : height) : undefined,
  };

  if (lines > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(baseClasses, variantClasses[variant], className)}
            style={{
              ...style,
              width: i === lines - 1 ? '75%' : style.width,
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(baseClasses, variantClasses[variant], className)}
      style={style}
    />
  );
});

Skeleton.displayName = 'Skeleton';

// Предустановленные скелетоны для разных частей приложения
export const HistoryItemSkeleton = memo(() => (
  <div className="bg-white dark:bg-[#1C1C1E] rounded-2xl p-4 shadow-sm space-y-3">
    <div className="flex justify-between items-start">
      <div className="space-y-2 flex-1">
        <Skeleton variant="text" width="60%" height={16} />
        <Skeleton variant="text" width="40%" height={14} />
      </div>
      <Skeleton variant="rounded" width={80} height={32} />
    </div>
    <div className="flex justify-between">
      <Skeleton variant="text" width="30%" height={12} />
      <Skeleton variant="text" width="25%" height={12} />
    </div>
  </div>
));

HistoryItemSkeleton.displayName = 'HistoryItemSkeleton';

export const StatisticsCardSkeleton = memo(() => (
  <div className="bg-white dark:bg-[#1C1C1E] rounded-2xl p-5 shadow-sm space-y-3">
    <Skeleton variant="text" width="40%" height={12} />
    <Skeleton variant="text" width="60%" height={28} />
    <Skeleton variant="text" width="80%" height={14} />
  </div>
));

StatisticsCardSkeleton.displayName = 'StatisticsCardSkeleton';

export const HistoryListSkeleton = memo(({ count = 5 }: { count?: number }) => (
  <div className="space-y-3">
    {Array.from({ length: count }).map((_, i) => (
      <HistoryItemSkeleton key={i} />
    ))}
  </div>
));

HistoryListSkeleton.displayName = 'HistoryListSkeleton';

export const StatisticsSkeleton = memo(() => (
  <div className="grid grid-cols-2 gap-4">
    {Array.from({ length: 4 }).map((_, i) => (
      <StatisticsCardSkeleton key={i} />
    ))}
  </div>
));

StatisticsSkeleton.displayName = 'StatisticsSkeleton';
