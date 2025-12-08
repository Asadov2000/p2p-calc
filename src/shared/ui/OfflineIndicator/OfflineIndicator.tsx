import { useEffect, useState, memo } from 'react';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator = memo(() => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 max-w-md mx-auto bg-orange-500 text-white rounded-lg p-3 flex items-center gap-2 shadow-lg animate-pulse z-50">
      <WifiOff size={18} />
      <span className="text-sm font-medium">Вы offline - операции сохраняются локально</span>
    </div>
  );
});

OfflineIndicator.displayName = 'OfflineIndicator';
