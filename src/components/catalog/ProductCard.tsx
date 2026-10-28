import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UtensilsCrossed, Plus, Minus } from 'lucide-react';
import type { MenuItem } from '../../types';
import { normalizeImageUrl } from '../../utils/formatters';
import { getBadgeConfig } from '../../utils/badges';

interface ProductCardProps {
  item: MenuItem;
  quantity?: number;
  onAdd: (item: MenuItem) => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  isEcommerce?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
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
    <article className="w-full group flex flex-col justify-between h-full bg-white rounded-[22px] p-4.5 sm:p-5 border border-stone-200/70 shadow-[0_4px_16px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_28px_-6px_rgba(0,0,0,0.08)] hover:border-stone-300 transition-all duration-300">
      {/* 1. Contenedor de foto con base neutra de encuadre (ligeramente más alta y espaciosa) */}
      <div>
        <div className="relative aspect-[1.22/1] w-full rounded-2xl bg-stone-100/80 p-3.5 flex items-center justify-center overflow-hidden mb-3.5 shadow-2xs">
          {!imageLoaded && !imageError && item.imagePath && (
            <div className="absolute inset-0 animate-shimmer" />
          )}

          {item.imagePath && !imageError ? (
            <img
              src={normalizeImageUrl(item.imagePath)}
              alt={item.title}
              width="240"
              height="196"
              loading="lazy"
              decoding="async"
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              className={`h-full w-full object-contain drop-shadow-sm group-hover:scale-105 transition-transform duration-300 ease-out ${
                isSoldOut ? 'grayscale opacity-50' : ''
              }`}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-stone-400 gap-1.5 p-4 text-center">
              <UtensilsCrossed className="w-8 h-8 text-stone-400" />
              <span className="text-[11px] font-semibold text-stone-500 font-sans">
                {item.title}
              </span>
            </div>
          )}

          {/* Micro-etiqueta dinámica Fast-Food Premium */}
          {(() => {
            const badgeConfig = getBadgeConfig(item.badge);
            if (!badgeConfig || isSoldOut) return null;
            return (
              <span
                className={`absolute top-2.5 left-2.5 rounded-full px-2.5 py-0.5 text-[10px] tracking-wide uppercase ${badgeConfig.className} z-10 font-sans`}
              >
                {badgeConfig.text}
              </span>
            );
          })()}

          {/* Overlay de Agotado */}
          {isSoldOut && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] flex items-center justify-center z-10">
              <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-stone-100 text-stone-600 border border-stone-300 shadow-xs font-sans">
                Agotado
              </span>
            </div>
          )}
        </div>

        {/* 2. Textos con altura fija garantizada para alineación horizontal perfecta */}
        <div>
          <h3 className="text-[15px] md:text-base font-semibold text-stone-900 tracking-tight leading-snug group-hover:text-[#D9532F] transition-colors line-clamp-1 h-6 font-sans">
            {item.title}
          </h3>
          <p className="mt-1.5 text-xs text-stone-500 line-clamp-2 h-[38px] leading-relaxed overflow-hidden font-sans">
            {item.description || ''}
          </p>
        </div>
      </div>

      {/* 3. Fila Inferior: Precios y botón alineados con altura estricta inalterable (56px) */}
      <div className="mt-auto border-t border-stone-100 flex items-center justify-between shrink-0 h-14 min-h-[56px] max-h-[56px] box-border">
        <div className="h-9 min-h-[36px] max-h-[36px] flex items-center shrink-0">
          <span className="text-base sm:text-lg font-bold tabular-nums text-[#D9532F] leading-none tracking-tight font-sans">
            {item.price}
          </span>
        </div>

        {isEcommerce && (
          <div className="h-9 min-h-[36px] max-h-[36px] flex items-center justify-end shrink-0">
            {isSoldOut ? (
              <span className="text-[11px] font-medium text-stone-400 py-1 px-2.5 rounded-full bg-stone-100 border border-stone-200">
                Agotado
              </span>
            ) : quantity === 0 ? (
              <motion.button
                type="button"
                whileTap={{ scale: 0.9 }}
                onClick={() => onAdd(item)}
                aria-label={`Agregar ${item.title}`}
                className="h-9 w-9 min-h-[36px] min-w-[36px] max-h-[36px] max-w-[36px] flex items-center justify-center rounded-full bg-[#FAF1ED] text-[#D9532F] border border-[#EADBD5] hover:bg-[#D9532F] hover:text-white active:scale-90 transition-all duration-200 cursor-pointer shadow-2xs hover:shadow-xs box-border shrink-0"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
              </motion.button>
            ) : (
              <div className="h-9 min-h-[36px] max-h-[36px] flex items-center gap-1.5 bg-[#FAF1ED] border border-[#EADBD5] rounded-full px-2 shadow-xs box-border shrink-0">
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.85 }}
                  onClick={() => onUpdateQuantity(item.id, -1)}
                  className="w-6 h-6 min-w-[24px] min-h-[24px] max-w-[24px] max-h-[24px] shrink-0 flex items-center justify-center rounded-full bg-white text-[#D9532F] text-xs font-bold shadow-2xs hover:bg-stone-50 transition-colors cursor-pointer"
                  aria-label="Restar una unidad"
                >
                  <Minus className="w-3 h-3 stroke-[2.5]" />
                </motion.button>
                <span className="text-xs font-bold text-stone-900 tabular-nums px-1 min-w-[16px] text-center leading-none select-none">
                  {quantity}
                </span>
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.85 }}
                  onClick={() => onUpdateQuantity(item.id, 1)}
                  className="w-6 h-6 min-w-[24px] min-h-[24px] max-w-[24px] max-h-[24px] shrink-0 flex items-center justify-center rounded-full bg-[#D9532F] text-white text-xs font-bold hover:bg-[#BF4321] transition-colors cursor-pointer"
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
};

export default ProductCard;
