import React from 'react';
import { analytics } from '../../lib/analytics';

interface State { hasError: boolean; error?: any }

export class ErrorBoundary extends React.Component<{ children?: React.ReactNode }, State> {
  constructor(props: {}) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, info: any) {
    try {
      analytics.track('error', { message: error?.message, stack: error?.stack, info });
      // Отправляем в Sentry (если настроен) — лениво импортируем
      try {
        const dsn = (import.meta as any).env?.VITE_SENTRY_DSN;
        if (dsn) {
          import('@sentry/react').then(Sentry => {
            try { Sentry.captureException(error); } catch (e) { console.debug('sentry capture error', e); }
          }).catch(() => {});
        }
      } catch (e) { /* ignore */ }
    } catch (e) { console.debug('analytics error', e); }
    console.error('Unhandled error captured by ErrorBoundary', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <h3 className="text-lg font-bold text-red-700 dark:text-red-300">Произошла ошибка</h3>
          <p className="text-sm text-gray-700 dark:text-gray-300">Мы зафиксировали ошибку и постараемся её исправить. Обновите страницу или попробуйте позже.</p>
        </div>
      );
    }
    return this.props.children as any;
  }
}

export default ErrorBoundary;
