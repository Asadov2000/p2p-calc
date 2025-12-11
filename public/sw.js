const CACHE_VERSION = 'v2';
const STATIC_CACHE = `p2p-calc-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `p2p-calc-dynamic-${CACHE_VERSION}`;
const FONT_CACHE = `p2p-calc-fonts-${CACHE_VERSION}`;

const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
];

const CACHE_STRATEGIES = {
  static: [/\.(?:js|css)$/, /\/assets\//],
  fonts: [/fonts\.googleapis\.com/, /fonts\.gstatic\.com/, /\.(?:woff2?|ttf|otf|eot)$/],
  images: [/\.(?:png|jpg|jpeg|gif|webp|svg|ico)$/],
  dynamic: [/\/api\//, /telegram\.org/],
};

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

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
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
            .map((name) => caches.delete(name))
        );
      })
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  if (request.method !== 'GET') return;
  if (!request.url.startsWith('http')) return;
  
  const strategy = getCacheStrategy(request.url);
  
  switch (strategy) {
    case 'fonts':
      event.respondWith(cacheFirst(request, FONT_CACHE, 31536000));
      break;
    case 'static':
    case 'images':
      event.respondWith(cacheFirst(request, STATIC_CACHE, 604800));
      break;
    case 'dynamic':
      event.respondWith(networkFirst(request, DYNAMIC_CACHE));
      break;
    default:
      if (request.destination === 'document') {
        event.respondWith(networkFirst(request, DYNAMIC_CACHE));
      } else {
        event.respondWith(staleWhileRevalidate(request, DYNAMIC_CACHE));
      }
  }
});

async function cacheFirst(request, cacheName, maxAge = 86400) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  
  if (cached) return cached;
  
  try {
    const response = await fetch(request);
    if (response.ok) cache.put(request, response.clone());
    return response;
  } catch (error) {
    return new Response('Offline', { status: 503 });
  }
}

async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  
  try {
    const response = await fetch(request);
    if (response.ok) cache.put(request, response.clone());
    return response;
  } catch (error) {
    const cached = await cache.match(request);
    if (cached) return cached;
    if (request.destination === 'document') {
      return cache.match('/index.html');
    }
    return new Response('Offline', { status: 503 });
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  
  const fetchPromise = fetch(request)
    .then((response) => {
      if (response.ok) cache.put(request, response.clone());
      return response;
    })
    .catch(() => null);
  
  return cached || fetchPromise || new Response('Offline', { status: 503 });
}

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

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.notification.data) {
    event.waitUntil(clients.openWindow(event.notification.data));
  }
});

self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-history') {}
});
