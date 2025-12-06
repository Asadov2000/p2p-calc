# 📦 Production Deployment Guide

## Перед развертыванием

### 1. Запустить production build
```bash
npm run build
```

Это создаст оптимизированную версию в папке `dist/`.

### 2. Проверить build
```bash
npm run preview
```

Откройте `http://localhost:4173` и проверьте функциональность.

### 3. Запустить Lighthouse audit
1. Откройте DevTools (F12)
2. Перейдите на вкладку Lighthouse
3. Запустите анализ (Mobile + Desktop)

### Целевые показатели:
- **Performance:** ≥ 90
- **Accessibility:** ≥ 85
- **Best Practices:** ≥ 90
- **SEO:** ≥ 90

---

## Вариант 1: Деплой на Vercel (рекомендуется)

### Преимущества:
- ✅ Автоматический Build & Deploy
- ✅ CDN +fast edge functions
- ✅ SSL по умолчанию
- ✅ 100 Lighthouse score возможен
- ✅ Бесплатная tier достаточна

### Шаги:

1. **Создать账户 на vercel.com**
```bash
npm install -g vercel
```

2. **Деплой:**
```bash
vercel
```

3. **Или подключить GitHub:**
   - Перейти на vercel.com
   - Sign up with GitHub
   - Authorize Vercel
   - Import p2p-calc repository
   - Vercel автоматически будет собирать и деплоить при каждом push

### Конфиг (vercel.json):
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "headers": [
    {
      "source": "/sw.js",
      "headers": [
        {
          "key": "Service-Worker-Allowed",
          "value": "/"
        },
        {
          "key": "Cache-Control",
          "value": "public, max-age=0, must-revalidate"
        }
      ]
    },
    {
      "source": "/manifest.json",
      "headers": [
        {
          "key": "Content-Type",
          "value": "application/manifest+json"
        }
      ]
    }
  ]
}
```

---

## Вариант 2: Деплой на Netlify

### Шаги:

1. **Подключить GitHub:**
   - netlify.com → Sign up with GitHub
   - Authorize Netlify
   - Select p2p-calc repo

2. **Настроить build settings:**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Click Deploy

### Конфиг (netlify.toml):
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[headers]]
  for = "/sw.js"
  [headers.values]
    Service-Worker-Allowed = "/"
    Cache-Control = "public, max-age=0, must-revalidate"

[[headers]]
  for = "/manifest.json"
  [headers.values]
    Content-Type = "application/manifest+json"
```

---

## Вариант 3: Деплой на GitHub Pages

### Ограничения:
- ⚠️ Только static файлы
- ⚠️ Нужно установить base path

### Шаги:

1. **Обновить vite.config.ts:**
```typescript
export default defineConfig({
  base: '/p2p-calc/', // Если репо не root
  // ... остальное
})
```

2. **Обновить package.json:**
```json
{
  "scripts": {
    "build": "tsc -b && vite build",
    "deploy": "gh-pages -d dist"
  },
  "devDependencies": {
    "gh-pages": "^6.0.0"
  }
}
```

3. **Деплой:**
```bash
npm run build
npm run deploy
```

4. **На GitHub:**
   - Settings → Pages
   - Source: gh-pages branch
   - Save

---

## Вариант 4: Docker + собственный сервер

### Dockerfile:
```dockerfile
# Build stage
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### nginx.conf:
```nginx
server {
  listen 80;
  server_name _;
  root /usr/share/nginx/html;
  index index.html;

  # Service Worker
  location ~ /sw.js$ {
    add_header Service-Worker-Allowed "/";
    add_header Cache-Control "public, max-age=0, must-revalidate";
  }

  # Manifest
  location ~ /manifest.json$ {
    add_header Content-Type "application/manifest+json";
  }

  # Кэширование статических файлов
  location ~ \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    add_header Cache-Control "public, max-age=31536000, immutable";
  }

  # SPA fallback
  location / {
    try_files $uri $uri/ /index.html;
  }
}
```

### Сборка и деплой:
```bash
docker build -t p2p-calc:latest .
docker run -p 80:80 p2p-calc:latest
```

---

## Production Checklist

### Безопасность:
- [ ] HTTPS включен (должно быть по умолчанию)
- [ ] CSP headers настроены
- [ ] X-Frame-Options: SAMEORIGIN
- [ ] X-Content-Type-Options: nosniff
- [ ] Referrer-Policy: strict-origin-when-cross-origin

### Performance:
- [ ] Gzip compression включена
- [ ] Brotli compression включена (если поддерживается)
- [ ] Images оптимизированы
- [ ] CSS/JS минифицирован
- [ ] Source maps удалены из production

### Мониторинг:
- [ ] Error tracking (Sentry, Rollbar)
- [ ] Performance monitoring (Web Vitals)
- [ ] Analytics (Google Analytics, Plausible)
- [ ] Uptime monitoring (UptimeRobot)

### Доступность:
- [ ] ARIA labels добавлены
- [ ] Keyboard navigation работает
- [ ] Color contrast OK (WCAG AA)
- [ ] Screen reader тестирование

### SEO:
- [ ] Meta tags оптимизированы
- [ ] og: tags для социальных сетей
- [ ] robots.txt создан
- [ ] sitemap.xml создан (если нужно)

---

## Production Environment Variables

Если используются переменные окружения:

### .env.production:
```
VITE_API_URL=https://api.example.com
VITE_SENTRY_DSN=https://...@sentry.io/...
VITE_GA_ID=G-XXXXXXXXXX
```

### Access в коде:
```typescript
const apiUrl = import.meta.env.VITE_API_URL;
```

---

## Мониторинг и логирование

### Подключить Sentry для обработки ошибок:

```bash
npm install @sentry/react
```

```typescript
// main.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
  integrations: [
    new Sentry.Replay({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});
```

---

## Масштабирование

### Если приложение растет:

1. **Code Splitting:**
   - React.lazy() для компонентов
   - Dynamic imports

2. **Database:**
   - Добавить бэкенд для сохранения истории
   - Cloudflare Workers / Supabase для быстроты

3. **CDN:**
   - Всегда используйте CDN для статических файлов
   - Vercel/Netlify делают это автоматически

4. **Кэширование:**
   - Redis для кэширования API ответов
   - Service Worker для client-side кэширования

---

## Откат при проблемах

### Vercel:
1. Dashboard → Deployments
2. Найти предыдущую версию
3. Нажать "Promote to Production"

### Netlify:
1. Deploy history
2. Найти рабочую версию
3. Publish

### GitHub Pages:
```bash
git revert HEAD
git push
```

---

**Готово! Приложение готово к production использованию.** 🚀
