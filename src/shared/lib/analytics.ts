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
    return [];
  }
};

const write = (list: EventRecord[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (e) {}
};

const trackUmami = (eventName: string, eventData?: Record<string, any>) => {
  try {
    const umami = (window as any).umami;
    if (umami?.track) {
      umami.track(eventName, eventData);
    }
  } catch (e) {}
};

export const analytics = {
  track: (type: string, payload?: Record<string, any>) => {
    const rec: EventRecord = { id: cryptoRandomId(), type, payload, ts: Date.now() };
    const list = read();
    list.push(rec);
    if (list.length > 500) list.splice(0, list.length - 500);
    write(list);
    trackUmami(type, payload);
    
    try {
      const dsn = (import.meta as any).env?.VITE_SENTRY_DSN;
      if (dsn) {
        import('@sentry/react').then(Sentry => {
          try {
            Sentry.addBreadcrumb?.({ category: 'analytics', message: type, data: payload });
          } catch (e) {}
        }).catch(() => {});
      }
    } catch (e) {}
  },
  
  pageView: (page: string) => {
    trackUmami('pageview', { page });
    analytics.track('page_view', { page });
  },
  
  list: (): EventRecord[] => read(),
  clear: () => write([]),
  export: (): string => JSON.stringify(read(), null, 2),
  
  getStats: () => {
    const events = read();
    const now = Date.now();
    const day = 24 * 60 * 60 * 1000;
    const week = 7 * day;
    const month = 30 * day;
    
    return {
      total: events.length,
      today: events.filter(e => now - e.ts < day).length,
      thisWeek: events.filter(e => now - e.ts < week).length,
      thisMonth: events.filter(e => now - e.ts < month).length,
      byType: events.reduce((acc, e) => {
        acc[e.type] = (acc[e.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      lastEvents: events.slice(-10).reverse(),
    };
  },
};

function cryptoRandomId() {
  try {
    return (crypto.getRandomValues(new Uint32Array(2))[0].toString(36) + Date.now().toString(36));
  } catch (e) {
    return (Math.random().toString(36).slice(2) + Date.now().toString(36));
  }
}
