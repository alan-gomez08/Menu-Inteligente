/**
 * Registrador oficial de PWA Service Worker
 * Permite el funcionamiento offline, caché optimizada y la instalación
 * del menú digital en la pantalla de inicio de celulares (iOS / Android) y escritorios.
 */
export function registerServiceWorker() {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js', { scope: '/' })
      .then((registration) => {
        // Escucha si hay una nueva versión del Service Worker disponible
        registration.addEventListener('updatefound', () => {
          const installingWorker = registration.installing;
          if (installingWorker) {
            installingWorker.addEventListener('statechange', () => {
              if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('[PWA] Nueva versión disponible. Lista para actualizar.');
              }
            });
          }
        });
      })
      .catch((error) => {
        console.warn('[PWA] Error al registrar Service Worker:', error);
      });
  });
}
