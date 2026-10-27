import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UtensilsCrossed, Plus, Minus } from 'lucide-react';
import type { MenuItem } from '../../types';
import { normalizeImageUrl } from '../../utils/formatters';
import { getBadgeConfig } from '../../utils/badges';

interface ProductCardCompactProps {
  item: MenuItem;
  quantity?: number;
  onAdd: (item: MenuItem) => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  isEcommerce?: boolean;
}

export const ProductCardCompact: React.FC<ProductCardCompactProps> = ({
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
    <article className="w-full group relative flex items-stretch p-3 sm:p-3.5 bg-white rounded-2xl border border-stone-200/70 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:border-stone-300 transition-all gap-3.5 select-none">
      {/* 1. FOTO A LA IZQUIERDA: Contenedor cuadrado ultra limpio con fondo neutro estructurado (#F1F3F5) */}
      <div className="relative w-[96px] h-[96px] sm:w-[104px] sm:h-[104px] min-w-[96px] sm:min-w-[104px] rounded-2xl overflow-hidden bg-[#F1F3F5] p-1 border border-stone-200/80 flex items-center justify-center shrink-0 shadow-inner/5">
        {!imageLoaded && !imageError && item.imagePath && (
          <div className="absolute inset-0 animate-shimmer" />
        )}

        {item.imagePath && !imageError ? (
          <img
            src={normalizeImageUrl(item.imagePath)}
            alt={item.title}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            className={`w-full h-full object-contain scale-[1.14] drop-shadow-sm group-hover:scale-[1.20] transition-transform duration-300 ease-out ${
              isSoldOut ? 'grayscale opacity-50' : ''
            }`}
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-stone-400 gap-1 p-2">
            <UtensilsCrossed className="w-5 h-5 text-stone-400" />
            <span className="text-[9px] font-semibold text-stone-500">
              {item.title.slice(0, 10)}
            </span>
          </div>
        )}

        {isSoldOut && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] flex items-center justify-center">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-stone-100 text-stone-500 border border-stone-200">
              Agotado
            </span>
          </div>
        )}
      </div>

      {/* 2. COLUMNA DERECHA: Título, Descripción y Precio con espacio reservado para el botón */}
      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5 pr-10">
        <div>
          <div className="flex items-center gap-1.5">
            <h4 className="font-semibold text-[15px] sm:text-base text-stone-900 group-hover:text-[#D9532F] transition-colors line-clamp-1 tracking-tight leading-snug">
              {item.title}
            </h4>
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
            <p className="text-xs text-stone-500 line-clamp-2 mt-1 leading-relaxed">
              {item.description}
            </p>
          )}
        </div>

        {/* Precio en tono terracota elegante */}
        <div className="pt-2">
          <span className="text-base sm:text-[17px] font-bold tabular-nums text-[#D9532F] tracking-tight">
            {item.price}
          </span>
        </div>
      </div>

      {/* 3. BOTÓN (+) O STEPPER ANCLADO RÍGIDAMENTE EN LA ESQUINA INFERIOR DERECHA */}
      {isEcommerce && !isSoldOut && (
        <div className="absolute bottom-3 right-3 sm:bottom-3.5 sm:right-3.5 z-10">
          {quantity === 0 ? (
            <motion.button
              type="button"
              whileTap={{ scale: 0.9 }}
              onClick={() => onAdd(item)}
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
    </article>
  );
};

export default ProductCardCompact;
