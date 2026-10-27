import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface CategoryNavProps {
  categories: string[];
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  accentColor?: string;
  topOffsetClass?: string;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({
  categories,
  activeCategory,
  onSelectCategory,
  accentColor = '#F59E0B',
  topOffsetClass = 'top-16 sm:top-20',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (activeTabRef.current && containerRef.current) {
      const container = containerRef.current;
      const tab = activeTabRef.current;
      const containerWidth = container.clientWidth;
      const tabLeft = tab.offsetLeft;
      const tabWidth = tab.clientWidth;

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
      className={`sticky ${topOffsetClass} z-30 w-full bg-black/60 backdrop-blur-md border-b border-white/10 py-3 transition-all select-none`}
    >
      <div
        ref={containerRef}
        className="w-full max-w-4xl mx-auto px-5 sm:px-6 flex items-center gap-2.5 overflow-x-auto scrollbar-none snap-x snap-mandatory hide-scrollbar"
      >
        {categories.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <motion.button
              key={cat}
              ref={isActive ? activeTabRef : null}
              type="button"
              onClick={() => onSelectCategory(cat)}
              whileTap={{ scale: 0.95 }}
              className={`relative shrink-0 snap-start px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                isActive ? 'text-black shadow-md' : 'text-neutral-400 hover:text-white bg-white/[0.03] hover:bg-white/[0.06] border border-white/5'
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="activeCategoryPill"
                  className="absolute inset-0 rounded-full z-[-1] shadow-lg shadow-black/30"
                  style={{ backgroundColor: accentColor }}
                  transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                />
              )}
              <span>{cat}</span>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
};

export default CategoryNav;
