import React, { useEffect } from 'react';
import { motion, AnimatePresence, type PanInfo } from 'framer-motion';
import { X, ShoppingBag } from 'lucide-react';
import type { CartItem, MenuItem } from '../../types';
import CartContent from './CartContent';
import OrderSummary from './OrderSummary';

interface CartMobileSheetProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  allMenuItems?: MenuItem[];
  updateQuantity: (id: string, delta: number) => void;
  onRemoveProduct: (item: CartItem) => void;
  onAddToCart: (item: MenuItem) => void;
  checkout: any;
}

export const CartMobileSheet: React.FC<CartMobileSheetProps> = ({
  isOpen,
  onClose,
  cart,
  allMenuItems = [],
  updateQuantity,
  onRemoveProduct,
  onAddToCart,
  checkout,
}) => {
  const hasItems = cart.length > 0;

  // Bloquear scroll en body cuando el modal está abierto en mobile
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.y > 100 || info.velocity.y > 250) {
      onClose();
    }
  };

  const handleFocusMissingField = () => {
    const zoneEl = document.querySelector('select') as HTMLSelectElement | null;
    const addrEl = document.querySelector('input[placeholder*="Calle"]') as HTMLInputElement | null;
    if (!checkout.zone) {
      zoneEl?.focus();
      zoneEl?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      zoneEl?.classList.add('ring-2', 'ring-[#D9532F]', 'animate-pulse');
      setTimeout(() => zoneEl?.classList.remove('ring-2', 'ring-[#D9532F]', 'animate-pulse'), 2200);
    } else if (!checkout.address.trim()) {
      addrEl?.focus();
      addrEl?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      addrEl?.classList.add('ring-2', 'ring-[#D9532F]', 'animate-pulse');
      setTimeout(() => addrEl?.classList.remove('ring-2', 'ring-[#D9532F]', 'animate-pulse'), 2200);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop con desenfoque suave */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm cursor-pointer"
            onClick={onClose}
            aria-label="Cerrar carrito"
          />

          {/* Bottom Sheet deslizable con footer transaccional anclado */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={{ top: 0.05, bottom: 0.7 }}
            onDragEnd={handleDragEnd}
            className="relative z-10 w-full max-h-[92dvh] bg-white rounded-t-[32px] border-t border-stone-200 shadow-2xl flex flex-col overflow-hidden pb-[max(0.75rem,env(safe-area-inset-bottom))]"
          >
            {/* Handle visual para arrastre */}
            <div className="pt-3 pb-1 cursor-grab active:cursor-grabbing flex justify-center">
              <div className="w-12 h-1.5 rounded-full bg-stone-300 hover:bg-stone-400 transition-colors" />
            </div>

            {/* Header del Bottom Sheet */}
            <header className="px-5 py-3.5 flex items-center justify-between border-b border-stone-200/80 shrink-0 bg-white">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#FAF1ED] border border-[#EADBD5] flex items-center justify-center text-[#D9532F]">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-stone-900 tracking-tight">
                    Tu Pedido
                  </h2>
                  <span className="text-xs text-stone-500 font-medium tabular-nums">
                    {checkout.totalItems} {checkout.totalItems === 1 ? 'producto' : 'productos'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-800 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Cerrar modal"
              >
                <X className="w-4 h-4" />
              </button>
            </header>

            {/* Contenido scrolleable medio */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-4 overscroll-contain">
              <CartContent
                cart={cart}
                allMenuItems={allMenuItems}
                updateQuantity={updateQuantity}
                onRemoveProduct={onRemoveProduct}
                onAddToCart={onAddToCart}
                checkout={checkout}
                onClose={onClose}
                showSummary={!hasItems}
              />
            </div>

            {/* Footer anclado en mobile con WhatsApp siempre a mano */}
            {hasItems && (
              <div className="p-4 bg-white border-t border-stone-200/80 shrink-0 shadow-[0_-8px_20px_rgba(0,0,0,0.06)]">
                <OrderSummary
                  subtotal={checkout.subtotal}
                  productPromo={checkout.productPromo}
                  productDiscountAmount={checkout.productDiscountAmount}
                  appliedCoupon={checkout.appliedCoupon}
                  percentDiscountAmount={checkout.percentDiscountAmount}
                  promoPercent={checkout.bannerPromo?.discountPercent || 0}
                  bannerPromoRaw={checkout.bannerPromo?.raw}
                  deliveryType={checkout.deliveryType}
                  selectedZoneObj={checkout.selectedZoneObj}
                  isFreeShippingActive={checkout.isFreeShippingActive}
                  deliveryFee={checkout.deliveryFee}
                  total={checkout.total}
                  localAbierto={checkout.localAbierto}
                  horariosAtencion={checkout.horariosAtencion}
                  isDeliveryIncomplete={checkout.isDeliveryIncomplete}
                  isOrderValid={checkout.isOrderValid}
                  paymentMethod={checkout.paymentMethod}
                  onSendOrder={checkout.sendOrderToWhatsApp}
                  onFocusMissingField={handleFocusMissingField}
                />
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CartMobileSheet;
