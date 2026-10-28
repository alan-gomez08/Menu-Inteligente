export interface BadgeConfig {
  text: string;
  className: string;
}

export const getBadgeConfig = (rawBadge?: string): BadgeConfig | null => {
  if (!rawBadge || !rawBadge.trim()) return null;
  const lower = rawBadge.toLowerCase().trim();

  // 1. Más Pedido / Más Vendido / Favorito
  if (
    lower.includes('pedido') ||
    lower.includes('vendido') ||
    lower.includes('top') ||
    lower.includes('estrella') ||
    lower.includes('favorito') ||
    lower.includes('destacad')
  ) {
    return {
      text: '🔥 Popular',
      className: 'bg-[#FAF1ED] text-[#C23E1C] font-semibold border border-[#EADBD5]/80',
    };
  }

  // 2. 2x1 Hoy / Promos / Descuentos
  if (
    lower.includes('2x1') ||
    lower.includes('promo') ||
    lower.includes('oferta') ||
    lower.includes('descuento')
  ) {
    return {
      text: lower.includes('2x1') ? '2x1' : rawBadge,
      className: 'bg-amber-50 text-amber-900 font-semibold border border-amber-200/70',
    };
  }

  // 3. Veggie / Plant Based
  if (
    lower.includes('veggie') ||
    lower.includes('vegan') ||
    lower.includes('plant') ||
    lower.includes('vegetariano')
  ) {
    return {
      text: '🌱 Veggie',
      className: 'bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200/70',
    };
  }

  // 4. Picante / Spicy
  if (
    lower.includes('picante') ||
    lower.includes('spicy') ||
    lower.includes('chile') ||
    lower.includes('hot')
  ) {
    return {
      text: '🌶️ Picante',
      className: 'bg-rose-50 text-rose-800 font-semibold border border-rose-200/70',
    };
  }

  // 5. Nuevo / Estreno
  if (
    lower.includes('nuevo') ||
    lower.includes('estreno') ||
    lower.includes('new')
  ) {
    return {
      text: '✨ Nuevo',
      className: 'bg-stone-100 text-stone-700 font-semibold border border-stone-200/80',
    };
  }

  // Fallback con el texto personalizado
  return {
    text: rawBadge,
    className: 'bg-[#FAF1ED] text-[#C23E1C] font-semibold border border-[#EADBD5]/80',
  };
};

