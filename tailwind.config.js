/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // iOS System Colors
        ios: {
          light: {
            bg: '#F2F2F7',      // Системный фон (светлый)
            surface: '#FFFFFF',  // Карточки (белый)
            input: '#F3F4F6',    // Поля ввода (светло-серый)
            text: '#000000',     // Текст
            subtext: '#8E8E93',  // Подписи
          },
          dark: {
            bg: '#000000',       // Системный фон (черный)
            surface: '#1C1C1E',  // Карточки (темно-серый)
            input: '#2C2C2E',    // Поля ввода (чуть светлее)
            text: '#FFFFFF',     // Текст
            subtext: '#98989D',  // Подписи
          },
          blue: '#007AFF',       // Системный синий
          green: '#34C759',      // Системный зеленый
          red: '#FF3B30',        // Системный красный
        }
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'San Francisco', 'Helvetica Neue', 'sans-serif'],
      },
      boxShadow: {
        'ios': '0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)',
        'card': '0 8px 24px rgba(0, 0, 0, 0.08)',
        'card-dark': '0 8px 24px rgba(0, 0, 0, 0.4)',
        'button': '0 4px 12px rgba(0, 122, 255, 0.3)',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s infinite',
        'slide-in-right': 'slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'spin-smooth': 'spin-smooth 1.5s linear infinite',
        'bounce-in': 'bounce-in 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'shimmer': 'shimmer 2s infinite',
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'shake': 'shake 0.4s cubic-bezier(0.36, 0.07, 0.19, 0.97)',
        'scale-up': 'scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      }
    },
  },
  plugins: [],
}