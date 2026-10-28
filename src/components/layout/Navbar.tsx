import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Search, X, MapPin, Menu, Clock, Phone, Store, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  businessName: string;
  logoUrl?: string;
  localAbierto: boolean;
  horariosAtencion?: string;
  address?: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  whatsapp?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  businessName,
  logoUrl,
  localAbierto,
  horariosAtencion,
  address,
  searchQuery,
  onSearchChange,
  whatsapp,
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isInfoDrawerOpen, setIsInfoDrawerOpen] = useState(false);

  // Bloquear scroll de body cuando el Drawer lateral esté abierto
  useEffect(() => {
    if (isInfoDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isInfoDrawerOpen]);

  return (
    <header className="w-full bg-white select-none border-b border-stone-100 pt-[max(env(safe-area-inset-top,0px),12px)] sm:pt-[env(safe-area-inset-top,0px)]">
      <div className="max-w-[1320px] mx-auto px-5 sm:px-6 lg:px-6 h-14 sm:h-16 flex items-center justify-between gap-4">
        {/* ============================================================ */}
        {/* VISTA MOBILE: Menú hamburguesa (Izquierda)                   */}
        {/* ============================================================ */}
        <div className="lg:hidden flex items-center shrink-0">
          <button
            type="button"
            onClick={() => setIsInfoDrawerOpen(true)}
            aria-label="Abrir información del local"
            className="w-10 h-10 -ml-2.5 rounded-full flex items-center justify-center text-stone-800 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <Menu className="w-5 h-5 stroke-[1.8]" />
          </button>
        </div>

        {/* ============================================================ */}
        {/* VISTA DESKTOP: Logo + Marca + Estado Abierto (Izquierda)     */}
        {/* ============================================================ */}
        <div className="hidden lg:flex items-center gap-3.5 min-w-0 shrink-0">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={businessName || 'Logotipo'}
              width="160"
              height="40"
              className="h-10 w-auto max-w-[170px] object-contain shrink-0"
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                if (target.src.includes('Logo%202.svg') || target.src.includes('Logo 2.svg')) {
                  target.src = '/assets-t1/Logo 2.png';
                } else if (target.src.includes('Logo%202.png') || target.src.includes('Logo 2.png')) {
                  target.src = '/assets-t1/Logo 2.svg';
                } else {
                  target.style.display = 'none';
                }
              }}
            />
          ) : (
            <h1 className="font-semibold text-base sm:text-lg text-stone-900 tracking-tight truncate leading-tight font-sans">
              {businessName || 'Menú Inteligente'}
            </h1>
          )}

          <div className="min-w-0 flex flex-col justify-center">
            {logoUrl && businessName && businessName !== 'Tu Logo' && (
              <h1 className="font-semibold text-sm text-stone-900 tracking-tight truncate leading-tight font-sans">
                {businessName}
              </h1>
            )}
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="relative flex h-2 w-2 shrink-0">
                {localAbierto ? (
                  <>
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </>
                ) : (
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                )}
              </span>
              <span className={`text-[11px] font-bold ${localAbierto ? 'text-emerald-700' : 'text-red-600'}`}>
                {localAbierto ? 'Abierto' : 'Cerrado'}
              </span>
              {horariosAtencion && (
                <span className="text-[11px] text-stone-400 font-normal truncate max-w-[200px]">
                  · {horariosAtencion}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* VISTA MOBILE: Título Centrado con Filigrana o Logo (Bajo el Notch) */}
        {/* ============================================================ */}
        <div className="lg:hidden flex-1 flex flex-col items-center justify-center min-w-0 px-2">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={businessName || 'Logotipo'}
              width="128"
              height="32"
              className="h-8 max-h-8 w-auto max-w-[150px] object-contain"
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                if (target.src.includes('Logo%202.svg') || target.src.includes('Logo 2.svg')) {
                  target.src = '/assets-t1/Logo 2.png';
                } else if (target.src.includes('Logo%202.png') || target.src.includes('Logo 2.png')) {
                  target.src = '/assets-t1/Logo 2.svg';
                } else {
                  target.style.display = 'none';
                }
              }}
            />
          ) : (
            <>
              <h1 className="font-bold text-base sm:text-lg text-stone-900 tracking-tight truncate max-w-[240px] text-center leading-snug font-sans">
                {businessName || 'Our Menu'}
              </h1>
              {/* Filigrana ornamental minimalista idéntica a la referencia */}
              <div className="flex items-center justify-center gap-1.5 mt-0.5 text-[#D9532F]">
                <span className="h-[1px] w-6 bg-current opacity-40" />
                <svg className="w-3.5 h-2 fill-current opacity-70" viewBox="0 0 24 14">
                  <path d="M12 2c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4zm-6 4c0-1.1-.9-2-2-2S2 4.9 2 6s.9 2 2 2 2-.9 2-2zm16 0c0-1.1-.9-2-2-2s-2 .9-2 2 .9 2 2 2 2-.9 2-2z" />
                </svg>
                <span className="h-[1px] w-6 bg-current opacity-40" />
              </div>
            </>
          )}

          {/* Badge de estado del local en Mobile: En estado normal "Abierto" se omite para un header limpio; si está cerrado se indica en rojo */}
          {!localAbierto && (
            <div className="flex items-center gap-1 mt-0.5 select-none">
              <span className="relative flex h-1.5 w-1.5 shrink-0">
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500" />
              </span>
              <span className="text-[10px] font-bold text-red-600">
                Cerrado
              </span>
            </div>
          )}
        </div>

        {/* ============================================================ */}
        {/* VISTA DESKTOP: Buscador Centrado                             */}
        {/* ============================================================ */}
        <div className="hidden lg:flex flex-1 max-w-sm mx-4">
          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="desktop-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar plato o bebida..."
              aria-label="Buscar plato o bebida en la carta"
              className="w-full pl-9 pr-8 py-1.5 rounded-full bg-stone-100/80 hover:bg-stone-100 focus:bg-white border border-stone-200/70 text-stone-900 text-xs outline-none focus:border-[#D9532F] focus:ring-1 focus:ring-[#D9532F]/20 placeholder:text-stone-400 transition-all shadow-2xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 transition cursor-pointer"
                aria-label="Limpiar búsqueda"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* ============================================================ */}
        {/* LADO DERECHO: Ubicación en Desktop / Lupa en Mobile          */}
        {/* ============================================================ */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Ubicación física en Desktop */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-100/70 border border-stone-200/60 text-stone-600 text-xs font-medium">
            <MapPin className="w-3.5 h-3.5 text-[#D9532F] shrink-0" />
            <span className="truncate max-w-[200px]">{address || 'Av. de Mayo 1234 · Salón'}</span>
          </div>

          {/* Botón Lupa Minimalista en Móvil (Estilo Imagen 2) */}
          <button
            type="button"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="lg:hidden w-10 h-10 -mr-2.5 rounded-full flex items-center justify-center text-stone-800 hover:bg-stone-100 transition-colors cursor-pointer"
            aria-label="Buscar plato o bebida"
          >
            <Search className="w-5 h-5 stroke-[1.8]" />
          </button>
        </div>
      </div>

      {/* Input de Búsqueda Móvil Expandible */}
      {isSearchOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="lg:hidden px-4 pb-3 pt-1 border-t border-stone-100 bg-stone-50/70"
        >
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="mobile-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar en el menú..."
              aria-label="Buscar productos en el menú"
              autoFocus
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-white border border-stone-200 text-stone-900 text-xs outline-none focus:border-[#D9532F] focus:ring-1 focus:ring-[#D9532F]/20 placeholder:text-stone-400 transition-colors shadow-2xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 transition cursor-pointer"
                aria-label="Limpiar búsqueda"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </motion.div>
      )}

      {/* Drawer Móvil de Información del Local (Renderizado en Portal con z-[100] sobre toda la app) */}
      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {isInfoDrawerOpen && (
              <div className="fixed inset-0 z-[100] flex" role="dialog" aria-modal="true">
                {/* Backdrop con desenfoque suave que cubre absolutamente todo (incluida la pastilla flotante) */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  onClick={() => setIsInfoDrawerOpen(false)}
                  className="fixed inset-0 bg-black/60 backdrop-blur-xs cursor-pointer z-[101]"
                  aria-label="Cerrar panel de información"
                />

                {/* Drawer Lateral */}
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={{ type: 'spring', damping: 30, stiffness: 350 }}
                  className="relative w-[85%] max-w-xs bg-white h-full shadow-2xl flex flex-col justify-between p-6 z-[102] overflow-y-auto"
                >
                  <div>
                    {/* Encabezado elegante */}
                    <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                      <div>
                        <h2 className="font-bold text-base sm:text-lg text-stone-900 font-sans tracking-tight leading-tight">
                          {businessName || 'Nuestro Local'}
                        </h2>
                        <span className="text-[11px] font-medium text-stone-400 font-sans">
                          Información y Contacto
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsInfoDrawerOpen(false)}
                        className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 hover:text-stone-900 flex items-center justify-center transition-colors cursor-pointer"
                        aria-label="Cerrar información"
                      >
                        <X className="w-4 h-4 stroke-[2.2]" />
                      </button>
                    </div>

                    {/* Lista Limpia Unificada de Información (Sin cajas ni bordes de botones interactivos) */}
                    <div className="divide-y divide-stone-100 py-3 text-xs text-stone-600 font-sans">
                      {/* Estado */}
                      <div className="flex items-center gap-3.5 py-4 first:pt-1">
                        <div className="w-9 h-9 rounded-xl bg-stone-100 flex items-center justify-center text-stone-900 shrink-0">
                          <Store className="w-4.5 h-4.5 text-stone-900 stroke-[2.2]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-[11px] font-semibold text-stone-400 tracking-wider uppercase block">
                            Estado actual
                          </span>
                          <div className="mt-1">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                localAbierto
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/70'
                                  : 'bg-rose-50 text-rose-700 border border-rose-200/70'
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  localAbierto ? 'bg-emerald-600 animate-pulse' : 'bg-rose-600'
                                }`}
                              />
                              {localAbierto ? 'Abierto para pedidos' : 'Cerrado temporalmente'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Horarios */}
                      <div className="flex items-start gap-3.5 py-4">
                        <div className="w-9 h-9 rounded-xl bg-stone-100 flex items-center justify-center text-stone-900 shrink-0 mt-0.5">
                          <Clock className="w-4.5 h-4.5 text-stone-900 stroke-[2.2]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-[11px] font-semibold text-stone-400 tracking-wider uppercase block">
                            Horarios de Atención
                          </span>
                          <p className="text-[13px] text-stone-800 font-medium mt-0.5 leading-snug">
                            {horariosAtencion || 'Martes a Domingo: 19:30 a 00:00 hs'}
                          </p>
                        </div>
                      </div>

                      {/* Dirección */}
                      <div className="flex items-start gap-3.5 py-4">
                        <div className="w-9 h-9 rounded-xl bg-stone-100 flex items-center justify-center text-stone-900 shrink-0 mt-0.5">
                          <MapPin className="w-4.5 h-4.5 text-stone-900 stroke-[2.2]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-[11px] font-semibold text-stone-400 tracking-wider uppercase block">
                            Dirección y Salón
                          </span>
                          <p className="text-[13px] text-stone-800 font-medium mt-0.5 leading-snug">
                            {address || 'Av. de Mayo 1234 · Salón'}
                          </p>
                        </div>
                      </div>

                      {/* WhatsApp */}
                      {whatsapp && (
                        <div className="flex items-start gap-3.5 py-4 last:pb-1">
                          <div className="w-9 h-9 rounded-xl bg-stone-100 flex items-center justify-center text-stone-900 shrink-0 mt-0.5">
                            <Phone className="w-4.5 h-4.5 text-stone-900 stroke-[2.2]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-[11px] font-semibold text-stone-400 tracking-wider uppercase block">
                              WhatsApp de Pedidos
                            </span>
                            <p className="text-[13px] text-stone-800 font-medium mt-0.5 leading-snug tabular-nums">
                              {whatsapp}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Botón de Instalación PWA en Drawer */}
                    <div className="pt-1 pb-3">
                      <button
                        type="button"
                        onClick={() => {
                          setIsInfoDrawerOpen(false);
                          window.dispatchEvent(new CustomEvent('open-pwa-install'));
                        }}
                        className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#FAF1ED] hover:bg-[#F3E2DB] text-[#D9532F] font-bold text-xs border border-[#EADBD5] shadow-2xs transition-colors cursor-pointer"
                      >
                        <Smartphone className="w-4 h-4 stroke-[2.2]" />
                        <span>Instalar Menú en tu Celular</span>
                      </button>
                    </div>
                  </div>

                  {/* Pie del Drawer */}
                  <div className="pt-4 border-t border-stone-100 text-[11px] text-stone-400 text-center font-sans">
                    Carta Digital Inteligente · {businessName || 'Menú'}
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </header>
  );
};

export default Navbar;
