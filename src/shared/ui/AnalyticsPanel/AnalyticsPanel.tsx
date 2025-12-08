import React, { useState } from 'react';
import { analytics } from '../../lib/analytics';

export const AnalyticsPanel: React.FC = () => {
  const [events, setEvents] = useState(analytics.list());

  const refresh = () => setEvents(analytics.list());
  const clear = () => { analytics.clear(); setEvents([]); };
  const exportTxt = () => {
    const data = analytics.export();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'p2p-analytics.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 bg-white dark:bg-[#111827] rounded-lg shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-bold">Локальная аналитика</h4>
        <div className="flex gap-2">
          <button onClick={refresh} className="px-3 py-1 bg-gray-100 rounded">Обновить</button>
          <button onClick={exportTxt} className="px-3 py-1 bg-blue-600 text-white rounded">Экспорт</button>
          <button onClick={clear} className="px-3 py-1 bg-red-100 text-red-700 rounded">Очистить</button>
        </div>
      </div>
      <div className="max-h-48 overflow-auto text-xs font-mono bg-gray-50 dark:bg-black/40 p-2 rounded">
        {events.length === 0 ? <div className="text-gray-400">Нет событий</div> : (
          events.slice().reverse().map(ev => (
            <div key={ev.id} className="mb-2">
              <div className="text-[11px] text-gray-500">{new Date(ev.ts).toLocaleString()}</div>
              <div><strong>{ev.type}</strong> — <span className="text-gray-700">{JSON.stringify(ev.payload)}</span></div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AnalyticsPanel;
