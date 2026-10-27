import React from 'react';
import { motion } from 'framer-motion';
import { Lock, AlertCircle, ArrowRight } from 'lucide-react';
import { formatPrice } from '../../utils/formatters';
import WhatsAppIcon from '../common/WhatsAppIcon';

interface OrderSummaryProps {
  subtotal: number;
  productPromo: any;
  productDiscountAmount: number;
  appliedCoupon: { code: string; discountPercentage: number } | null;
  percentDiscountAmount: number;
  promoPercent: number;
  bannerPromoRaw?: string;
  deliveryType: 'takeaway' | 'delivery';
  selectedZoneObj?: any;
  isFreeShippingActive: boolean;
  deliveryFee: number;
  total: number;
  localAbierto: boolean;
  horariosAtencion: string;
  isDeliveryIncomplete: boolean;
  isOrderValid: boolean;
  paymentMethod: 'efectivo' | 'transferencia';
  onSendOrder: () => void;
  onFocusMissingField: () => void;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  subtotal,
  productPromo,
  productDiscountAmount,
  appliedCoupon,
  percentDiscountAmount,
  promoPercent,
  bannerPromoRaw,
  deliveryType,
  selectedZoneObj,
  isFreeShippingActive,
  deliveryFee,
  total,
  localAbierto,
  horariosAtencion,
  isDeliveryIncomplete,
  isOrderValid,
  paymentMethod,
  onSendOrder,
  onFocusMissingField,
}) => {
  return (
    <div className="space-y-2.5 pt-2.5 border-t border-stone-200/80">
      {/* Desglose de Importes */}
      <div className="space-y-1.5 text-xs text-stone-600 font-sans">
        <div className="flex justify-between items-center">
          <span className="text-stone-500">Subtotal productos:</span>
          <span className="font-bold text-stone-900 tabular-nums">{formatPrice(subtotal)}</span>
        </div>

        {productPromo && productDiscountAmount > 0 && (
          <div className="flex justify-between items-center text-emerald-700 font-semibold">
            <span>Descuento {productPromo.description}:</span>
            <span className="tabular-nums">-{formatPrice(productDiscountAmount)}</span>
          </div>
        )}

        {appliedCoupon && percentDiscountAmount > 0 && (
          <div className="flex justify-between items-center text-emerald-700 font-semibold">
            <span>Descuento cupón ({appliedCoupon.code} - {appliedCoupon.discountPercentage}%):</span>
            <span className="tabular-nums">-{formatPrice(percentDiscountAmount)}</span>
          </div>
        )}

        {!appliedCoupon && promoPercent > 0 && percentDiscountAmount > 0 && (
          <div className="flex justify-between items-center text-emerald-700 font-semibold">
            <span>Descuento promoción ({bannerPromoRaw} - {promoPercent}%):</span>
            <span className="tabular-nums">-{formatPrice(percentDiscountAmount)}</span>
          </div>
        )}

        {deliveryType === 'delivery' && (
          <div className="flex justify-between items-center">
            <span className="text-stone-500">
              Costo de envío {selectedZoneObj ? `(${selectedZoneObj['Nombre de la Zona']})` : ''}:
            </span>
            <span className="font-bold text-stone-900 tabular-nums">
              {isFreeShippingActive ? (
                <span className="flex items-center gap-1.5">
                  {selectedZoneObj && selectedZoneObj.Costo > 0 && (
                    <span className="line-through text-stone-400 font-normal">
                      +{formatPrice(selectedZoneObj.Costo)}
                    </span>
                  )}
                  <span className="text-emerald-700 font-bold">Gratis</span>
                </span>
              ) : selectedZoneObj ? (
                deliveryFee > 0 ? (
                  `+${formatPrice(deliveryFee)}`
                ) : (
                  'Sin cargo'
                )
              ) : (
                <span className="text-stone-400 font-normal italic">A seleccionar zona</span>
              )}
            </span>
          </div>
        )}

        {deliveryType === 'takeaway' && (
          <div className="flex justify-between items-center text-stone-500">
            <span>Retiro por local:</span>
            <span className="text-stone-700 font-semibold">Sin costo</span>
          </div>
        )}

        <div className="flex justify-between items-center pt-2 border-t border-stone-200/80">
          <span className="font-bold text-sm text-stone-900">Total a pagar:</span>
          <span className="text-xl font-bold text-stone-900 tabular-nums">
            {formatPrice(total)}
          </span>
        </div>
      </div>

      {/* Validación Progresiva del Botón WhatsApp */}
      <div>
        {!localAbierto ? (
          <div className="space-y-1.5">
            <button
              type="button"
              disabled
              className="w-full h-11 rounded-xl bg-stone-100 text-stone-500 border border-stone-200 font-semibold text-xs flex items-center justify-center gap-2 cursor-not-allowed opacity-80 font-sans"
            >
              <Lock className="w-4 h-4 text-stone-400 shrink-0" />
              <span>Local cerrado momentáneamente</span>
            </button>
            <p className="text-[11px] text-stone-500 text-center font-medium font-sans">
              Horarios: <span className="text-stone-700 font-semibold">{horariosAtencion}</span>
            </p>
          </div>
        ) : isDeliveryIncomplete ? (
          <motion.button
            type="button"
            onClick={onFocusMissingField}
            whileTap={{ scale: 0.98 }}
            className="w-full h-11 rounded-xl bg-[#FAF1ED] hover:bg-[#F3E2DB] border border-[#EADBD5] text-[#D9532F] font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs group font-sans"
          >
            <AlertCircle className="w-4 h-4 text-[#D9532F] shrink-0 group-hover:scale-110 transition-transform" />
            <span>Completá tu dirección para pedir</span>
            <ArrowRight className="w-4 h-4 text-[#D9532F] shrink-0" />
          </motion.button>
        ) : (
          <motion.button
            type="button"
            onClick={onSendOrder}
            disabled={!isOrderValid}
            whileTap={{ scale: 0.98 }}
            className="relative group overflow-hidden w-full h-11 sm:h-12 rounded-xl bg-[#14532D] text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-md shadow-emerald-950/20 hover:shadow-lg hover:shadow-[#25D366]/30 active:scale-[0.98] transition-all duration-300 cursor-pointer font-sans"
          >
            {/* Capa de relleno que se pinta de izquierda a derecha al hacer hover con el verde brillante oficial de WhatsApp */}
            <span
              className="absolute inset-0 bg-[#25D366] -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out pointer-events-none"
              aria-hidden="true"
            />

            {/* Icono Oficial de WhatsApp */}
            <div className="relative z-10 shrink-0 flex items-center justify-center">
              <WhatsAppIcon className="w-5 h-5 fill-current transition-transform duration-300 group-hover:scale-110 drop-shadow-xs" />
            </div>

            <span className="relative z-10 tracking-tight drop-shadow-xs">
              {paymentMethod === 'transferencia' ? 'Enviar pedido y comprobante' : 'Enviar pedido por WhatsApp'}
            </span>
          </motion.button>
        )}
      </div>
    </div>
  );
};

export default OrderSummary;
