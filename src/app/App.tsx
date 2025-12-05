import { useEffect } from 'react';
import WebApp from '@twa-dev/sdk';
import { HomePage } from '../pages/home/ui/HomePage';

function App() {
  useEffect(() => {
    // Сообщаем Телеграму, что приложение готово
    WebApp.ready();
    // Разворачиваем на весь экран (важно для Android)
    WebApp.expand();
    // Красим хедер в цвет фона
    WebApp.setHeaderColor(WebApp.themeParams.bg_color || '#ffffff');
  }, []);

  return <HomePage />;
}

export default App;