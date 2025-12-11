import { Suspense, lazy, useEffect, useState } from 'react';
import { analytics } from '../shared/lib/analytics';
import WebApp from '@twa-dev/sdk';
import Layout from '../layout/Layout';
import ErrorBoundary from '../shared/ui/ErrorBoundary/ErrorBoundary';
import { useCalculatorStore } from '../features/p2p-calculation/model/store';
import { safeTelegram } from '../shared/lib/telegram';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import '../index.transition.css';

const CalculatorPage = lazy(() => import('../pages/calculator/CalculatorPage'));
const HistoryPage = lazy(() => import('../pages/history/HistoryPage'));
const StatisticsPage = lazy(() => import('../pages/statistics/StatisticsPage'));

const safeWebApp = {
  ready: () => { try { WebApp?.ready?.(); } catch {} },
  expand: () => { try { WebApp?.expand?.(); } catch {} },
  setHeaderColor: (color: string) => { try { WebApp?.setHeaderColor?.(color as any); } catch {} },
  setBackgroundColor: (color: string) => { try { WebApp?.setBackgroundColor?.(color as any); } catch {} },
};

function App() {
  const theme = useCalculatorStore((state) => state.theme);
  const [currentPage, setCurrentPage] = useState<'calculator' | 'history' | 'statistics'>('calculator');

  useEffect(() => {
    safeWebApp.ready();
    safeWebApp.expand();
    try { safeTelegram.ready(); } catch {}

    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      safeWebApp.setHeaderColor('#111827');
      safeWebApp.setBackgroundColor('#111827');
    } else {
      document.documentElement.classList.remove('dark');
      safeWebApp.setHeaderColor('#ffffff');
      safeWebApp.setBackgroundColor('#ffffff');
    }
    
    analytics.track('page_view', { page: 'app-init' });

    try {
      const dsn = (import.meta as any).env?.VITE_SENTRY_DSN;
      if (dsn) {
        (async () => {
          try {
            const Sentry = await import('@sentry/react');
            Sentry.init({
              dsn,
              integrations: [Sentry.browserTracingIntegration()],
              tracesSampleRate: 0.1,
              environment: (import.meta as any).env?.MODE || 'production',
            });
          } catch {}
        })();
      }
    } catch {}
  }, [theme]);

  useEffect(() => {
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;
    let isSwipeBlocked = false;

    const handleTouchStart = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      const tagName = target.tagName.toLowerCase();
      const isInteractive =
        tagName === 'input' ||
        tagName === 'textarea' ||
        tagName === 'select' ||
        tagName === 'button' ||
        target.isContentEditable ||
        target.closest('input, textarea, select, button, [contenteditable="true"], .no-swipe');

      isSwipeBlocked = !!isInteractive;

      if (!isSwipeBlocked) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        touchEndX = touchStartX;
        touchEndY = touchStartY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isSwipeBlocked) {
        touchEndX = e.touches[0].clientX;
        touchEndY = e.touches[0].clientY;
      }
    };

    const handleTouchEnd = () => {
      if (isSwipeBlocked) {
        isSwipeBlocked = false;
        return;
      }

      const deltaX = touchEndX - touchStartX;
      const deltaY = touchEndY - touchStartY;
      const isHorizontalSwipe = Math.abs(deltaX) > 80 && Math.abs(deltaX) > Math.abs(deltaY) * 2;

      if (isHorizontalSwipe) {
        if (deltaX < 0) {
          if (currentPage === 'calculator') setCurrentPage('history');
          else if (currentPage === 'history') setCurrentPage('statistics');
        } else {
          if (currentPage === 'statistics') setCurrentPage('history');
          else if (currentPage === 'history') setCurrentPage('calculator');
        }
      }
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [currentPage]);

  useEffect(() => {
    analytics.track('page_view', { page: currentPage });
  }, [currentPage]);

  const renderPage = () => {
    switch (currentPage) {
      case 'history': return <HistoryPage />;
      case 'statistics': return <StatisticsPage />;
      default: return <CalculatorPage />;
    }
  };

  return (
    <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
      <ErrorBoundary>
        <Suspense fallback={<div className="flex items-center justify-center py-20 text-gray-400 animate-fade-in">Загрузка...</div>}>
          <SwitchTransition mode="out-in">
            <CSSTransition key={currentPage} timeout={400} classNames="page-transition">
              <div>{renderPage()}</div>
            </CSSTransition>
          </SwitchTransition>
        </Suspense>
      </ErrorBoundary>
    </Layout>
  );
}

export default App;
