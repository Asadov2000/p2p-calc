type EventRecord = {
  id: string;
  type: string;
  payload?: Record<string, any>;
  ts: number;
};

const STORAGE_KEY = 'p2p_calc_analytics_v1';

const read = (): EventRecord[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.debug('analytics: read error', e);
    return [];
  }
};

const write = (list: EventRecord[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.debug('analytics: write error', e);
  }
};

export const analytics = {
  track: (type: string, payload?: Record<string, any>) => {
    const rec: EventRecord = { id: cryptoRandomId(), type, payload, ts: Date.now() };
    const list = read();
    list.push(rec);
    // keep recent 500 events to avoid unbounded growth
    if (list.length > 500) list.splice(0, list.length - 500);
    write(list);
    // also log to console for dev
    try { console.debug('analytics.track', rec); } catch (e) {}
    // Если настроен Sentry DSN, добавим breadcrumb (лениво импортируем Sentry)
    try {
      const dsn = (import.meta as any).env?.VITE_SENTRY_DSN;
      if (dsn) {
        import('@sentry/react').then(Sentry => {
          try {
            Sentry.addBreadcrumb?.({ category: 'analytics', message: type, data: payload });
          } catch (e) { console.debug('sentry breadcrumb error', e); }
        }).catch(() => {});
      }
    } catch (e) { /* ignore in non-browser */ }
  },
  list: (): EventRecord[] => read(),
  clear: () => write([]),
  export: (): string => JSON.stringify(read(), null, 2),
};

function cryptoRandomId() {
  try {
    return (crypto.getRandomValues(new Uint32Array(2))[0].toString(36) + Date.now().toString(36));
  } catch (e) {
    return (Math.random().toString(36).slice(2) + Date.now().toString(36));
  }
}
