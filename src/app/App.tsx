import { useEffect } from 'react';
import WebApp from '@twa-dev/sdk';
import { HomePage } from '../pages/home/ui/HomePage';
import { useCalculatorStore } from '../features/p2p-calculation/model/store';

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

  useEffect(() => {
    safeWebApp.ready();
    safeWebApp.expand();
    
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
  }, [theme]);

  return <HomePage />;
}

export default App;