import React from 'react';
import type { DeliveryZoneData, ConfigData, CouponData } from '../types/airtable';
import type { CartItem, Palette, ClientData, MenuItem } from '../types';
import { useCartCheckout } from './cart/useCartCheckout';
import CartMobileSheet from './cart/CartMobileSheet';

export interface CartDrawerProps {
  cart: CartItem[];
  data?: ClientData;
  configuracion?: ConfigData | null;
  zonasEnvio?: DeliveryZoneData[];
  cupones?: CouponData[];
  bannerText?: string | null;
  paleta?: Palette;
  isOpen: boolean;
  onClose: () => void;
  onOpen?: () => void;
  updateQuantity: (id: string, delta: number) => void;
  removeItem?: (id: string) => void;
  onAddToCart?: (item: MenuItem) => void;
  deliveryType?: 'takeaway' | 'delivery';
  onDeliveryTypeChange?: (type: 'takeaway' | 'delivery') => void;
}

/**
 * CartDrawer refactorizado: en mobile actúa como Bottom Sheet modal nativo con drag-to-dismiss
 * y delega en useCartCheckout para mantener el 100% de la lógica de negocio intacta.
 */
export const CartDrawer: React.FC<CartDrawerProps> = ({
  cart = [],
  data,
  configuracion,
  zonasEnvio,
  cupones,
  bannerText,
  isOpen,
  onClose,
  updateQuantity,
  removeItem,
  onAddToCart = () => {},
  deliveryType,
  onDeliveryTypeChange,
}) => {
  const checkout = useCartCheckout({
    cart,
    data,
    configuracion,
    zonasEnvio,
    cupones,
    bannerText,
    updateQuantity,
    removeItem,
    externalDeliveryType: deliveryType,
    onDeliveryTypeChange,
  });

  return (
    <CartMobileSheet
      isOpen={isOpen}
      onClose={onClose}
      cart={cart}
      allMenuItems={data?.menu?.items || []}
      updateQuantity={updateQuantity}
      onRemoveProduct={(item) => {
        if (removeItem) removeItem(item.id);
        else updateQuantity(item.id, -item.quantity);
      }}
      onAddToCart={onAddToCart}
      checkout={checkout}
    />
  );
};

export default CartDrawer;