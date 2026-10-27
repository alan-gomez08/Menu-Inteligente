import React from 'react';

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col justify-between h-full bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-xs animate-pulse">
      {/* Contenedor fotográfico skeleton */}
      <div className="aspect-[4/3] w-full rounded-xl bg-slate-100/90 animate-shimmer mb-3" />

      {/* Contenido */}
      <div className="space-y-2">
        <div className="h-5 bg-slate-200/70 rounded-md w-3/5" />
        <div className="space-y-1.5 pt-1">
          <div className="h-3 bg-slate-100 rounded-md w-full" />
          <div className="h-3 bg-slate-100 rounded-md w-4/5" />
        </div>
      </div>

      {/* Bottom row */}
      <div className="pt-2.5 mt-3 flex items-center justify-between border-t border-slate-100">
        <div className="h-5 bg-slate-200/80 rounded-md w-16" />
        <div className="h-9 w-9 rounded-full bg-slate-100" />
      </div>
    </div>
  );
};

export const MenuSkeleton: React.FC = () => {
  return (
    <div className="w-full space-y-8 animate-pulse py-4">
      {/* Category Tabs Skeleton */}
      <div className="flex items-center gap-2 overflow-hidden py-1">
        <div className="h-9 w-24 rounded-full bg-stone-200/80 shrink-0" />
        <div className="h-9 w-32 rounded-full bg-stone-100 shrink-0" />
        <div className="h-9 w-28 rounded-full bg-stone-100 shrink-0" />
        <div className="h-9 w-24 rounded-full bg-stone-100 shrink-0" />
      </div>

      {/* Product Grid Skeleton */}
      <div className="space-y-4">
        <div className="h-6 w-36 bg-stone-200 rounded-md" />
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          <ProductCardSkeleton />
          <ProductCardSkeleton />
          <ProductCardSkeleton />
          <ProductCardSkeleton />
          <ProductCardSkeleton />
          <ProductCardSkeleton />
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
