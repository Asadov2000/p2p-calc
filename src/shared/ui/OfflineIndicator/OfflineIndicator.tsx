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
    <div className="fixed bottom-24 left-4 right-4 max-w-md mx-auto bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl p-4 flex items-center gap-3 shadow-xl shadow-amber-500/25 animate-pulse z-50 backdrop-blur-lg">
      <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
        <WifiOff size={20} />
      </div>
      <div>
        <span className="text-sm font-bold">Вы offline</span>
        <p className="text-xs opacity-90">Операции сохраняются локально</p>
      </div>
    </div>
  );
});

OfflineIndicator.displayName = 'OfflineIndicator';
