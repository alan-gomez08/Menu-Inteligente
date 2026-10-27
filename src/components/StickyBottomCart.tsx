import React from 'react';
import FloatingCartBar from './cart/FloatingCartBar';

interface StickyBottomCartProps {
  totalItems: number;
  subtotal: number;
  isOpen: boolean;
  onOpenCart: () => void;
  accentColor?: string;
}

export const StickyBottomCart: React.FC<StickyBottomCartProps> = ({
  totalItems,
  subtotal,
  isOpen,
  onOpenCart,
}) => {
  return (
    <FloatingCartBar
      totalItems={totalItems}
      subtotal={subtotal}
      isOpen={isOpen}
      onOpenCart={onOpenCart}
    />
  );
};

export default StickyBottomCart;
