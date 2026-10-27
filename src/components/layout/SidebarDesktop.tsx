import React from 'react';
import { Search, X, Store, Bike, UtensilsCrossed } from 'lucide-react';
import type { MenuItem } from '../../types';

interface SidebarDesktopProps {
  businessName: string;
  logoUrl?: string;
  localAbierto: boolean;
  horariosAtencion?: string;
  categories: string[];
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  items: MenuItem[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  deliveryType: 'takeaway' | 'delivery';
  onDeliveryTypeChange: (type: 'takeaway' | 'delivery') => void;
  soloTakeaway: boolean;
}

export const SidebarDesktop: React.FC<SidebarDesktopProps> = ({
  businessName,
  logoUrl,
  localAbierto,
  horariosAtencion,
  categories,
  activeCategory,
  onSelectCategory,
  items,
  searchQuery,
  onSearchChange,
  deliveryType,
  onDeliveryTypeChange,
  soloTakeaway,
}) => {
  const countByCategory = React.useMemo(() => {
    const counts: Record<string, number> = {};
    for (const cat of categories) {
      counts[cat] = items.filter((i) => (i.category || categories[0]) === cat).length;
    }
    return counts;
  }, [items, categories]);

  return (
    <aside
      aria-label="Barra lateral de navegación"
      className="hidden lg:flex flex-col w-full sticky top-6 max-h-[calc(100vh-3rem)] bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs z-20 overflow-hidden"
    >
      {/* 1. Branding & Status Badge */}
      <div className="space-y-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={businessName}
              className="h-10 w-auto max-w-[130px] rounded-xl object-contain ring-1 ring-stone-200/70 shadow-xs shrink-0"
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                if (target.src.includes('Logo%202.svg') || target.src.includes('Logo 2.svg')) {
                  target.src = '/assets-t1/Logo 2.png';
                } else if (target.src.includes('Logo%202.png') || target.src.includes('Logo 2.png')) {
                  target.src = '/assets-t1/Logo 2.svg';
                } else {
                  target.style.display = 'none';
                }
              }}
            />
          ) : (
            <div className="w-11 h-11 rounded-2xl bg-[#D9532F] flex items-center justify-center font-bold text-white text-lg shadow-sm shrink-0">
              {businessName ? businessName.charAt(0).toUpperCase() : 'M'}
            </div>
          )}

          <div className="min-w-0">
            <h1 className="text-stone-900 font-bold text-base tracking-tight truncate leading-tight">
              {businessName || 'Menú Inteligente'}
            </h1>
            <span className="text-[11px] text-stone-500 font-medium">Carta digital</span>
          </div>
        </div>

        {/* Badge dinámico de estado en Verde Esmeralda */}
        <div
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border w-full ${
            localAbierto
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200/70'
              : 'bg-rose-50 text-rose-700 border-rose-200/70'
          }`}
          title={
            localAbierto
              ? horariosAtencion
                ? `Abierto · Horarios: ${horariosAtencion}`
                : 'Abierto para pedidos'
              : horariosAtencion
              ? `Cerrado · Horarios: ${horariosAtencion}`
              : 'Local cerrado'
          }
        >
          <span className="relative flex h-2 w-2 shrink-0">
            {localAbierto && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            )}
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                localAbierto ? 'bg-emerald-500' : 'bg-rose-500'
              }`}
            />
          </span>
          <span className="text-[11px] font-semibold truncate">
            {localAbierto
              ? horariosAtencion
                ? `Abierto hoy hasta ${horariosAtencion.split(/a|hasta|-/i).pop()?.trim() || 'medianoche'}`
                : 'Abierto para pedidos'
              : 'Cerrado momentáneamente'}
          </span>
        </div>

        {/* Switcher de Entrega en Sidebar */}
        <div className="grid grid-cols-2 gap-1 bg-stone-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => onDeliveryTypeChange('takeaway')}
            className={`py-1.5 px-2 rounded-lg font-semibold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              deliveryType === 'takeaway'
                ? 'bg-white text-stone-900 font-bold shadow-xs'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>Retiro</span>
          </button>

          {!soloTakeaway && (
            <button
              type="button"
              onClick={() => onDeliveryTypeChange('delivery')}
              className={`py-1.5 px-2 rounded-lg font-semibold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                deliveryType === 'delivery'
                  ? 'bg-white text-stone-900 font-bold shadow-xs'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              <Bike className="w-3.5 h-3.5" />
              <span>Delivery</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Buscador Minimalista */}
      <div className="py-4">
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar en la carta..."
            className="w-full pl-9 pr-8 py-2 rounded-xl bg-stone-100 border border-transparent text-stone-900 text-xs outline-none focus:bg-white focus:border-[#D9532F]/40 placeholder:text-stone-400 transition-colors shadow-xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 transition cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 3. Menú vertical de categorías con pastillas cálidas */}
      <nav className="flex-1 overflow-y-auto space-y-1 custom-scrollbar pr-1" aria-label="Categorías">
        <span className="text-[11px] font-semibold text-stone-400 px-3 py-1 block">
          Categorías
        </span>

        {categories.map((cat) => {
          const isActive = activeCategory === cat;
          const count = countByCategory[cat] ?? 0;

          return (
            <button
              key={cat}
              type="button"
              onClick={() => onSelectCategory(cat)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition-all cursor-pointer group text-left ${
                isActive
                  ? 'bg-[#FAF1ED] text-[#D9532F] font-semibold border-l-2 border-[#D9532F] pl-3 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50 border-l-2 border-transparent font-normal'
              }`}
            >
              <span className="truncate">{cat}</span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-bold tabular-nums transition-colors ${
                  isActive
                    ? 'bg-[#FAF1ED] text-[#D9532F] border border-[#EADBD5]'
                    : 'bg-stone-100 text-stone-500 group-hover:text-stone-700'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Footer del Sidebar */}
      <div className="pt-4 border-t border-stone-100 text-[11px] text-stone-400 flex items-center justify-between">
        <span>Menú Inteligente</span>
        <span className="text-stone-600 flex items-center gap-1 font-medium">
          <UtensilsCrossed className="w-3 h-3 text-[#D9532F]" /> Premium
        </span>
      </div>
    </aside>
  );
};

export default SidebarDesktop;
