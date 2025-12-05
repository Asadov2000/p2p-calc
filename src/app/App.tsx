import { useEffect } from 'react';
import WebApp from '@twa-dev/sdk';
import { HomePage } from '../pages/home/ui/HomePage';
import { useCalculatorStore } from '../features/p2p-calculation/model/store';

function App() {
  const theme = useCalculatorStore((state) => state.theme);

  useEffect(() => {
    WebApp.ready();
    WebApp.expand();
    
    // Применяем тему к HTML тегу
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      WebApp.setHeaderColor('#111827'); // Темный цвет хедера
      WebApp.setBackgroundColor('#111827');
    } else {
      document.documentElement.classList.remove('dark');
      WebApp.setHeaderColor('#ffffff'); // Светлый цвет хедера
      WebApp.setBackgroundColor('#ffffff');
    }
  }, [theme]);

  return <HomePage />;
}

export default App;