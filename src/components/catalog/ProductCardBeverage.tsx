import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UtensilsCrossed, Plus, Minus } from 'lucide-react';
import type { MenuItem } from '../../types';
import { normalizeImageUrl } from '../../utils/formatters';
import { getBadgeConfig } from '../../utils/badges';

interface ProductCardBeverageProps {
  item: MenuItem;
  quantity?: number;
  onAdd: (item: MenuItem) => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  isEcommerce?: boolean;
}

export const ProductCardBeverage: React.FC<ProductCardBeverageProps> = ({
  item,
  quantity = 0,
  onAdd,
  onUpdateQuantity,
  isEcommerce = true,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const isSoldOut = Boolean(item.isSoldOut || item.badge?.toLowerCase().includes('agotado'));

  return (
    <article className="w-full bg-white rounded-2xl p-3 sm:p-3.5 border border-stone-200/70 shadow-xs hover:shadow-md hover:border-stone-300 flex items-center justify-between gap-3.5 transition-all duration-200 group select-none">
      {/* 1. Fotografía cuadrada de 80x80px a la izquierda con fondo neutro estructurado (#F1F3F5) */}
      <div className="relative w-20 h-20 min-w-[80px] rounded-2xl bg-[#F1F3F5] border border-stone-200/80 p-1.5 flex items-center justify-center overflow-hidden shrink-0 shadow-inner/5">
        {!imageLoaded && !imageError && item.imagePath && (
          <div className="absolute inset-0 animate-shimmer" />
        )}

        {item.imagePath && !imageError ? (
          <img
            src={normalizeImageUrl(item.imagePath)}
            alt={item.title}
            width="80"
            height="80"
            loading="lazy"
            decoding="async"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            className={`w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 ease-out ${
              isSoldOut ? 'grayscale opacity-50' : ''
            }`}
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-stone-400 gap-1 text-center">
            <UtensilsCrossed className="w-5 h-5 text-stone-400" />
          </div>
        )}

        {isSoldOut && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] flex items-center justify-center">
            <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-stone-100 text-stone-500 border border-stone-200">
              Agotado
            </span>
          </div>
        )}
      </div>

      {/* 2. Textos centrales: Nombre, descripción y precio */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-sm text-stone-900 group-hover:text-[#D9532F] transition-colors truncate tracking-tight leading-snug">
            {item.title}
          </h3>
          {(() => {
            const badgeConfig = getBadgeConfig(item.badge);
            if (!badgeConfig || isSoldOut) return null;
            return (
              <span
                className={`text-[9px] tracking-wide uppercase px-2 py-0.5 rounded-full shrink-0 font-semibold ${badgeConfig.className}`}
              >
                {badgeConfig.text}
              </span>
            );
          })()}
        </div>
        {item.description && (
          <p className="text-xs text-stone-500 line-clamp-1 mt-0.5">
            {item.description}
          </p>
        )}
        <span className="block text-sm font-bold tabular-nums text-[#C23E1C] mt-1 tracking-tight">
          {item.price}
        </span>
      </div>

      {/* 3. Botón de Agregar / Stepper a la derecha */}
      {isEcommerce && !isSoldOut && (
        <div className="shrink-0">
          {quantity === 0 ? (
            <motion.button
              type="button"
              whileTap={{ scale: 0.9 }}
              onClick={() => onAdd(item)}
              aria-label={`Agregar ${item.title}`}
              className="w-8 h-8 rounded-full bg-[#FAF1ED] hover:bg-[#D9532F] hover:text-white text-[#D9532F] border border-[#EADBD5] shadow-2xs flex items-center justify-center text-sm font-bold active:scale-90 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
            </motion.button>
          ) : (
            <div className="flex items-center gap-1.5 bg-[#FAF1ED] border border-[#EADBD5] rounded-full px-1.5 py-0.5 shadow-2xs box-border">
              <motion.button
                type="button"
                whileTap={{ scale: 0.85 }}
                onClick={() => onUpdateQuantity(item.id, -1)}
                className="w-6 h-6 flex items-center justify-center rounded-full bg-white text-[#D9532F] text-xs font-bold hover:bg-stone-50 transition-colors cursor-pointer shadow-2xs"
                aria-label="Restar una unidad"
              >
                <Minus className="w-3 h-3 stroke-[2.5]" />
              </motion.button>
              <span className="text-xs font-bold text-stone-900 tabular-nums px-1 min-w-[14px] text-center leading-none">
                {quantity}
              </span>
              <motion.button
                type="button"
                whileTap={{ scale: 0.85 }}
                onClick={() => onUpdateQuantity(item.id, 1)}
                className="w-6 h-6 flex items-center justify-center rounded-full bg-[#D9532F] text-white text-xs font-bold hover:bg-[#BF4321] transition-colors cursor-pointer shadow-2xs"
                aria-label="Sumar una unidad"
              >
                <Plus className="w-3 h-3 stroke-[2.5]" />
              </motion.button>
            </div>
          )}
        </div>
      )}
    </article>
  );
};

export default ProductCardBeverage;
