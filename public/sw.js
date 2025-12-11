// Service Worker для P2P Calculator
// Версия 2.0 - Оптимизированный для всех платформ

const CACHE_VERSION = 'v2';
const STATIC_CACHE = `p2p-calc-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `p2p-calc-dynamic-${CACHE_VERSION}`;
const FONT_CACHE = `p2p-calc-fonts-${CACHE_VERSION}`;

// Ресурсы для предварительного кеширования
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
];

// Паттерны для разных типов кеширования
const CACHE_STRATEGIES = {
  // Статические ресурсы - Cache First
  static: [
    /\.(?:js|css)$/,
    /\/assets\//,
  ],
  // Шрифты - Cache First с долгим сроком
  fonts: [
    /fonts\.googleapis\.com/,
    /fonts\.gstatic\.com/,
    /\.(?:woff2?|ttf|otf|eot)$/,
  ],
  // Изображения - Cache First
  images: [
    /\.(?:png|jpg|jpeg|gif|webp|svg|ico)$/,
  ],
  // API и динамический контент - Network First
  dynamic: [
    /\/api\//,
    /telegram\.org/,
  ],
};

// Хелпер для определения стратегии кеширования
function getCacheStrategy(url) {
  const urlString = url.toString();
  
  for (const pattern of CACHE_STRATEGIES.fonts) {
    if (pattern.test(urlString)) return 'fonts';
  }
  for (const pattern of CACHE_STRATEGIES.static) {
    if (pattern.test(urlString)) return 'static';
  }
  for (const pattern of CACHE_STRATEGIES.images) {
    if (pattern.test(urlString)) return 'images';
  }
  for (const pattern of CACHE_STRATEGIES.dynamic) {
    if (pattern.test(urlString)) return 'dynamic';
  }
  return 'default';
}

// Installation
self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[SW] Precaching assets');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activation - очистка старых кешей
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => {
              return name.startsWith('p2p-calc-') && 
                     name !== STATIC_CACHE && 
                     name !== DYNAMIC_CACHE &&
                     name !== FONT_CACHE;
            })
            .map((name) => {
              console.log('[SW] Deleting old cache:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch handler
self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // Пропускаем не-GET запросы
  if (request.method !== 'GET') return;
  
  // Пропускаем chrome-extension и другие не-http запросы
  if (!request.url.startsWith('http')) return;
  
  const strategy = getCacheStrategy(request.url);
  
  switch (strategy) {
    case 'fonts':
      event.respondWith(cacheFirst(request, FONT_CACHE, 31536000)); // 1 год
      break;
    case 'static':
    case 'images':
      event.respondWith(cacheFirst(request, STATIC_CACHE, 604800)); // 1 неделя
      break;
    case 'dynamic':
      event.respondWith(networkFirst(request, DYNAMIC_CACHE));
      break;
    default:
      // Для HTML - Network First
      if (request.destination === 'document') {
        event.respondWith(networkFirst(request, DYNAMIC_CACHE));
      } else {
        event.respondWith(staleWhileRevalidate(request, DYNAMIC_CACHE));
      }
  }
});

// Cache First стратегия
async function cacheFirst(request, cacheName, maxAge = 86400) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  
  if (cached) {
    return cached;
  }
  
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    return new Response('Offline', { status: 503 });
  }
}

// Network First стратегия
async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await cache.match(request);
    if (cached) {
      return cached;
    }
    // Fallback для HTML
    if (request.destination === 'document') {
      return cache.match('/index.html');
    }
    return new Response('Offline', { status: 503 });
  }
}

// Stale While Revalidate стратегия
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  
  const fetchPromise = fetch(request)
    .then((response) => {
      if (response.ok) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => null);
  
  return cached || fetchPromise || new Response('Offline', { status: 503 });
}

// Обработка push уведомлений (для будущего использования)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/icon-192x192.png',
      badge: '/icon-72x72.png',
      vibrate: [100, 50, 100],
      data: data.url,
    });
  }
});

// Клик по уведомлению
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.notification.data) {
    event.waitUntil(
      clients.openWindow(event.notification.data)
    );
  }
});

// Background Sync (для будущего использования)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-history') {
    console.log('[SW] Background sync: sync-history');
  }
});
