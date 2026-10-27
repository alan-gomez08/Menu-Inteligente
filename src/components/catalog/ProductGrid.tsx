import React, { useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { SearchX, Plus, Minus, UtensilsCrossed } from 'lucide-react';
import type { MenuItem } from '../../types';
import ProductCard from './ProductCard';
import ProductCardCompact from './ProductCardCompact';
import ProductCardBeverage from './ProductCardBeverage';
import { MenuSkeleton } from '../ProductCardSkeleton';
import { normalizeImageUrl } from '../../utils/formatters';
import { getBadgeConfig } from '../../utils/badges';

interface ProductGridProps {
  items: MenuItem[];
  categories: string[];
  activeCategory: string;
  onActiveCategoryChange: (category: string) => void;
  cart: any[];
  onAddToCart: (item: MenuItem) => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  isLoading?: boolean;
  searchQuery?: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  items,
  categories,
  activeCategory,
  onActiveCategoryChange,
  cart,
  onAddToCart,
  onUpdateQuantity,
  isLoading = false,
  searchQuery = '',
}) => {
  const isUserScrollingRef = useRef(false);

  // Filtrado por buscador
  const filteredItems = useMemo(() => {
    if (!searchQuery || !searchQuery.trim()) return items;
    const q = searchQuery.toLowerCase().trim();
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        (item.description && item.description.toLowerCase().includes(q)) ||
        (item.category && item.category.toLowerCase().includes(q))
    );
  }, [items, searchQuery]);

  // Agrupar items por categoría
  const itemsByCategory = useMemo(() => {
    const map: Record<string, MenuItem[]> = {};
    for (const cat of categories) {
      map[cat] = [];
    }
    for (const item of filteredItems) {
      const cat = item.category || categories[0] || 'General';
      if (!map[cat]) map[cat] = [];
      map[cat].push(item);
    }
    return map;
  }, [filteredItems, categories]);

  const activeCategoryRef = useRef(activeCategory);
  useEffect(() => {
    activeCategoryRef.current = activeCategory;
  }, [activeCategory]);

  // Scrollspy optimizado con IntersectionObserver
  useEffect(() => {
    if (categories.length === 0 || searchQuery.trim().length > 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (isUserScrollingRef.current) return;

        // Filtrar solo las secciones que están visibles en la zona de lectura
        const intersecting = entries.filter((e) => e.isIntersecting);
        if (intersecting.length === 0) return;

        // Ordenar por proximidad a la línea del encabezado (aprox. 110px por sticky header)
        intersecting.sort((a, b) => {
          return Math.abs(a.boundingClientRect.top - 110) - Math.abs(b.boundingClientRect.top - 110);
        });

        const bestEntry = intersecting[0];
        const catName = bestEntry.target.getAttribute('data-category');
        if (catName && catName !== activeCategoryRef.current) {
          activeCategoryRef.current = catName;
          onActiveCategoryChange(catName);
        }
      },
      {
        rootMargin: '-100px 0px -65% 0px',
        threshold: 0,
      }
    );

    const sectionElements = document.querySelectorAll('[data-category]');
    sectionElements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, [categories, onActiveCategoryChange, searchQuery]);

  // Detección de tipos de categoría
  const isFeaturedCategory = (catName: string) => {
    const lower = catName.toLowerCase();
    return lower.includes('destacad') || lower.includes('promo') || lower.includes('combo');
  };

  const isBeverageOrSidesCategory = (catName: string) => {
    if (!catName) return false;
    const lower = catName.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return (
      lower === 'bebidas' ||
      lower === 'bebida' ||
      lower.includes('bebid') ||
      lower.includes('drink') ||
      lower.includes('gaseos') ||
      lower.includes('refresc') ||
      lower.includes('cervez') ||
      lower.includes('trago') ||
      lower.includes('cafet') ||
      lower.includes('cafe') ||
      lower.includes('extra') ||
      lower.includes('adicional') ||
      lower.includes('acompan') ||
      lower.includes('postre') ||
      lower.includes('guarnic') ||
      lower.includes('salsa') ||
      lower.includes('side') ||
      lower.includes('agua')
    );
  };

  if (isLoading && items.length === 0) {
    return <MenuSkeleton />;
  }

  if (filteredItems.length === 0) {
    return (
      <div className="w-full py-24 text-center px-4">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white border border-stone-200/80 flex items-center justify-center text-stone-400 shadow-sm">
          <SearchX className="w-8 h-8 text-stone-400" />
        </div>
        <h3 className="text-lg font-bold text-stone-900 mb-1.5">
          {searchQuery ? `No encontramos "${searchQuery}"` : 'No hay productos disponibles'}
        </h3>
        <p className="text-xs text-stone-500 max-w-sm mx-auto leading-relaxed">
          {searchQuery
            ? 'Probá buscando con otro término o limpiá el buscador para ver toda la carta.'
            : 'En este momento no se encontraron artículos cargados en la carta digital.'}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-10 sm:space-y-12 lg:space-y-14 pb-32">
      {categories.map((category) => {
        const categoryItems = itemsByCategory[category] || [];
        if (categoryItems.length === 0) return null;

        const categorySlug = encodeURIComponent(category.toLowerCase().replace(/\s+/g, '-'));
        const isFeatured = isFeaturedCategory(category);
        const isBeverage = !isFeatured && (
          isBeverageOrSidesCategory(category) ||
          (categoryItems.length > 0 && categoryItems.every((i) => isBeverageOrSidesCategory(i.category || '')))
        );

        return (
          <section
            key={category}
            id={`cat-${categorySlug}`}
            data-category={category}
            className="w-full scroll-mt-28"
          >
            {/* Encabezado de la categoría bien pegado a sus cards correspondientes */}
            <div className="flex items-center justify-between mb-2.5 sm:mb-3">
              <h2 className="text-lg sm:text-xl md:text-2xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2 font-sans">
                <span>{category}</span>
                <span className="text-xs text-slate-500 font-bold bg-slate-200/70 px-2 py-0.5 rounded-full tabular-nums">
                  {categoryItems.length}
                </span>
              </h2>
            </div>

            {/* 1. SECCIÓN DESTACADOS:
                - Mobile: Carrusel horizontal deslizable (swipeable) de alto impacto visual con fotos grandes.
                - Desktop: Grilla de 3 columnas amplias (ProductCard).
            */}
            {isFeatured ? (
              <>
                {/* Mobile (< 1024px): Carrusel Horizontal Swipeable de Alto Impacto */}
                <div className="lg:hidden -mx-5 sm:-mx-6 px-5 sm:px-6 overflow-x-auto scrollbar-none snap-x snap-mandatory pb-3 pt-1 overscroll-x-contain flex gap-3.5">
                  {categoryItems.map((item) => {
                    const cartItem = cart.find((c) => c.id === item.id);
                    const quantity = cartItem ? cartItem.quantity : 0;
                    const badgeConfig = getBadgeConfig(item.badge);
                    const isSoldOut = Boolean(item.isSoldOut || item.badge?.toLowerCase().includes('agotado'));

                    return (
                      <article
                        key={item.id}
                        className="w-[230px] sm:w-[250px] shrink-0 snap-start bg-white rounded-2xl border border-stone-200/80 p-3 shadow-xs flex flex-col justify-between select-none relative group"
                      >
                        {/* Foto Grande Hero en Contenedor Estructurado (#F1F3F5) */}
                        <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-[#F1F3F5] border border-stone-200/70 p-2 flex items-center justify-center mb-2.5 shadow-inner/5">
                          {item.imagePath ? (
                            <>
                              <img
                                src={normalizeImageUrl(item.imagePath)}
                                alt={item.title}
                                loading="lazy"
                                onError={(e) => {
                                  const target = e.currentTarget as HTMLImageElement;
                                  target.style.display = 'none';
                                  const fallback = target.parentElement?.querySelector('.placeholder-fallback');
                                  if (fallback) fallback.classList.remove('hidden');
                                }}
                                className={`w-full h-full object-contain drop-shadow-sm group-hover:scale-105 transition-transform duration-300 ease-out ${
                                  isSoldOut ? 'grayscale opacity-50' : ''
                                }`}
                              />
                              <div className="placeholder-fallback hidden w-full h-full flex flex-col items-center justify-center text-stone-400 gap-1 p-2">
                                <UtensilsCrossed className="w-6 h-6 text-stone-400" />
                              </div>
                            </>
                          ) : (
                            <div className="flex flex-col items-center justify-center text-stone-400 gap-1 p-2">
                              <UtensilsCrossed className="w-6 h-6 text-stone-400" />
                            </div>
                          )}

                          {/* Badge Flotante en la foto */}
                          {badgeConfig && !isSoldOut && (
                            <span
                              className={`absolute top-2 left-2 text-[9px] tracking-wide uppercase px-2 py-0.5 rounded-full font-bold shadow-2xs ${badgeConfig.className}`}
                            >
                              {badgeConfig.text}
                            </span>
                          )}

                          {isSoldOut && (
                            <div className="absolute inset-0 bg-white/75 backdrop-blur-[1px] flex items-center justify-center">
                              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-stone-100 text-stone-500 border border-stone-200">
                                Agotado
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Información del Plato */}
                        <div className="flex-1 min-w-0 pb-2">
                          <h4 className="font-bold text-[15px] text-stone-900 group-hover:text-[#D9532F] transition-colors line-clamp-1 tracking-tight leading-snug">
                            {item.title}
                          </h4>
                          {item.description && (
                            <p className="text-xs text-stone-500 line-clamp-2 mt-1 leading-relaxed">
                              {item.description}
                            </p>
                          )}
                        </div>

                        {/* Fila Inferior: Precio y Botón (+) / Stepper */}
                        <div className="flex items-center justify-between pt-2 border-t border-stone-100 mt-auto">
                          <span className="text-base sm:text-[17px] font-bold tabular-nums text-[#D9532F] tracking-tight">
                            {item.price}
                          </span>

                          {!isSoldOut && (
                            <div>
                              {quantity === 0 ? (
                                <motion.button
                                  type="button"
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => onAddToCart(item)}
                                  aria-label={`Agregar ${item.title}`}
                                  className="w-8 h-8 rounded-full bg-[#FAF1ED] text-[#D9532F] border border-[#EADBD5] shadow-xs flex items-center justify-center font-bold hover:bg-[#D9532F] hover:text-white active:scale-90 transition-all cursor-pointer"
                                >
                                  <Plus className="w-4 h-4 stroke-[2.5]" />
                                </motion.button>
                              ) : (
                                <div className="flex items-center gap-1 bg-[#FAF1ED] border border-[#EADBD5] rounded-full p-0.5 shadow-xs">
                                  <motion.button
                                    type="button"
                                    whileTap={{ scale: 0.85 }}
                                    onClick={() => onUpdateQuantity(item.id, -1)}
                                    className="w-6 h-6 flex items-center justify-center rounded-full bg-white text-[#D9532F] text-xs font-bold shadow-2xs hover:bg-stone-50 cursor-pointer"
                                    aria-label="Restar una unidad"
                                  >
                                    <Minus className="w-3 h-3 stroke-[2.5]" />
                                  </motion.button>
                                  <span className="text-xs font-bold text-stone-900 tabular-nums px-1.5 min-w-[14px] text-center">
                                    {quantity}
                                  </span>
                                  <motion.button
                                    type="button"
                                    whileTap={{ scale: 0.85 }}
                                    onClick={() => onUpdateQuantity(item.id, 1)}
                                    className="w-6 h-6 flex items-center justify-center rounded-full bg-[#D9532F] text-white text-xs font-bold shadow-2xs hover:bg-[#BF4321] cursor-pointer"
                                    aria-label="Sumar una unidad"
                                  >
                                    <Plus className="w-3 h-3 stroke-[2.5]" />
                                  </motion.button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </article>
                    );
                  })}
                  {/* Espaciador de cierre para padding lateral final en Safari */}
                  <div className="shrink-0 w-1" aria-hidden="true" />
                </div>

                {/* Desktop (>= 1024px): Grilla amplia de 3 columnas bien distribuidas */}
                <div className="hidden lg:grid lg:grid-cols-3 gap-5 w-full">
                  {categoryItems.map((item) => {
                    const cartItem = cart.find((c) => c.id === item.id);
                    const quantity = cartItem ? cartItem.quantity : 0;

                    return (
                      <ProductCard
                        key={item.id}
                        item={item}
                        quantity={quantity}
                        onAdd={onAddToCart}
                        onUpdateQuantity={onUpdateQuantity}
                      />
                    );
                  })}
                </div>
              </>
            ) : isBeverage ? (
              <>
                {/* Mobile (< 1024px): Fila compacta horizontal */}
                <div className="w-full grid grid-cols-1 gap-3 lg:hidden">
                  {categoryItems.map((item) => {
                    const cartItem = cart.find((c) => c.id === item.id);
                    const quantity = cartItem ? cartItem.quantity : 0;

                    return (
                      <ProductCardCompact
                        key={item.id}
                        item={item}
                        quantity={quantity}
                        onAdd={onAddToCart}
                        onUpdateQuantity={onUpdateQuantity}
                      />
                    );
                  })}
                </div>

                {/* Desktop (>= 1024px): Grilla compacta horizontal de 2 o 3 columnas que aprovecha el espacio */}
                <div className="hidden lg:grid lg:grid-cols-2 2xl:grid-cols-3 gap-3.5 w-full">
                  {categoryItems.map((item) => {
                    const cartItem = cart.find((c) => c.id === item.id);
                    const quantity = cartItem ? cartItem.quantity : 0;

                    return (
                      <ProductCardBeverage
                        key={item.id}
                        item={item}
                        quantity={quantity}
                        onAdd={onAddToCart}
                        onUpdateQuantity={onUpdateQuantity}
                      />
                    );
                  })}
                </div>
              </>
            ) : (
              <>
                {/* Mobile (< 1024px): Fila compacta horizontal con botón táctil al alcance del pulgar */}
                <div className="w-full grid grid-cols-1 gap-3 lg:hidden">
                  {categoryItems.map((item) => {
                    const cartItem = cart.find((c) => c.id === item.id);
                    const quantity = cartItem ? cartItem.quantity : 0;

                    return (
                      <ProductCardCompact
                        key={item.id}
                        item={item}
                        quantity={quantity}
                        onAdd={onAddToCart}
                        onUpdateQuantity={onUpdateQuantity}
                      />
                    );
                  })}
                </div>

                {/* Desktop (>= 1024px): Grilla amplia y descansada de 3 columnas bien distribuidas */}
                <div className="hidden lg:grid lg:grid-cols-3 gap-5 w-full">
                  {categoryItems.map((item) => {
                    const cartItem = cart.find((c) => c.id === item.id);
                    const quantity = cartItem ? cartItem.quantity : 0;

                    if (isBeverageOrSidesCategory(item.category || '')) {
                      return (
                        <ProductCardBeverage
                          key={item.id}
                          item={item}
                          quantity={quantity}
                          onAdd={onAddToCart}
                          onUpdateQuantity={onUpdateQuantity}
                        />
                      );
                    }

                    return (
                      <ProductCard
                        key={item.id}
                        item={item}
                        quantity={quantity}
                        onAdd={onAddToCart}
                        onUpdateQuantity={onUpdateQuantity}
                      />
                    );
                  })}
                </div>
              </>
            )}
          </section>
        );
      })}
    </div>
  );
};

export default ProductGrid;
