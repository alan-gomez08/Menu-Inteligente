import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UtensilsCrossed, Plus, Minus } from 'lucide-react';
import type { MenuItem } from '../../types';
import { normalizeImageUrl } from '../../utils/formatters';
import { getBadgeConfig } from '../../utils/badges';

interface ProductCardFeaturedMobileProps {
  item: MenuItem;
  quantity?: number;
  onAdd: (item: MenuItem) => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  isEcommerce?: boolean;
}

export const ProductCardFeaturedMobile: React.FC<ProductCardFeaturedMobileProps> = ({
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
    <article className="w-full h-[254px] flex flex-col justify-between bg-white rounded-[22px] p-3.5 border border-slate-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.04)] active:scale-[0.99] transition-all">
      {/* 1. Foto con encuadre cálido neutro */}
      <div>
        <div className="relative w-full h-[132px] rounded-2xl bg-stone-50 border border-stone-100 p-2 flex items-center justify-center overflow-hidden mb-2.5">
          {!imageLoaded && !imageError && item.imagePath && (
            <div className="absolute inset-0 animate-shimmer" />
          )}

          {item.imagePath && !imageError ? (
            <img
              src={normalizeImageUrl(item.imagePath)}
              alt={item.title}
              width="230"
              height="132"
              loading="lazy"
              decoding="async"
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              className={`h-full w-full object-contain drop-shadow-sm transition-transform duration-300 ${
                isSoldOut ? 'grayscale opacity-50' : ''
              }`}
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-slate-400 gap-1 p-2 text-center">
              <UtensilsCrossed className="w-6 h-6 text-slate-400" />
              <span className="text-[10px] font-semibold text-slate-500">
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
                className={`absolute top-2.5 left-2.5 rounded-full px-2.5 py-0.5 text-[9px] font-bold tracking-wide uppercase ${badgeConfig.className} shadow-2xs z-10`}
              >
                {badgeConfig.text}
              </span>
            );
          })()}

          {isSoldOut && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] flex items-center justify-center z-10">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-300">
                Agotado
              </span>
            </div>
          )}
        </div>

        {/* 2. Textos */}
        <div>
          <h3 className="text-[15px] font-extrabold text-slate-900 tracking-tight leading-snug line-clamp-1">
            {item.title}
          </h3>
          <p className="text-xs text-slate-500 line-clamp-1 mt-0.5 leading-relaxed">
            {item.description || ''}
          </p>
        </div>
      </div>

      {/* 3. Precios y Botón */}
      <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 min-h-[40px] h-[40px]">
        <span className="text-base font-black tabular-nums text-slate-950">
          {item.price}
        </span>

        {isEcommerce && (
          <div>
            {isSoldOut ? (
              <span className="text-[10px] font-medium text-slate-400 py-1 px-2.5 rounded-full bg-slate-100 border border-slate-200">
                Agotado
              </span>
            ) : quantity === 0 ? (
              <motion.button
                type="button"
                whileTap={{ scale: 0.92 }}
                onClick={() => onAdd(item)}
                aria-label={`Agregar ${item.title}`}
                className="h-8 px-3 rounded-full bg-[#D9532F] hover:bg-[#BF4321] text-white font-semibold text-xs flex items-center gap-1 shadow-xs active:scale-95 cursor-pointer transition-all"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.2]" />
                <span>Sumar</span>
              </motion.button>
            ) : (
              <div className="flex items-center gap-1 bg-[#FAF1ED] border border-[#EADBD5] rounded-full p-0.5 shadow-2xs">
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
};

export default ProductCardFeaturedMobile;

