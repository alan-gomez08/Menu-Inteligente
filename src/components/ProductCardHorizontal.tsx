import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus, ImageOff } from 'lucide-react';
import { normalizeImageUrl } from '../utils/formatters';
import type { MenuItem } from '../types';

interface ProductCardHorizontalProps {
  item: MenuItem;
  quantity?: number;
  onAdd: (item: MenuItem) => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  accentColor?: string;
  isEcommerce?: boolean;
}

export const ProductCardHorizontal: React.FC<ProductCardHorizontalProps> = ({
  item,
  quantity = 0,
  onAdd,
  onUpdateQuantity,
  accentColor = '#F59E0B',
  isEcommerce = true,
}) => {
  const isSoldOut = Boolean(item.isSoldOut || item.badge?.toLowerCase().includes('agotado'));

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="flex items-center gap-4 sm:gap-5 p-4 sm:p-5 rounded-2xl bg-[#1A1A1A] border border-white/5 hover:border-white/10 transition-all shadow-xl shadow-black/30 group"
    >
      {/* 1. Foto Cuadrada a la Izquierda (aspect-square object-cover rounded-xl) */}
      <div className="relative w-24 h-24 sm:w-28 sm:h-28 shrink-0 rounded-xl overflow-hidden bg-neutral-900 border border-white/5 flex items-center justify-center">
        {item.imagePath ? (
          <img
            src={normalizeImageUrl(item.imagePath)}
            alt={item.title}
            width="112"
            height="112"
            className={`w-full h-full aspect-square object-cover rounded-xl transition-transform duration-300 group-hover:scale-105 ${
              isSoldOut ? 'grayscale opacity-50' : ''
            }`}
            loading="lazy"
            decoding="async"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-neutral-600 gap-1 aspect-square">
            <ImageOff className="w-6 h-6 text-neutral-600" />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
              Sin foto
            </span>
          </div>
        )}

        {/* Badge flotante en la foto */}
        {item.badge && !isSoldOut && (
          <span
            className="absolute top-2 left-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full text-black shadow-md z-10"
            style={{ backgroundColor: accentColor }}
          >
            {item.badge}
          </span>
        )}

        {/* Overlay Agotado */}
        {isSoldOut && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-neutral-900/90 text-neutral-300 border border-neutral-700">
              Agotado
            </span>
          </div>
        )}
      </div>

      {/* 2. Textos y Botón Agregar (Auto Layout Mindset) */}
      <div className="flex-1 flex flex-col justify-between min-w-0 py-0.5 h-24 sm:h-28">
        <div>
          {/* Título: text-white font-semibold text-lg */}
          <h3 className="text-white font-semibold text-lg sm:text-xl line-clamp-1 tracking-tight leading-snug group-hover:text-amber-300 transition-colors">
            {item.title}
          </h3>

          {/* Descripción: text-gray-400 text-sm line-clamp-2 */}
          {item.description && (
            <p className="text-gray-400 text-sm line-clamp-2 mt-1 leading-relaxed">
              {item.description}
            </p>
          )}
        </div>

        {/* Fila Inferior: Precio en Blanco Puro y Botón en Ámbar */}
        <div className="flex items-center justify-between pt-2 border-t border-white/5">
          <span className="text-white font-bold text-base sm:text-lg tracking-tight tabular-nums">
            {item.price}
          </span>

          {isEcommerce ? (
            isSoldOut ? (
              <span className="text-xs font-medium text-neutral-500 py-1 px-3 rounded-full bg-neutral-900 border border-neutral-800">
                Agotado
              </span>
            ) : quantity === 0 ? (
              <motion.button
                type="button"
                onClick={() => onAdd(item)}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center text-black font-bold shadow-lg shadow-black/40 hover:brightness-105 active:shadow-sm transition-all cursor-pointer shrink-0"
                style={{ backgroundColor: accentColor }}
                aria-label={`Agregar ${item.title} al pedido`}
              >
                <Plus className="w-5 h-5 text-black" strokeWidth={2.6} />
              </motion.button>
            ) : (
              <div
                className="flex items-center gap-1.5 rounded-full px-2.5 py-1 border border-white/10 shrink-0 bg-neutral-900 shadow-md"
              >
                <motion.button
                  type="button"
                  onClick={() => onUpdateQuantity(item.id, -1)}
                  whileTap={{ scale: 0.9 }}
                  className="w-7 h-7 flex items-center justify-center text-neutral-300 hover:text-white rounded-full hover:bg-white/5 transition-colors cursor-pointer"
                  aria-label="Restar una unidad"
                >
                  <Minus className="w-4 h-4" strokeWidth={2.4} />
                </motion.button>

                <span className="font-bold text-sm text-white px-1.5 min-w-[20px] text-center">
                  {quantity}
                </span>

                <motion.button
                  type="button"
                  onClick={() => onUpdateQuantity(item.id, 1)}
                  whileTap={{ scale: 0.9 }}
                  className="w-7 h-7 flex items-center justify-center rounded-full text-black font-bold cursor-pointer hover:brightness-105 transition-all shadow-sm"
                  style={{ backgroundColor: accentColor }}
                  aria-label="Sumar una unidad"
                >
                  <Plus className="w-4 h-4 text-black" strokeWidth={2.6} />
                </motion.button>
              </div>
            )
          ) : null}
        </div>
      </div>
    </motion.article>
  );
};

export default ProductCardHorizontal;
