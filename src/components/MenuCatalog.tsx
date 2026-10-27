import React from 'react';
import type { MenuItem } from '../types';
import ProductGrid from './catalog/ProductGrid';

interface MenuCatalogProps {
  items: MenuItem[];
  categories: string[];
  activeCategory: string;
  onActiveCategoryChange: (category: string) => void;
  cart: any[];
  onAddToCart: (item: MenuItem) => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  accentColor?: string;
  isLoading?: boolean;
  searchQuery?: string;
}

export const MenuCatalog: React.FC<MenuCatalogProps> = ({
  items,
  categories,
  activeCategory,
  onActiveCategoryChange,
  cart,
  onAddToCart,
  onUpdateQuantity,
  isLoading = false,
  searchQuery = '',
}) => {
  return (
    <ProductGrid
      items={items}
      categories={categories}
      activeCategory={activeCategory}
      onActiveCategoryChange={onActiveCategoryChange}
      cart={cart}
      onAddToCart={onAddToCart}
      onUpdateQuantity={onUpdateQuantity}
      isLoading={isLoading}
      searchQuery={searchQuery}
    />
  );
};

export default MenuCatalog;
