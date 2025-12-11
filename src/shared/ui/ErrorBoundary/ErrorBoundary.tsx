import React from 'react';
import { analytics } from '../../lib/analytics';

interface State {
  hasError: boolean;
  error?: any;
}

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
          import('@sentry/react')
            .then((Sentry) => {
              try {
                Sentry.captureException(error);
              } catch (e) {
                console.debug('sentry capture error', e);
              }
            })
            .catch(() => {});
        }
      } catch (e) {
        /* ignore */
      }
    } catch (e) {
      console.debug('analytics error', e);
    }
    console.error('Unhandled error captured by ErrorBoundary', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="card-glass p-6 border-l-4 border-rose-500">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center text-white text-2xl">
              ⚠️
            </div>
            <div>
              <h3 className="text-lg font-bold text-[var(--text-primary)]">Произошла ошибка</h3>
              <p className="text-sm text-[var(--text-secondary)]">
                Обновите страницу или попробуйте позже
              </p>
            </div>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 w-full py-3 btn-primary rounded-2xl font-semibold"
          >
            Обновить страницу
          </button>
        </div>
      );
    }
    return this.props.children as any;
  }
}

export default ErrorBoundary;
