import React, { useRef } from 'react';
import { Store, Bike, Wallet, CreditCard, CheckCircle2, AlertCircle, ShoppingBag } from 'lucide-react';
import type { CartItem, MenuItem } from '../../types';
import PromoProgressBar from './PromoProgressBar';
import CartItemList from './CartItemList';
import PaymentDetails from './PaymentDetails';
import OrderSummary from './OrderSummary';
import { formatPrice } from '../../utils/formatters';

interface CartContentProps {
  cart: CartItem[];
  allMenuItems?: MenuItem[];
  updateQuantity: (id: string, delta: number) => void;
  onRemoveProduct: (item: CartItem) => void;
  onAddToCart?: (item: MenuItem) => void;
  checkout: any;
  onClose?: () => void;
  showSummary?: boolean;
}

export const CartContent: React.FC<CartContentProps> = ({
  cart,
  allMenuItems: _allMenuItems = [],
  updateQuantity,
  onRemoveProduct,
  onAddToCart: _onAddToCart,
  checkout,
  onClose: _onClose,
  showSummary = true,
}) => {
  const zoneSelectRef = useRef<HTMLSelectElement>(null);
  const addressInputRef = useRef<HTMLInputElement>(null);

  const handleFocusMissingField = () => {
    if (!checkout.zone || checkout.zone.trim() === '') {
      zoneSelectRef.current?.focus();
      zoneSelectRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      zoneSelectRef.current?.classList.add('ring-2', 'ring-[#D9532F]', 'animate-pulse');
      setTimeout(() => zoneSelectRef.current?.classList.remove('ring-2', 'ring-[#D9532F]', 'animate-pulse'), 2200);
    } else if (!checkout.address.trim()) {
      addressInputRef.current?.focus();
      addressInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      addressInputRef.current?.classList.add('ring-2', 'ring-[#D9532F]', 'animate-pulse');
      setTimeout(() => addressInputRef.current?.classList.remove('ring-2', 'ring-[#D9532F]', 'animate-pulse'), 2200);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 px-4 text-center h-full">
        <div className="w-12 h-12 rounded-2xl bg-[#FAF1ED] border border-[#EADBD5] flex items-center justify-center text-[#D9532F] shadow-2xs mb-2.5">
          <ShoppingBag className="w-5 h-5 stroke-[2]" />
        </div>
        <h3 className="text-stone-900 font-semibold text-sm mb-0.5">Tu carrito está vacío</h3>
        <p className="text-stone-500 text-xs max-w-[210px] leading-relaxed">
          Sumá tus platos favoritos para armar tu pedido
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* 1. Gamificación de Promoción Activa */}
      <PromoProgressBar
        bannerPromo={checkout.bannerPromo}
        productPromo={checkout.productPromo}
        isFreeShippingActive={checkout.isFreeShippingActive}
        selectedZoneCost={checkout.selectedZoneObj?.Costo}
      />

      {/* 2. Tu Pedido */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-stone-800">
            Tu pedido
          </span>
          <span className="text-[11px] font-semibold text-stone-500 tabular-nums">
            {checkout.totalItems} {checkout.totalItems === 1 ? 'ítem' : 'ítems'}
          </span>
        </div>

        <CartItemList
          cart={cart}
          updateQuantity={updateQuantity}
          onRemoveProduct={onRemoveProduct}
          productPromo={checkout.productPromo}
          productDiscountAmount={checkout.productDiscountAmount}
        />
      </section>

      {/* 3. ¿Cómo lo recibís? (Segmented Control) */}
      <section className="space-y-3 pt-3 border-t border-stone-100">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-stone-800">
            ¿Cómo lo recibís?
          </span>
          {checkout.soloTakeaway && (
            <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
              Modo lluvia activo
            </span>
          )}
        </div>

        {/* Segmented Control */}
        <div className="grid grid-cols-2 gap-1 bg-stone-100 p-1 rounded-xl border border-stone-200/60">
          <button
            type="button"
            onClick={() => checkout.setDeliveryType('takeaway')}
            className={`py-2 px-3 rounded-lg font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
              checkout.deliveryType === 'takeaway'
                ? 'bg-white text-stone-900 font-bold shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Store className="w-3.5 h-3.5 text-[#D9532F]" />
            <span>Retiro por local</span>
          </button>

          {!checkout.soloTakeaway && (
            <button
              type="button"
              onClick={() => checkout.setDeliveryType('delivery')}
              className={`py-2 px-3 rounded-lg font-semibold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                checkout.deliveryType === 'delivery'
                  ? 'bg-white text-stone-900 font-bold shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Bike className="w-3.5 h-3.5 text-[#D9532F]" />
              <span>Delivery</span>
              {checkout.isFreeShippingActive && (
                <span className="text-[9px] font-black uppercase bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded ml-1 border border-emerald-200">
                  Gratis
                </span>
              )}
            </button>
          )}
        </div>

        {/* Campos adicionales de Delivery */}
        {checkout.deliveryType === 'delivery' && !checkout.soloTakeaway && (
          <div className="space-y-2.5 pt-1">
            <div>
              <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                Zona de entrega
              </label>
              <select
                ref={zoneSelectRef}
                value={checkout.zone}
                onChange={(e) => checkout.setZone(e.target.value)}
                className="w-full py-2.5 px-3 rounded-xl bg-white border border-stone-200 text-stone-900 font-medium text-xs outline-none focus:border-[#D9532F] focus:ring-1 focus:ring-[#D9532F]/20 shadow-2xs transition-colors cursor-pointer"
              >
                <option value="" className="text-stone-400">
                  {checkout.isFreeShippingActive
                    ? 'Seleccioná tu zona (¡Envío gratis!)...'
                    : 'Seleccioná una zona de entrega...'}
                </option>
                {checkout.zonasEnvio.map((z: any) => (
                  <option key={z.id} value={z['Nombre de la Zona']}>
                    {z['Nombre de la Zona']} — {checkout.isFreeShippingActive ? 'Gratis' : z.Costo > 0 ? `+${formatPrice(z.Costo)}` : 'Sin cargo'}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                Dirección exacta
              </label>
              <input
                ref={addressInputRef}
                type="text"
                value={checkout.address}
                onChange={(e) => checkout.setAddress(e.target.value)}
                placeholder="Calle, número, depto o referencias..."
                className="w-full py-2.5 px-3 rounded-xl bg-white border border-stone-200 text-stone-900 text-xs outline-none focus:border-[#D9532F] focus:ring-1 focus:ring-[#D9532F]/20 placeholder:text-stone-400 shadow-2xs transition-colors"
              />
            </div>
          </div>
        )}
      </section>

      {/* 5. ¿Cómo preferís pagar? (Segmented Control & Alias) */}
      <section className="space-y-3 pt-3 border-t border-stone-100">
        <span className="text-xs font-bold text-stone-800 block">
          ¿Cómo preferís pagar?
        </span>

        <div className="grid grid-cols-2 gap-1 bg-stone-100 p-1 rounded-xl border border-stone-200/60">
          <button
            type="button"
            onClick={() => checkout.setPaymentMethod('efectivo')}
            className={`py-2 px-3 rounded-lg font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
              checkout.paymentMethod === 'efectivo'
                ? 'bg-white text-stone-900 font-bold shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Wallet className="w-3.5 h-3.5 text-[#D9532F]" />
            <span>Efectivo</span>
          </button>

          <button
            type="button"
            onClick={() => checkout.setPaymentMethod('transferencia')}
            className={`py-2 px-3 rounded-lg font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
              checkout.paymentMethod === 'transferencia'
                ? 'bg-white text-stone-900 font-bold shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5 text-[#D9532F]" />
            <span>Transferencia</span>
          </button>
        </div>

        {checkout.paymentMethod === 'transferencia' && (
          <PaymentDetails
            aliasBancario={checkout.aliasBancario}
            titularCuenta={checkout.titularCuenta}
            copiedAlias={checkout.copiedAlias}
            onCopyAlias={checkout.handleCopyAlias}
          />
        )}
      </section>

      {/* 6. Cupón de Descuento */}
      <section className="space-y-2 pt-3 border-t border-stone-100">
        <span className="text-xs font-bold text-stone-800 block">
          Cupón de descuento
        </span>

        <form onSubmit={checkout.handleApplyCoupon} className="flex gap-2">
          <input
            type="text"
            value={checkout.couponInput}
            onChange={(e) => checkout.setCouponInput(e.target.value)}
            disabled={Boolean(checkout.appliedCoupon)}
            placeholder="Ingresá tu código..."
            className="flex-1 py-2 px-3 rounded-xl bg-white border border-stone-200 text-stone-900 text-xs uppercase font-mono tracking-wider outline-none focus:border-[#D9532F] focus:ring-1 focus:ring-[#D9532F]/20 placeholder:normal-case placeholder:font-sans placeholder:text-stone-400 disabled:opacity-50 shadow-2xs transition-colors"
          />

          {checkout.appliedCoupon ? (
            <button
              type="button"
              onClick={checkout.handleRemoveCoupon}
              className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 border border-stone-200 text-stone-700 text-xs font-semibold transition cursor-pointer"
            >
              Quitar
            </button>
          ) : (
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition cursor-pointer active:scale-95 shadow-xs"
            >
              Aplicar
            </button>
          )}
        </form>

        {checkout.couponFeedback && (
          <p
            className={`text-xs font-medium flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${
              checkout.couponFeedback.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}
          >
            {checkout.couponFeedback.type === 'success' ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
            )}
            <span>{checkout.couponFeedback.message}</span>
          </p>
        )}
      </section>

      {/* 7. Resumen de Totales y Botón Dinámico de WhatsApp (si no está anclado en footer) */}
      {showSummary && (
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
      )}
    </div>
  );
};

export default CartContent;
