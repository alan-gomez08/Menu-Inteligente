import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Share, PlusSquare, Smartphone, Check } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const PwaInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // 1. Verificar si ya se está ejecutando como PWA instalada (Standalone)
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true ||
      document.referrer.includes('android-app://');

    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    // 2. Detección de dispositivo iOS (iPhone / iPad)
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isAppleDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isAppleDevice);

    // 3. Verificar si el usuario ya descartó el aviso recientemente (últimos 5 días)
    const dismissedTime = localStorage.getItem('pwa_prompt_dismissed');
    if (dismissedTime) {
      const daysSinceDismissed = (Date.now() - Number(dismissedTime)) / (1000 * 60 * 60 * 24);
      if (daysSinceDismissed < 5) {
        return;
      }
    }

    // 4. Capturar el evento estándar de instalación (Android / Chrome / Edge)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Mostrar el prompt tras 3 segundos para una experiencia no invasiva
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 3000);
      return () => clearTimeout(timer);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // En iOS, si no está en modo standalone y no fue descartado, mostrar el banner tras 3.5 segundos
    if (isAppleDevice && !isStandalone) {
      const iosTimer = setTimeout(() => {
        setIsVisible(true);
      }, 3500);
      return () => {
        clearTimeout(iosTimer);
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      };
    }

    // Escuchar trigger manual de instalación (ej. desde el menú drawer)
    const handleOpenInstall = () => {
      if (isStandalone) {
        return;
      }
      if (isAppleDevice) {
        setShowIOSGuide(true);
      } else if (deferredPrompt) {
        deferredPrompt.prompt();
      } else {
        setIsVisible(true);
      }
    };
    window.addEventListener('open-pwa-install', handleOpenInstall);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('open-pwa-install', handleOpenInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSGuide(true);
      return;
    }

    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsVisible(false);
      }
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setShowIOSGuide(false);
    localStorage.setItem('pwa_prompt_dismissed', Date.now().toString());
  };

  if (isInstalled || (!isVisible && !showIOSGuide)) {
    return null;
  }

  return (
    <>
      {/* Banner flotante discreto de invitación a instalar la PWA */}
      <AnimatePresence>
        {isVisible && !showIOSGuide && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-20 sm:bottom-6 left-4 sm:left-6 z-40 max-w-sm w-[calc(100%-2rem)] sm:w-auto bg-white/95 backdrop-blur-md border border-stone-200/90 rounded-2xl shadow-xl p-3.5 sm:p-4 select-none font-sans"
          >
            <div className="flex items-center gap-3">
              {/* Icono de la App */}
              <div className="w-11 h-11 rounded-xl bg-[#FAF1ED] border border-[#EADBD5] p-1.5 flex items-center justify-center shrink-0 shadow-2xs">
                <img
                  src="/icons/icon-192x192.png"
                  alt="App Icon"
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Textos */}
              <div className="flex-1 min-w-0 pr-1">
                <p className="font-bold text-xs sm:text-[13px] text-stone-900 leading-tight">
                  Instalá nuestra App
                </p>
                <p className="text-[11px] text-stone-500 leading-snug mt-0.5 truncate">
                  Accedé al menú al instante y sin esperas
                </p>
              </div>

              {/* Botón de instalación */}
              <button
                type="button"
                onClick={handleInstallClick}
                className="flex items-center gap-1.5 bg-[#D9532F] hover:bg-[#C24422] text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs transition-transform active:scale-95 cursor-pointer shrink-0"
              >
                <Download className="w-3.5 h-3.5 stroke-[2.2]" />
                <span>Instalar</span>
              </button>

              {/* Botón Cerrar */}
              <button
                type="button"
                onClick={handleDismiss}
                className="w-7 h-7 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                aria-label="Cerrar aviso de instalación"
              >
                <X className="w-3.5 h-3.5 stroke-[2.2]" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal interactivo de instrucciones exclusivas para iPhone / iPad (Safari) */}
      <AnimatePresence>
        {showIOSGuide && (
          <div className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center p-4">
            {/* Backdrop oscuro */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowIOSGuide(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs cursor-pointer"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-stone-100 font-sans z-[121]"
            >
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#FAF1ED] text-[#D9532F] flex items-center justify-center">
                    <Smartphone className="w-4.5 h-4.5 stroke-[2.2]" />
                  </div>
                  <h3 className="font-extrabold text-stone-900 text-sm sm:text-base">
                    Instalar en tu iPhone
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowIOSGuide(false)}
                  aria-label="Cerrar instrucciones de instalación"
                  className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 flex items-center justify-center transition cursor-pointer"
                >
                  <X className="w-4 h-4 stroke-[2.2]" />
                </button>
              </div>

              <div className="py-4 space-y-3.5 text-xs text-stone-700">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-stone-100 font-bold text-stone-800 flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </div>
                  <p className="leading-relaxed">
                    Tocá el botón de <strong className="text-stone-900">Compartir</strong>{' '}
                    <Share className="w-3.5 h-3.5 inline text-[#D9532F] mx-0.5 -mt-0.5" /> en la barra
                    inferior de Safari.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-stone-100 font-bold text-stone-800 flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </div>
                  <p className="leading-relaxed">
                    Deslizá las opciones y seleccioná{' '}
                    <strong className="text-stone-900">"Agregar a inicio"</strong>{' '}
                    <PlusSquare className="w-3.5 h-3.5 inline text-stone-700 mx-0.5 -mt-0.5" />.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-stone-100 font-bold text-stone-800 flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </div>
                  <p className="leading-relaxed">
                    Presioná <strong className="text-stone-900">"Agregar"</strong> en la esquina
                    superior derecha y listo.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowIOSGuide(false);
                  setIsVisible(false);
                  localStorage.setItem('pwa_prompt_dismissed', Date.now().toString());
                }}
                className="w-full py-2.5 bg-[#D9532F] hover:bg-[#C24422] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition active:scale-95 cursor-pointer mt-1"
              >
                <Check className="w-4 h-4 stroke-[2.5]" />
                <span>Entendido</span>
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PwaInstallPrompt;
