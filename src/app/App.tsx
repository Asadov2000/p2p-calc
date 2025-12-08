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

// Безопасный вызов WebApp методов (работает и вне Telegram)
const safeWebApp = {
  ready: () => {
    try { WebApp?.ready?.(); } catch (e) { console.debug('WebApp.ready not available'); }
  },
  expand: () => {
    try { WebApp?.expand?.(); } catch (e) { console.debug('WebApp.expand not available'); }
  },
  setHeaderColor: (color: string) => {
    try { 
      // Telegram SDK принимает hex цвета или специальные значения
      WebApp?.setHeaderColor?.(color as any); 
    } catch (e) { console.debug('WebApp.setHeaderColor not available'); }
  },
  setBackgroundColor: (color: string) => {
    try { 
      // Telegram SDK принимает hex цвета или специальные значения
      WebApp?.setBackgroundColor?.(color as any); 
    } catch (e) { console.debug('WebApp.setBackgroundColor not available'); }
  }
};

function App() {
  const theme = useCalculatorStore((state) => state.theme);
  const [currentPage, setCurrentPage] = useState<'calculator' | 'history' | 'statistics'>('calculator');

  useEffect(() => {
    safeWebApp.ready();
    safeWebApp.expand();
    // Initialize our safeTelegram wrapper as well (no-op outside Telegram)
    try { safeTelegram.ready(); } catch (e) { /* ignore */ }
    
    // Применяем тему к HTML тегу
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      safeWebApp.setHeaderColor('#111827'); // Темный цвет хедера
      safeWebApp.setBackgroundColor('#111827');
    } else {
      document.documentElement.classList.remove('dark');
      safeWebApp.setHeaderColor('#ffffff'); // Светлый цвет хедера
      safeWebApp.setBackgroundColor('#ffffff');
    }
    // Track initial page view
    analytics.track('page_view', { page: 'app-init' });

    // Инициализация Sentry (лениво) если указан DSN
    try {
      const dsn = (import.meta as any).env?.VITE_SENTRY_DSN;
      if (dsn) {
        (async () => {
          try {
            const Sentry = await import('@sentry/react');
            const Tracing = await import('@sentry/tracing');
            Sentry.init({
              dsn,
              integrations: [new Tracing.BrowserTracing()],
              tracesSampleRate: 0.1,
              environment: (import.meta as any).env?.MODE || 'production'
            });
            analytics.track('sentry_init', { enabled: true });
          } catch (e) { console.debug('Sentry init failed', e); }
        })();
      }
    } catch (e) { /* ignore non-browser */ }
  }, [theme]);

  useEffect(() => {
    let touchStartX = 0;
    let touchEndX = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
    };
    const handleTouchMove = (e: TouchEvent) => {
      touchEndX = e.touches[0].clientX;
    };
    const handleTouchEnd = () => {
      const delta = touchEndX - touchStartX;
      if (Math.abs(delta) > 60) {
        if (delta < 0) {
          // свайп влево
          if (currentPage === 'calculator') setCurrentPage('history');
          else if (currentPage === 'history') setCurrentPage('statistics');
        } else {
          // свайп вправо
          if (currentPage === 'statistics') setCurrentPage('history');
          else if (currentPage === 'history') setCurrentPage('calculator');
        }
      }
    };
    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove);
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
      case 'history':
        return <HistoryPage />;
      case 'statistics':
        return <StatisticsPage />;
      default:
        return <CalculatorPage />;
    }
  };

  return (
    <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
      <ErrorBoundary>
        <Suspense fallback={<div className="flex items-center justify-center py-20 text-gray-400 animate-fade-in">Загрузка...</div>}>
          <SwitchTransition mode="out-in">
            <CSSTransition
              key={currentPage}
              timeout={400}
              classNames="page-transition"
            >
              <div>
                {renderPage()}
              </div>
            </CSSTransition>
          </SwitchTransition>
        </Suspense>
      </ErrorBoundary>
    </Layout>
  );
}

export default App;