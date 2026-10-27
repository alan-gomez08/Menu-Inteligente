import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { formatPrice } from '../../utils/formatters';

interface FloatingCartBarProps {
  totalItems: number;
  subtotal: number;
  isOpen: boolean;
  onOpenCart: () => void;
}

export const FloatingCartBar: React.FC<FloatingCartBarProps> = ({
  totalItems,
  subtotal,
  isOpen,
  onOpenCart,
}) => {
  return (
    <AnimatePresence>
      {totalItems > 0 && !isOpen && (
        <motion.div
          initial={{ y: 80, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 80, opacity: 0, scale: 0.95 }}
          transition={{ type: 'spring', damping: 26, stiffness: 360 }}
          className="lg:hidden fixed bottom-4 left-4 right-4 bottom-[calc(1rem+env(safe-area-inset-bottom,0px))] z-30 max-w-md mx-auto pointer-events-auto select-none"
        >
          <div
            onClick={onOpenCart}
            role="button"
            tabIndex={0}
            aria-label={`Ver pedido: ${totalItems} productos por ${formatPrice(subtotal)}`}
            className="w-full h-[60px] flex items-center justify-between px-4 py-2 rounded-full bg-stone-900/95 text-white backdrop-blur-xl border border-stone-800/90 shadow-[0_14px_38px_rgba(0,0,0,0.35)] cursor-pointer active:scale-[0.98] transition-all select-none group"
          >
            {/* Lado izquierdo: Ícono de bolsa con badge de cantidad y subtotal */}
            <div className="flex items-center gap-3">
              <div className="relative flex items-center justify-center w-9 h-9 rounded-full bg-white/10 text-white shrink-0">
                <ShoppingBag className="w-4.5 h-4.5 text-white stroke-[2.2]" />
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#D9532F] text-white text-[11px] font-bold flex items-center justify-center border-2 border-stone-900 shadow-xs tabular-nums">
                  {totalItems}
                </span>
              </div>

              <div className="flex flex-col text-left justify-center">
                <span className="text-[10px] uppercase font-semibold tracking-wider text-stone-400 leading-none">
                  Subtotal
                </span>
                <span className="text-base font-bold text-white tabular-nums tracking-tight mt-0.5 leading-tight">
                  {formatPrice(subtotal)}
                </span>
              </div>
            </div>

            {/* Lado derecho: Botón elegante "Ver Pedido" */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenCart();
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#D9532F] hover:bg-[#BF4321] text-white font-semibold text-xs sm:text-sm shadow-md shadow-[#D9532F]/25 transition-all active:scale-95 cursor-pointer shrink-0"
            >
              <span>Ver Pedido</span>
              <ArrowRight className="w-4 h-4 stroke-[2.2]" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FloatingCartBar;

