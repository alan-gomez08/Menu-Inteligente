import React, { useState } from 'react';
import { Plus, Check } from 'lucide-react';
import type { CartItem, MenuItem } from '../../types';
import { normalizeImageUrl } from '../../utils/formatters';

interface UpsellRowProps {
  items: MenuItem[];
  onAddToCart: (item: MenuItem) => void;
  cartItemIds?: string[];
  cart?: CartItem[];
}

export const UpsellRow: React.FC<UpsellRowProps> = ({
  items,
  onAddToCart,
  cartItemIds = [],
  cart = [],
}) => {
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  const handleAddWithFeedback = (item: MenuItem) => {
    onAddToCart(item);
    setJustAddedId(item.id);
    setTimeout(() => {
      setJustAddedId((current) => (current === item.id ? null : current));
    }, 1000);
  };

  // Filtrar sugerencias: excluir automáticamente cualquier producto que ya esté en el pedido (por id o nombre)
  const suggestedItems = React.useMemo(() => {
    const idsSet = new Set<string>();
    cartItemIds.forEach((id) => idsSet.add(String(id)));
    cart.forEach((c) => idsSet.add(String(c.id)));

    const titlesSet = new Set<string>();
    cart.forEach((c) => titlesSet.add((c.title || '').trim().toLowerCase()));

    const candidates = items.filter((item) => {
      if (item.isSoldOut) return false;
      const idStr = String(item.id);
      const titleStr = (item.title || '').trim().toLowerCase();
      if (idsSet.has(idStr)) return false;
      if (titlesSet.has(titleStr)) return false;
      return true;
    });

    // Priorizar categorías como 'Bebidas', 'Acompañamientos', 'Postres'
    const beverageOrSides = candidates.filter((item) => {
      const cat = (item.category || '').toLowerCase();
      return cat.includes('bebid') || cat.includes('acompañ') || cat.includes('postre') || cat.includes('extra');
    });

    if (beverageOrSides.length >= 3) {
      return beverageOrSides.slice(0, 4);
    }

    return candidates.slice(0, 4);
  }, [items, cartItemIds, cart]);

  if (suggestedItems.length === 0) return null;

  // Mostramos hasta 2 sugerencias en una cuadrícula limpia de 2 columnas
  const displayItems = suggestedItems.slice(0, 2);

  return (
    <div className="space-y-2 pt-2 border-t border-stone-100">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-stone-800">
          ¿Agregamos una bebida o extra?
        </span>
        <span className="text-[10px] text-[#D9532F] font-semibold bg-[#FAF1ED] px-2 py-0.5 rounded-full border border-[#EADBD5]">
          1-Tap
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {displayItems.map((item) => {
          const isJustAdded = justAddedId === item.id;

          return (
            <div
              key={item.id}
              className={`flex items-center gap-2 p-2 rounded-xl transition-all duration-300 ${
                isJustAdded
                  ? 'bg-[#FAF1ED] border border-[#EADBD5] ring-1 ring-[#EADBD5]/60 shadow-xs'
                  : 'bg-stone-50 border border-stone-200/80 hover:border-stone-300 shadow-2xs'
              }`}
            >
              <div className="w-9 h-9 rounded-lg overflow-hidden bg-white border border-stone-200/60 shrink-0 flex items-center justify-center p-0.5">
                {item.imagePath ? (
                  <img
                    src={normalizeImageUrl(item.imagePath)}
                    alt={item.title}
                    width="36"
                    height="36"
                    className="w-full h-full object-contain"
                    loading="lazy"
                    decoding="async"
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

              <div className="flex-1 min-w-0">
                <span className="text-xs font-semibold text-stone-900 block truncate">
                  {item.title}
                </span>
                <span className="text-xs font-semibold text-stone-700 tabular-nums">
                  {isJustAdded ? (
                    <span className="text-[10px] font-bold text-emerald-600">¡Sumado!</span>
                  ) : (
                    item.price
                  )}
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleAddWithFeedback(item)}
                disabled={isJustAdded}
                className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200 cursor-pointer shadow-xs ${
                  isJustAdded
                    ? 'bg-emerald-600 text-white scale-105 shadow-emerald-600/30 ring-2 ring-emerald-200'
                    : 'bg-[#D9532F] hover:bg-[#BF4321] text-white active:scale-90'
                }`}
                title={isJustAdded ? `¡${item.title} agregado!` : `Agregar ${item.title}`}
                aria-label={isJustAdded ? `¡${item.title} agregado!` : `Agregar ${item.title} con 1 clic`}
              >
                {isJustAdded ? (
                  <Check className="w-3.5 h-3.5 stroke-[3] animate-in zoom-in-75 duration-150" />
                ) : (
                  <Plus className="w-3.5 h-3.5 stroke-[2.6]" />
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UpsellRow;

