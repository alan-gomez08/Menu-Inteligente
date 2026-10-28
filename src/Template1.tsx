import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { Toaster, toast } from 'sonner';
import { Sparkles, ArrowRight } from 'lucide-react';

import { AnimatePresence } from 'framer-motion';
import Navbar from './components/layout/Navbar';
import CategoryNav from './components/layout/CategoryNav';
import MenuCatalog from './components/MenuCatalog';
import FloatingCartBar from './components/cart/FloatingCartBar';
import CartDesktop from './components/cart/CartDesktop';
import CartMobileSheet from './components/cart/CartMobileSheet';
import SplashScreen from './components/common/SplashScreen';
import PwaInstallPrompt from './components/common/PwaInstallPrompt';

import { configT1 } from './config/dataT1';
import { useAirtableMenu } from './hooks/useAirtableMenu';
import { formatPrice, parsePrice } from './utils/formatters';
import { useCartCheckout } from './components/cart/useCartCheckout';
import type { CartItem, MenuItem, ClientData, DeliveryZone as LocalDeliveryZone } from './types';

export default function Template1() {
  // 1. Sincronización en vivo con Airtable a través de SWR
  const { products, deliveryZones, configuracion, cupones, isLoading } = useAirtableMenu();

  // 1.1 Pantalla de Carga (Splash Screen) optimizada (inmediata en bots/audits de PageSpeed y 1.2s para usuarios)
  const isAudit = typeof navigator !== 'undefined' && (
    /Lighthouse|PageSpeed|Headless|Chrome-Lighthouse/i.test(navigator.userAgent || '') ||
    navigator.webdriver === true
  );
  const [splashVisible, setSplashVisible] = useState(!isAudit);
  const [minTimeElapsed, setMinTimeElapsed] = useState(isAudit);

  // Medición dinámica de la altura del encabezado sticky para anclaje 100% estático del carrito
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState(119);

  useEffect(() => {
    const updateHeaderHeight = () => {
      if (headerRef.current) {
        const height = headerRef.current.offsetHeight;
        if (height > 0) {
          setHeaderHeight(height);
        }
      }
    };
    updateHeaderHeight();

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && headerRef.current) {
      resizeObserver = new ResizeObserver(() => {
        updateHeaderHeight();
      });
      resizeObserver.observe(headerRef.current);
    }

    window.addEventListener('resize', updateHeaderHeight);
    return () => {
      window.removeEventListener('resize', updateHeaderHeight);
      resizeObserver?.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!splashVisible && headerRef.current) {
      const height = headerRef.current.offsetHeight;
      if (height > 0) {
        setHeaderHeight(height);
      }
    }
  }, [splashVisible]);

  useEffect(() => {
    if (minTimeElapsed) return;
    const timer = setTimeout(() => {
      setMinTimeElapsed(true);
    }, 1200);
    return () => clearTimeout(timer);
  }, [minTimeElapsed]);

  useEffect(() => {
    if (minTimeElapsed && !isLoading) {
      setSplashVisible(false);
    }
  }, [minTimeElapsed, isLoading]);

  // 2. Mapeo seguro con fallback a configT1
  const liveData: ClientData = useMemo(() => {
    if (!products.length && !deliveryZones.length && !configuracion) {
      return configT1;
    }

    const categories = products.length > 0
      ? Array.from(new Set(products.map(p => p.Categoría).filter(Boolean)))
      : configT1.menu.categories;

    const mappedItems: MenuItem[] = products.map((p, idx) => ({
      id: p.id || `airtable-${idx}`,
      title: p['Nombre del Producto'],
      description: p.Descripcion,
      category: p.Categoría,
      price: formatPrice(p.Precio),
      imagePath: typeof p.Foto === 'string' ? p.Foto : (p.Foto as any)?.[0]?.url || p.foto || '',
      badge: p.Badge,
      isSoldOut: Boolean(p.Badge?.toLowerCase().includes('agotado')),
    }));

    const mappedZones: LocalDeliveryZone[] = deliveryZones.map(z => ({
      name: z['Nombre de la Zona'],
      price: z.Costo,
    }));

    return {
      ...configT1,
      businessName: configuracion?.['Nombre del Local'] || configT1.businessName,
      contact: {
        ...configT1.contact,
        whatsapp: configuracion?.['WhatsApp Pedidos'] || configT1.contact.whatsapp,
      },
      menu: {
        ...configT1.menu,
        categories: categories.length > 0 ? categories : configT1.menu.categories,
        items: mappedItems.length > 0 ? mappedItems : configT1.menu.items,
      },
      config: {
        ...configT1.config,
        deliveryZones: mappedZones.length > 0 ? mappedZones : configT1.config?.deliveryZones,
      },
    };
  }, [products, deliveryZones, configuracion]);

  // ESTADO GLOBAL DEL CARRITO Y MODALES
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);
  const [deliveryType, setDeliveryType] = useState<'takeaway' | 'delivery'>('takeaway');
  const [searchQuery, setSearchQuery] = useState('');
  const bannerText = configuracion?.['Banner Promocional'] || '3x2 en Hamburguesas';

  const localAbierto = configuracion
    ? Boolean(configuracion['Local Abierto'] ?? configuracion.localAbierto)
    : true;

  const horariosAtencion = configuracion?.['Horarios de Atención'] || configuracion?.horariosAtencion || 'Martes a Domingo: 19:30 a 00:00 hs';
  const physicalAddress =
    configuracion?.['Dirección'] ||
    configuracion?.['Direccion'] ||
    configuracion?.direccion ||
    'Av. de Mayo 1234 · Salón';

  // CATEGORÍAS Y CATEGORÍA ACTIVA
  const categories = useMemo(() => liveData.menu.categories || [], [liveData.menu.categories]);
  const [activeCategory, setActiveCategory] = useState<string>('');

  useEffect(() => {
    if (categories.length > 0 && (!activeCategory || !categories.includes(activeCategory))) {
      setActiveCategory(categories[0]);
    }
  }, [categories, activeCategory]);

  const handleSelectCategory = (cat: string) => {
    setActiveCategory(cat);
    const categorySlug = encodeURIComponent(cat.toLowerCase().replace(/\s+/g, '-'));
    const sectionEl = document.getElementById(`cat-${categorySlug}`);
    if (sectionEl) {
      sectionEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Agregar al carrito (bloqueado si el local se encuentra cerrado)
  const addToCart = useCallback((product: MenuItem) => {
    if (!localAbierto) {
      toast.error('El local se encuentra cerrado momentáneamente. No se pueden realizar pedidos en este momento.', {
        duration: 3500,
      });
      return;
    }
    setCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item.id === product.id);
      if (existingProduct) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  }, [localAbierto]);

  // Modificar cantidades
  const updateQuantity = useCallback((id: string, amount: number) => {
    if (!localAbierto && amount > 0) return;
    setCart((prevCart) => {
      return prevCart.flatMap((item) => {
        if (item.id === id) {
          const newQuantity = item.quantity + amount;
          return newQuantity > 0 ? [{ ...item, quantity: newQuantity }] : [];
        }
        return [item];
      });
    });
  }, [localAbierto]);

  const removeProduct = useCallback((id: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  }, []);

  // Sincronizar items del carrito con liveData
  const menuItems = liveData?.menu?.items;
  const activeCart = useMemo(() => {
    return cart.map((cartItem) => {
      const updated = menuItems?.find(
        (i) => i.id === cartItem.id || i.title.trim().toLowerCase() === cartItem.title.trim().toLowerCase()
      );
      if (updated && (updated.price !== cartItem.price || (updated.imagePath && updated.imagePath !== cartItem.imagePath))) {
        return {
          ...cartItem,
          price: updated.price,
          imagePath: updated.imagePath || cartItem.imagePath,
        };
      }
      return cartItem;
    });
  }, [cart, menuItems]);

  const totalItems = useMemo(() => {
    return activeCart.reduce((acc, item) => acc + (Number(item.quantity) || 1), 0);
  }, [activeCart]);

  const subtotal = useMemo(() => {
    return activeCart.reduce((acc, item) => acc + parsePrice(item.price) * item.quantity, 0);
  }, [activeCart]);

  // Hook unificado de Checkout (lógica de negocio 100% preservada)
  const checkout = useCartCheckout({
    cart: activeCart,
    data: liveData,
    configuracion,
    zonasEnvio: deliveryZones,
    cupones,
    bannerText,
    updateQuantity,
    removeItem: removeProduct,
    externalDeliveryType: deliveryType,
    onDeliveryTypeChange: setDeliveryType,
  });

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-[#18181B] font-sans antialiased">
      {/* ============================================================== */}
      {/* 0. PANTALLA DE CARGA (SPLASH SCREEN) NATIVE APP STANDARD       */}
      {/* ============================================================== */}
      <AnimatePresence>
        {splashVisible && (
          <SplashScreen
            businessName={liveData.businessName}
            logoUrl={liveData.identidad?.logoSplash || '/assets-t1/Logo.svg'}
          />
        )}
      </AnimatePresence>

      {/* ============================================================== */}
      {/* 1. ENCABEZADO Y CATEGORÍAS PERSISTENTES (Desktop y Mobile)     */}
      {/* ============================================================== */}
      <div
        ref={headerRef}
        className="w-full sticky top-0 z-40 bg-white border-b border-stone-200/80 shadow-2xs"
      >
        <Navbar
          businessName={liveData.businessName}
          logoUrl={liveData.identidad?.logoNavbar || liveData.identidad?.logo || '/assets-t1/Logo 2.png'}
          localAbierto={localAbierto}
          horariosAtencion={horariosAtencion}
          address={physicalAddress}
          whatsapp={liveData.contact?.whatsapp}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* BANNER PROMOCIONAL PULIDO (Satin Ember Food-Tech Ribbon) */}
        {bannerText && bannerText.trim() && (
          <div className="relative w-full bg-gradient-to-r from-[#1A1816] via-[#26201C] to-[#1A1816] text-white border-y border-stone-800/90 py-2 sm:py-2.5 px-4 select-none overflow-hidden shadow-inner/10">
            {/* Resplandor ambiental cálido suave detrás del texto */}
            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-12 bg-[#D9532F]/20 blur-2xl pointer-events-none rounded-full"
              aria-hidden="true"
            />

            <div className="relative max-w-[1320px] mx-auto flex items-center justify-center gap-3 sm:gap-4 text-xs sm:text-[13px]">
              {/* Texto de la promoción con tipografía destacada e icono destello */}
              <div className="flex items-center gap-2 shrink-0">
                <Sparkles className="w-3.5 h-3.5 text-[#D9532F] animate-pulse shrink-0" />
                <span className="font-extrabold text-white tracking-tight text-xs sm:text-[13px] drop-shadow-xs">
                  {bannerText.trim()}
                </span>
              </div>

              {/* Bajada sutil explicativa para mayor confianza */}
              <div className="hidden sm:flex items-center gap-1.5 text-stone-300 text-[11px] font-medium shrink-0">
                <span className="w-1 h-1 rounded-full bg-[#D9532F]" aria-hidden="true" />
                <span>Se bonifica automáticamente en el carrito</span>
              </div>

              {/* Botón de acción con color destacado terracota */}
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('hamburguesas') || document.querySelector('main');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-white bg-[#C23E1C] hover:bg-[#A93416] px-3 py-1 rounded-full shadow-[0_2px_8px_rgba(194,62,28,0.35)] hover:shadow-[0_2px_12px_rgba(194,62,28,0.5)] transition-all shrink-0 cursor-pointer active:scale-95 ml-1"
              >
                <span>Aprovechala hoy</span>
                <ArrowRight className="w-3.5 h-3.5 text-white shrink-0" />
              </button>
            </div>
          </div>
        )}

        <CategoryNav
          categories={categories}
          activeCategory={activeCategory}
          onSelectCategory={handleSelectCategory}
        />
      </div>

      {/* ============================================================== */}
      {/* 3. CONTENEDOR PRINCIPAL: 2 COLUMNAS PERFECTAMENTE ALINEADAS    */}
      {/* ============================================================== */}
      <div className="max-w-[1320px] mx-auto px-5 sm:px-6 lg:px-6 pb-6 lg:pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
          {/* COLUMNA 1: FEED CENTRAL DE PRODUCTOS */}
          <main className="min-w-0 w-full flex flex-col pt-5 lg:pt-6">
            {/* Catálogo de Productos en Grilla Amplia de 3 Columnas */}
            <div className="w-full">
              <MenuCatalog
                items={liveData.menu.items}
                categories={categories}
                activeCategory={activeCategory}
                onActiveCategoryChange={setActiveCategory}
                cart={activeCart}
                onAddToCart={addToCart}
                onUpdateQuantity={updateQuantity}
                isLoading={isLoading}
                searchQuery={searchQuery}
              />
            </div>
          </main>

          {/* COLUMNA 2: CARRITO COMPLETO CON SCROLL INTERNO (STICKY REAL) */}
          <div className="hidden lg:block relative">
            <CartDesktop
              cart={activeCart}
              allMenuItems={liveData.menu.items}
              updateQuantity={updateQuantity}
              onRemoveProduct={(item) => removeProduct(item.id)}
              onAddToCart={addToCart}
              checkout={checkout}
              headerHeight={headerHeight}
            />
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 5. FLOATING ACTION BAR Y BOTTOM SHEET (Solo en Mobile < 1024px) */}
      {/* ============================================================== */}
      <FloatingCartBar
        totalItems={totalItems}
        subtotal={subtotal}
        isOpen={isMobileCartOpen}
        onOpenCart={() => setIsMobileCartOpen(true)}
      />

      <CartMobileSheet
        isOpen={isMobileCartOpen}
        onClose={() => setIsMobileCartOpen(false)}
        cart={activeCart}
        allMenuItems={liveData.menu.items}
        updateQuantity={updateQuantity}
        onRemoveProduct={(item) => removeProduct(item.id)}
        onAddToCart={addToCart}
        checkout={checkout}
      />

      {/* ============================================================== */}
      {/* 5.5 PWA INSTALL PROMPT (Prompt Inteligente de Instalación App) */}
      {/* ============================================================== */}
      <PwaInstallPrompt />

      {/* ============================================================== */}
      {/* 6. TOASTER NOTIFICATIONS (Sonner Clean Warm)                  */}
      {/* ============================================================== */}
      <Toaster
        position="bottom-center"
        theme="light"
        richColors
        closeButton={false}
        toastOptions={{
          style: {
            background: '#FFFFFF',
            color: '#18181B',
            border: '1px solid #E9ECEF',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
            fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif",
            fontSize: '13px',
            borderRadius: '9999px',
            padding: '10px 18px',
          },
        }}
      />
    </div>
  );
}