import React from 'react';
import { Minus, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import type { CartItem } from '../../types';
import { parsePrice, formatPrice, normalizeImageUrl } from '../../utils/formatters';

interface CartItemListProps {
  cart: CartItem[];
  updateQuantity: (id: string, delta: number) => void;
  onRemoveProduct: (item: CartItem) => void;
  productPromo: any;
  productDiscountAmount: number;
}

export const CartItemList: React.FC<CartItemListProps> = ({
  cart,
  updateQuantity,
  onRemoveProduct,
  productPromo,
  productDiscountAmount,
}) => {
  return (
    <div className="space-y-2">
      {cart.map((item) => {
        const priceNum = parsePrice(item.price);
        const isDiscountedItem =
          productPromo &&
          productDiscountAmount > 0 &&
          productPromo.discountedItem?.id === item.id;

        return (
          <div
            key={item.id}
            className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-stone-200/80 hover:border-stone-300 transition-all shadow-2xs"
          >
            {/* Imagen Cuadrada en Contenedor Estructurado */}
            <div className="w-12 h-12 sm:w-13 sm:h-13 shrink-0 rounded-xl overflow-hidden bg-[#F1F3F5] border border-stone-200/70 p-1 flex items-center justify-center shadow-inner/5">
              {item.imagePath ? (
                <img
                  src={normalizeImageUrl(item.imagePath)}
                  alt={item.title}
                  className="w-full h-full object-contain"
                  loading="lazy"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : (
                <span className="text-xs font-bold text-stone-400">
                  {item.title.charAt(0)}
                </span>
              )}
            </div>

            {/* Título y Precio Limpio */}
            <div className="flex-1 min-w-0">
              <span className="font-semibold text-xs sm:text-[13px] text-stone-900 truncate block leading-tight font-sans">
                {item.title}
              </span>
              
              {/* Si es 1 unidad: solo el total en negrita. Si son 2+: total en negrita y precio unitario secundario */}
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-xs font-bold text-stone-900 tabular-nums">
                  {formatPrice(priceNum * item.quantity)}
                </span>
                {item.quantity > 1 && (
                  <span className="text-[10px] font-medium text-stone-400 tabular-nums">
                    ({formatPrice(priceNum)} c/u)
                  </span>
                )}
              </div>

              {/* Badge si tiene bonificación activa (1 sola línea, sin saltos) */}
              {isDiscountedItem && (
                <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 text-[9px] font-semibold mt-1 whitespace-nowrap max-w-full overflow-hidden">
                  <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600 shrink-0" />
                  <span className="truncate whitespace-nowrap">{productPromo.badgeText}</span>
                </div>
              )}
            </div>

            {/* Stepper de Cantidad Ergonómico y Espacioso */}
            <div className="flex items-center gap-1.5 bg-stone-100/90 border border-stone-200/70 rounded-xl p-1 shadow-2xs shrink-0">
              <button
                type="button"
                onClick={() => updateQuantity(item.id, -1)}
                className="w-6 h-6 flex items-center justify-center rounded-lg bg-white text-stone-700 text-xs font-bold shadow-2xs hover:bg-stone-50 hover:text-stone-900 active:scale-90 transition-all cursor-pointer"
                aria-label="Restar una unidad"
              >
                <Minus className="w-3 h-3 stroke-[2.2]" />
              </button>
              <span className="text-xs font-bold text-stone-900 tabular-nums px-1 text-center min-w-[18px]">
                {item.quantity}
              </span>
              <button
                type="button"
                onClick={() => updateQuantity(item.id, 1)}
                className="w-6 h-6 flex items-center justify-center rounded-lg bg-[#D9532F] text-white text-xs font-bold hover:bg-[#BF4321] active:scale-90 transition-all shadow-2xs cursor-pointer"
                aria-label="Sumar una unidad"
              >
                <Plus className="w-3 h-3 stroke-[2.4]" />
              </button>
            </div>

            {/* Botón Eliminar */}
            <button
              type="button"
              onClick={() => onRemoveProduct(item)}
              className="w-7 h-7 flex items-center justify-center rounded-xl bg-stone-100/70 hover:bg-rose-50 text-stone-400 hover:text-rose-600 transition-colors shrink-0 cursor-pointer"
              title="Eliminar producto"
              aria-label={`Eliminar ${item.title}`}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default CartItemList;
