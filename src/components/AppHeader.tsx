import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { formatPrice } from '../utils/formatters';

interface AppHeaderProps {
  businessName: string;
  logoUrl?: string;
  localAbierto: boolean;
  horariosAtencion?: string;
  accentColor?: string;
  cartCount: number;
  cartSubtotal: number;
  onOpenCart: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  businessName,
  logoUrl,
  localAbierto,
  horariosAtencion,
  accentColor = '#F59E0B',
  cartCount,
  cartSubtotal,
  onOpenCart,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-black/60 backdrop-blur-md border-b border-white/10 transition-all select-none">
      <div className="w-full max-w-4xl mx-auto px-5 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-4">
        {/* Lado izquierdo: Branding + Indicador de Estado */}
        <div className="flex items-center gap-3.5 min-w-0">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={businessName || 'Logotipo'}
              width="44"
              height="44"
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl object-cover shrink-0 ring-1 ring-white/10 shadow-lg shadow-black/40"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = 'none';
              }}
            />
          ) : (
            <div
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center font-bold text-black text-base shrink-0 shadow-lg shadow-black/40"
              style={{ backgroundColor: accentColor }}
            >
              {businessName ? businessName.charAt(0).toUpperCase() : 'M'}
            </div>
          )}

          <div className="flex items-center gap-3 min-w-0">
            <h1 className="text-white font-semibold text-lg sm:text-xl tracking-tight truncate">
              {businessName || 'Menú Digital'}
            </h1>

            {/* Indicador visual sutil estilo iOS (Punto verde / rojo) */}
            <div
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border shrink-0 backdrop-blur-sm ${
                localAbierto
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_12px_rgba(16,185,129,0.15)]'
                  : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
              }`}
              title={
                localAbierto
                  ? 'Local abierto para pedidos'
                  : horariosAtencion
                  ? `Cerrado · Horarios: ${horariosAtencion}`
                  : 'Local cerrado'
              }
            >
              <span className="relative flex h-2 w-2">
                {localAbierto && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                )}
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${
                    localAbierto ? 'bg-emerald-400' : 'bg-rose-500'
                  }`}
                />
              </span>
              <span className="text-[11px] font-semibold tracking-wider uppercase">
                {localAbierto ? 'Abierto' : 'Cerrado'}
              </span>
            </div>
          </div>
        </div>

        {/* Lado derecho: Carrito Desktop únicamente (Oculto en Mobile para dar paso al Floating Dock) */}
        <div className="hidden md:flex items-center">
          <motion.button
            type="button"
            onClick={onOpenCart}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-full font-bold text-xs text-black shadow-lg shadow-black/30 hover:brightness-105 transition-all cursor-pointer"
            style={{ backgroundColor: accentColor }}
            aria-label="Abrir carrito"
          >
            <ShoppingBag className="w-4 h-4 text-black shrink-0" strokeWidth={2.4} />
            <span>{cartCount > 0 ? `Mi Pedido (${cartCount})` : 'Mi Pedido'}</span>
            {cartCount > 0 && cartSubtotal > 0 && (
              <span className="bg-black/15 px-2 py-0.5 rounded-full text-[11px] font-black">
                {formatPrice(cartSubtotal)}
              </span>
            )}
          </motion.button>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
