import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface CategoryNavProps {
  categories: string[];
  activeCategory: string;
  onSelectCategory: (category: string) => void;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({
  categories,
  activeCategory,
  onSelectCategory,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (activeTabRef.current && containerRef.current) {
      const container = containerRef.current;
      const tab = activeTabRef.current;

      // Si es la primera categoría (ej. "Destacados"), anclarla perfectamente a la línea de margen izquierda (0)
      if (tab === container.firstElementChild) {
        container.scrollTo({
          left: 0,
          behavior: 'smooth',
        });
        return;
      }

      const containerWidth = container.clientWidth;
      const tabLeft = tab.offsetLeft;
      const tabWidth = tab.clientWidth;

      // Centrar la pastilla activa suavemente dentro del contenedor horizontal delimitado
      container.scrollTo({
        left: tabLeft - containerWidth / 2 + tabWidth / 2,
        behavior: 'smooth',
      });
    }
  }, [activeCategory]);

  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <nav
      aria-label="Categorías del menú"
      className="relative w-full bg-white select-none py-2 sm:py-2.5 transition-all"
    >
      {/* Marco delimitado estrictamente por los mismos márgenes (px-5 sm:px-6 lg:px-6) de las cards de productos */}
      <div className="max-w-[1320px] mx-auto px-5 sm:px-6 lg:px-6">
        <div className="relative">
          {/* Scroll horizontal estrictamente confinado dentro del ancho útil de las tarjetas de productos */}
          <div
            ref={containerRef}
            className="relative flex items-center gap-2 sm:gap-2.5 overflow-x-auto scrollbar-none hide-scrollbar scroll-smooth overscroll-x-contain"
          >
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  ref={isActive ? activeTabRef : null}
                  type="button"
                  onClick={() => onSelectCategory(cat)}
                  className={`relative isolate shrink-0 px-4 sm:px-4.5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-[13px] font-semibold tracking-tight transition-all cursor-pointer whitespace-nowrap font-sans ${
                    isActive
                      ? 'text-white bg-[#D9532F] shadow-xs'
                      : 'text-stone-600 hover:text-stone-900 bg-stone-100/90 hover:bg-stone-200/80 border border-stone-200/60'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="activeCategoryPill"
                      className="absolute inset-0 rounded-xl bg-[#D9532F] -z-10 shadow-xs"
                      transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                    />
                  )}
                  <span className="relative z-10">{cat}</span>
                </button>
              );
            })}
            {/* Espaciador final para permitir scroll completo de la última pastilla */}
            <div className="shrink-0 w-3 lg:hidden" aria-hidden="true" />
          </div>

          {/* Gradiente sutil indicador de scroll confinado dentro del límite derecho */}
          <div
            className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-white via-white/80 to-transparent pointer-events-none lg:hidden"
            aria-hidden="true"
          />
        </div>
      </div>
    </nav>
  );
};

export default CategoryNav;
