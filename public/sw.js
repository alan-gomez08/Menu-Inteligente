const CACHE_NAME = 'menu-inteligente-v2';

// Recursos críticos para arranque offline / PWA
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.svg',
  '/assets-t1/icon.svg',
  '/assets-t1/Logo.svg',
  '/assets-t1/Logo 2.png',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/icons/apple-touch-icon.png',
  '/icons/maskable-icon-192x192.png',
  '/icons/maskable-icon-512x512.png',
  '/robots.txt'
];

// Instalación: Pre-cacheados de la estructura básica del menú
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('[PWA Service Worker] Error en precache selectivo:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// Activación: Limpieza inmediata de versiones anteriores de caché
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[PWA Service Worker] Eliminando caché antigua:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Intercepción de solicitudes de red con estrategia híbrida
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Ignorar métodos no GET o esquemas no compatibles
  if (request.method !== 'GET' || !request.url.startsWith('http')) {
    return;
  }

  const url = new URL(request.url);

  // IMPORTANTE: Solicitudes externas (Airtable CDN v5.airtableusercontent.com, Google Fonts, API):
  // Dejar que el navegador las maneje directamente sin interferencia de Service Worker
  // para garantizar imágenes frescas sin errores de expiración, firmas o CORS.
  if (url.origin !== self.location.origin) {
    return;
  }

  // 1. Estrategia para Navegación HTML (SPA): Network-First con fallback a index.html en caché
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .catch(() => {
          return caches.match('/index.html') || caches.match('/');
        })
    );
    return;
  }

  // 2. Estrategia para Assets Estáticos Locales (JS, CSS, SVGs, iconos): Stale-While-Revalidate
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => null);

      return cachedResponse || fetchPromise;
    })
  );
});

