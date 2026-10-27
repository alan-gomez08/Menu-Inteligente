import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, CheckCircle2, Gift, Truck } from 'lucide-react';
import { formatPrice } from '../../utils/formatters';

interface PromoProgressBarProps {
  bannerPromo: any;
  productPromo: any;
  isFreeShippingActive: boolean;
  selectedZoneCost?: number;
}

export const PromoProgressBar: React.FC<PromoProgressBarProps> = ({
  bannerPromo,
  productPromo,
  isFreeShippingActive,
  selectedZoneCost = 0,
}) => {
  if (!bannerPromo && !productPromo) return null;

  // CASO 1: Envío Gratis
  if (bannerPromo?.isFreeShipping) {
    return (
      <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 flex items-center justify-between text-xs shadow-xs">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center shrink-0">
            <Truck className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-emerald-800 flex items-center gap-1 whitespace-nowrap">
                <CheckCircle2 className="w-3.5 h-3.5 inline shrink-0" /> Envío 100% Bonificado
              </span>
            </div>
            <p className="text-xs text-stone-600 truncate font-medium mt-0.5 whitespace-nowrap">
              {isFreeShippingActive && selectedZoneCost > 0
                ? `¡Ahorrás ${formatPrice(selectedZoneCost)} en el delivery!`
                : 'Promoción de entrega sin cargo aplicada a tu pedido'}
            </p>
          </div>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 tabular-nums shrink-0 whitespace-nowrap">
          Envío $0
        </span>
      </div>
    );
  }

  // CASO 2: Promoción de Producto (NxM, 2da unidad, combo regalo, regalo simple)
  if (productPromo) {
    const isUnlocked = productPromo.isFullyApplied;
    const current = productPromo.progressCurrent ?? 0;
    const target = productPromo.progressTarget ?? 1;
    const percentage = Math.min(100, Math.max(0, Math.round((current / target) * 100)));

    return (
      <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 shadow-xs space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                isUnlocked
                  ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                  : 'bg-[#FAF1ED] text-[#D9532F] border border-[#EADBD5]'
              }`}
            >
              {isUnlocked ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <Gift className="w-4 h-4 animate-bounce" />
              )}
            </div>
            <div className="min-w-0">
              <span
                className={`text-[11px] font-semibold tracking-tight block truncate whitespace-nowrap ${
                  isUnlocked ? 'text-emerald-800' : 'text-[#D9532F]'
                }`}
              >
                {isUnlocked ? '¡Promo desbloqueada!' : 'Promoción en progreso'}
              </span>
              <p className="text-xs text-stone-600 font-medium truncate whitespace-nowrap">
                {productPromo.motivationalText || productPromo.statusText}
              </p>
            </div>
          </div>

          <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 border tabular-nums whitespace-nowrap ${
              isUnlocked
                ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                : 'bg-[#FAF1ED] text-[#D9532F] border border-[#EADBD5]'
            }`}
          >
            {isUnlocked ? '¡Aplicada!' : `${current}/${target}`}
          </span>
        </div>

        {/* Barra de progreso interactiva */}
        {!isUnlocked && (
          <div className="w-full bg-stone-200 rounded-full h-1.5 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#D9532F] to-[#E07A5F] rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        )}
      </div>
    );
  }

  // CASO 3: Porcentaje genérico de descuento en Banner
  if (bannerPromo?.discountPercent > 0) {
    return (
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#FAF1ED] via-stone-50 to-[#FAF1ED] border border-[#EADBD5] flex items-center justify-between text-xs shadow-xs">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-white border border-[#EADBD5] flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 text-[#D9532F]" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-bold text-[#D9532F] flex items-center gap-1 whitespace-nowrap">
              {bannerPromo.discountPercent}% OFF Especial
            </span>
            <p className="text-xs text-stone-600 truncate font-medium whitespace-nowrap">
              Descuento aplicado automáticamente en tu pedido
            </p>
          </div>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-[#D9532F] border border-[#EADBD5] tabular-nums shrink-0 whitespace-nowrap">
          {bannerPromo.discountPercent}% OFF
        </span>
      </div>
    );
  }

  return null;
};

export default PromoProgressBar;
