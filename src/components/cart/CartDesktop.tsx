import React, { useRef } from 'react';
import {
  ShoppingBag,
  Store,
  Bike,
  Wallet,
  CreditCard,
  AlertCircle,
  ArrowRight,
  Lock,
} from 'lucide-react';
import type { CartItem, MenuItem } from '../../types';
import PromoProgressBar from './PromoProgressBar';
import CartItemList from './CartItemList';
import PaymentDetails from './PaymentDetails';
import { formatPrice } from '../../utils/formatters';
import WhatsAppIcon from '../common/WhatsAppIcon';

interface CartDesktopProps {
  cart: CartItem[];
  allMenuItems?: MenuItem[];
  updateQuantity: (id: string, delta: number) => void;
  onRemoveProduct: (item: CartItem) => void;
  onAddToCart: (item: MenuItem) => void;
  checkout: any;
  headerHeight?: number;
}

export const CartDesktop: React.FC<CartDesktopProps> = ({
  cart,
  updateQuantity,
  onRemoveProduct,
  checkout,
  headerHeight = 119,
}) => {
  const hasItems = cart.length > 0;
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

  return (
    <aside
      aria-label="Comanda y carrito de compras"
      style={{
        top: `${headerHeight}px`,
        maxHeight: `calc(100dvh - ${headerHeight}px - 20px)`,
      }}
      className="flex flex-col w-full sticky lg:h-[770px] z-30 filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.08)] drop-shadow-[0_6px_16px_rgba(0,0,0,0.04)]"
    >
      {/* ============================================================== */}
      {/* CUERPO DEL TICKET: Nace flush desde la navbar con elevación    */}
      {/* ============================================================== */}
      <div className="flex flex-col flex-1 bg-white border-x border-stone-200/90 shadow-[0_8px_30px_rgba(0,0,0,0.05)] overflow-hidden min-h-0">
        {/* ============================================================== */}
        {/* 1. CABECERA TICKET: Título limpio (sin tags) + Badge + Barra   */}
        {/* ============================================================== */}
        <div className="shrink-0 px-4 pt-3.5 pb-2.5 border-b border-stone-100 space-y-2 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#FAF1ED] border border-[#EADBD5] flex items-center justify-center text-[#D9532F] shadow-2xs">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-stone-900 tracking-tight leading-none font-sans">
                  Mi Pedido
                </h2>
                <span className="text-[11px] text-stone-500 font-medium tabular-nums font-sans">
                  {checkout.totalItems} {checkout.totalItems === 1 ? 'producto' : 'productos'}
                </span>
              </div>
            </div>

            {hasItems && (
              <span className="text-xs font-bold text-[#D9532F] bg-[#FAF1ED] border border-[#EADBD5] px-2.5 py-1 rounded-full tabular-nums font-sans">
                {formatPrice(checkout.total)}
              </span>
            )}
          </div>

          {/* Barra de progreso de envío gratis fija al tope */}
          {hasItems && (
            <PromoProgressBar
              bannerPromo={checkout.bannerPromo}
              productPromo={checkout.productPromo}
              isFreeShippingActive={checkout.isFreeShippingActive}
              selectedZoneCost={checkout.selectedZoneObj?.Costo}
            />
          )}
        </div>

        {/* ============================================================== */}
        {/* 2. ZONA CENTRAL SCROLLABLE: Ítems y formularios con espacio    */}
        {/* ============================================================== */}
        <div className="flex-1 overflow-y-auto px-4.5 py-4 custom-scrollbar min-h-0 overscroll-contain space-y-4">
          {!hasItems ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center h-full my-auto select-none">
              <div className="w-12 h-12 rounded-2xl bg-stone-100 border border-stone-200/70 flex items-center justify-center text-stone-400 mb-3">
                <ShoppingBag className="w-5 h-5 stroke-[1.8]" />
              </div>
              <h3 className="text-stone-900 font-bold text-sm mb-1 font-sans">Tu comanda está vacía</h3>
              <p className="text-stone-500 text-xs max-w-[210px] leading-relaxed font-sans mb-4">
                Sumá tus platos favoritos de la carta para comenzar tu pedido
              </p>
              {/* Código de barras decorativo minimalista de ticket gastronómico */}
              <div className="flex items-center gap-[3px] opacity-25" aria-hidden="true">
                <span className="w-[2px] h-5 bg-stone-900" />
                <span className="w-[1px] h-5 bg-stone-900" />
                <span className="w-[3px] h-5 bg-stone-900" />
                <span className="w-[1px] h-5 bg-stone-900" />
                <span className="w-[2px] h-5 bg-stone-900" />
                <span className="w-[4px] h-5 bg-stone-900" />
                <span className="w-[1px] h-5 bg-stone-900" />
                <span className="w-[2px] h-5 bg-stone-900" />
                <span className="w-[3px] h-5 bg-stone-900" />
                <span className="w-[1px] h-5 bg-stone-900" />
                <span className="w-[2px] h-5 bg-stone-900" />
              </div>
            </div>
          ) : (
            <>
              {/* Lista de productos */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-800 font-sans">Tu selección</span>
                  <span className="text-[11px] font-medium text-stone-400 tabular-nums">
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
              </div>

              {/* Selector de Entrega (Retiro / Delivery) con divisores sutiles y mayor espaciado */}
              <div className="space-y-2.5 pt-3.5 border-t border-stone-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-800 font-sans">¿Cómo lo recibís?</span>
                  {checkout.soloTakeaway && (
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200 font-sans">
                      Modo lluvia
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-1.5 bg-stone-100/90 p-1 rounded-xl border border-stone-200/50">
                  <button
                    type="button"
                    onClick={() => checkout.setDeliveryType('takeaway')}
                    className={`py-2 px-3 rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer font-sans ${
                      checkout.deliveryType === 'takeaway'
                        ? 'bg-white text-stone-900 shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    <Store className="w-4 h-4 text-[#D9532F]" />
                    <span>Retiro en local</span>
                  </button>

                  {!checkout.soloTakeaway && (
                    <button
                      type="button"
                      onClick={() => checkout.setDeliveryType('delivery')}
                      className={`py-2 px-3 rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer font-sans ${
                        checkout.deliveryType === 'delivery'
                          ? 'bg-white text-stone-900 shadow-xs'
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      <Bike className="w-4 h-4 text-[#D9532F]" />
                      <span>Delivery</span>
                      {checkout.isFreeShippingActive && (
                        <span className="text-[9px] font-black uppercase bg-emerald-100 text-emerald-800 px-1 py-0.5 rounded ml-0.5 border border-emerald-200 font-sans">
                          Gratis
                        </span>
                      )}
                    </button>
                  )}
                </div>

                {/* Campos extendidos de Delivery (Zona y Dirección) */}
                {checkout.deliveryType === 'delivery' && !checkout.soloTakeaway && (
                  <div className="space-y-2 pt-1">
                    <select
                      ref={zoneSelectRef}
                      value={checkout.zone}
                      onChange={(e) => checkout.setZone(e.target.value)}
                      className="w-full py-2 px-3 rounded-xl bg-white border border-stone-200 text-stone-900 font-medium text-xs outline-none focus:border-[#D9532F] focus:ring-1 focus:ring-[#D9532F]/20 shadow-2xs transition-colors cursor-pointer font-sans"
                    >
                      <option value="" className="text-stone-400">
                        {checkout.isFreeShippingActive
                          ? 'Seleccioná tu zona (¡Envío gratis!)...'
                          : 'Seleccioná zona de entrega...'}
                      </option>
                      {checkout.zonasEnvio.map((z: any) => (
                        <option key={z.id} value={z['Nombre de la Zona']}>
                          {z['Nombre de la Zona']} — {checkout.isFreeShippingActive ? 'Gratis' : z.Costo > 0 ? `+${formatPrice(z.Costo)}` : 'Sin cargo'}
                        </option>
                      ))}
                    </select>

                    <input
                      ref={addressInputRef}
                      type="text"
                      value={checkout.address}
                      onChange={(e) => checkout.setAddress(e.target.value)}
                      placeholder="Calle, número, piso/depto..."
                      className="w-full py-2 px-3 rounded-xl bg-white border border-stone-200 text-stone-900 text-xs outline-none focus:border-[#D9532F] focus:ring-1 focus:ring-[#D9532F]/20 placeholder:text-stone-400 shadow-2xs transition-colors font-sans"
                    />
                  </div>
                )}
              </div>

              {/* Selector de Pago (Efectivo / Transferencia) */}
              <div className="space-y-2.5 pt-3.5 border-t border-stone-100">
                <span className="text-xs font-bold text-stone-800 font-sans block">¿Cómo preferís pagar?</span>
                <div className="grid grid-cols-2 gap-1.5 bg-stone-100/90 p-1 rounded-xl border border-stone-200/50">
                  <button
                    type="button"
                    onClick={() => checkout.setPaymentMethod('efectivo')}
                    className={`py-2 px-3 rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer font-sans ${
                      checkout.paymentMethod === 'efectivo'
                        ? 'bg-white text-stone-900 shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    <Wallet className="w-4 h-4 text-[#D9532F]" />
                    <span>Efectivo</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => checkout.setPaymentMethod('transferencia')}
                    className={`py-2 px-3 rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer font-sans ${
                      checkout.paymentMethod === 'transferencia'
                        ? 'bg-white text-stone-900 shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-[#D9532F]" />
                    <span>Transferencia</span>
                  </button>
                </div>

                {/* Campos extendidos de Transferencia (Alias, CBU, Titular) */}
                {checkout.paymentMethod === 'transferencia' && (
                  <PaymentDetails
                    aliasBancario={checkout.aliasBancario}
                    titularCuenta={checkout.titularCuenta}
                    copiedAlias={checkout.copiedAlias}
                    onCopyAlias={checkout.handleCopyAlias}
                  />
                )}
              </div>

              {/* Desglose de Totales intermedio (Subtotal, Descuentos, Envío) */}
              <div className="pt-3.5 border-t border-stone-100 space-y-2 text-xs text-stone-600 font-sans">
                <div className="flex justify-between items-center">
                  <span className="text-stone-500">Subtotal productos:</span>
                  <span className="font-semibold text-stone-800 tabular-nums">{formatPrice(checkout.subtotal)}</span>
                </div>
                {checkout.productPromo && checkout.productDiscountAmount > 0 && (
                  <div className="flex justify-between items-center text-emerald-700 font-semibold">
                    <span>Descuento {checkout.productPromo.description}:</span>
                    <span className="tabular-nums">-{formatPrice(checkout.productDiscountAmount)}</span>
                  </div>
                )}
                {checkout.appliedCoupon && checkout.percentDiscountAmount > 0 && (
                  <div className="flex justify-between items-center text-emerald-700 font-semibold">
                    <span>Cupón ({checkout.appliedCoupon.code}):</span>
                    <span className="tabular-nums">-{formatPrice(checkout.percentDiscountAmount)}</span>
                  </div>
                )}
                {!checkout.appliedCoupon && checkout.bannerPromo?.discountPercent > 0 && checkout.percentDiscountAmount > 0 && (
                  <div className="flex justify-between items-center text-emerald-700 font-semibold">
                    <span>Descuento promo ({checkout.bannerPromo.discountPercent}%):</span>
                    <span className="tabular-nums">-{formatPrice(checkout.percentDiscountAmount)}</span>
                  </div>
                )}
                {checkout.deliveryType === 'delivery' && (
                  <div className="flex justify-between items-center">
                    <span className="text-stone-500">
                      Costo de envío {checkout.selectedZoneObj ? `(${checkout.selectedZoneObj['Nombre de la Zona']})` : ''}:
                    </span>
                    <span className="font-semibold text-stone-800 tabular-nums">
                      {checkout.isFreeShippingActive ? (
                        <span className="text-emerald-700 font-bold">Gratis</span>
                      ) : checkout.selectedZoneObj ? (
                        checkout.deliveryFee > 0 ? `+${formatPrice(checkout.deliveryFee)}` : 'Sin cargo'
                      ) : (
                        <span className="text-stone-400 font-normal italic">A seleccionar zona</span>
                      )}
                    </span>
                  </div>
                )}
                {checkout.deliveryType === 'takeaway' && (
                  <div className="flex justify-between items-center text-stone-500">
                    <span>Retiro por local:</span>
                    <span className="text-stone-700 font-semibold">Sin costo</span>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* ============================================================== */}
        {/* 3. FOOTER ANCLADO Y PERMANENTE: TOTAL + BOTÓN WHATSAPP         */}
        {/* ============================================================== */}
        {hasItems && (
          <div className="shrink-0 px-4 pt-2.5 pb-3 border-t border-stone-200/80 bg-white space-y-2 shadow-[0_-4px_16px_rgba(0,0,0,0.03)] z-10">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-stone-900 font-sans">Total a pagar:</span>
              <span className="text-lg sm:text-xl font-bold text-stone-900 tabular-nums font-sans">
                {formatPrice(checkout.total)}
              </span>
            </div>

            <div>
              {!checkout.localAbierto ? (
                <div className="space-y-1">
                  <button
                    type="button"
                    disabled
                    className="w-full h-11 rounded-xl bg-stone-100 text-stone-500 border border-stone-200 font-semibold text-xs flex items-center justify-center gap-2 cursor-not-allowed opacity-80 font-sans"
                  >
                    <Lock className="w-4 h-4 text-stone-400 shrink-0" />
                    <span>Local cerrado momentáneamente</span>
                  </button>
                  <p className="text-[10px] text-stone-500 text-center font-medium font-sans">
                    Horarios: <span className="text-stone-700 font-semibold">{checkout.horariosAtencion}</span>
                  </p>
                </div>
              ) : checkout.isDeliveryIncomplete ? (
                <button
                  type="button"
                  onClick={handleFocusMissingField}
                  className="w-full h-11 rounded-xl bg-[#FAF1ED] hover:bg-[#F3E2DB] border border-[#EADBD5] text-[#D9532F] font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs group font-sans active:scale-[0.98]"
                >
                  <AlertCircle className="w-4 h-4 text-[#D9532F] shrink-0" />
                  <span>Completá tu dirección para pedir</span>
                  <ArrowRight className="w-4 h-4 text-[#D9532F] shrink-0" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={checkout.sendOrderToWhatsApp}
                  disabled={!checkout.isOrderValid}
                  className="relative group overflow-hidden w-full h-11 rounded-xl bg-[#14532D] text-white font-bold text-sm flex items-center justify-center gap-2.5 shadow-md shadow-emerald-950/20 hover:shadow-lg hover:shadow-[#25D366]/30 active:scale-[0.98] transition-all duration-300 cursor-pointer font-sans"
                >
                  {/* Capa de relleno que se pinta de izquierda a derecha al hacer hover con el verde brillante oficial de WhatsApp */}
                  <span
                    className="absolute inset-0 bg-[#25D366] -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out pointer-events-none"
                    aria-hidden="true"
                  />

                  {/* Icono Oficial de WhatsApp */}
                  <div className="relative z-10 shrink-0 flex items-center justify-center">
                    <WhatsAppIcon className="w-4.5 h-4.5 fill-current transition-transform duration-300 group-hover:scale-110 drop-shadow-xs" />
                  </div>

                  <span className="relative z-10 tracking-tight drop-shadow-xs">
                    {checkout.paymentMethod === 'transferencia' ? 'Enviar pedido y comprobante' : 'Enviar pedido por WhatsApp'}
                  </span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* 4. TROQUELADO EN ZIGZAG: Dientes de corte de ticket            */}
      {/* ============================================================== */}
      <div className="w-full h-3 overflow-hidden shrink-0 select-none pointer-events-none -mt-px relative z-10 leading-none">
        <svg viewBox="0 0 100 10" preserveAspectRatio="none" className="w-full h-full block">
          <polygon
            points="0,0 2,10 4,0 6,10 8,0 10,10 12,0 14,10 16,0 18,10 20,0 22,10 24,0 26,10 28,0 30,10 32,0 34,10 36,0 38,10 40,0 42,10 44,0 46,10 48,0 50,10 52,0 54,10 56,0 58,10 60,0 62,10 64,0 66,10 68,0 70,10 72,0 74,10 76,0 78,10 80,0 82,10 84,0 86,10 88,0 90,10 92,0 94,10 96,0 98,10 100,0 100,0 0,0"
            fill="#FFFFFF"
          />
          <polyline
            points="0,0 2,10 4,0 6,10 8,0 10,10 12,0 14,10 16,0 18,10 20,0 22,10 24,0 26,10 28,0 30,10 32,0 34,10 36,0 38,10 40,0 42,10 44,0 46,10 48,0 50,10 52,0 54,10 56,0 58,10 60,0 62,10 64,0 66,10 68,0 70,10 72,0 74,10 76,0 78,10 80,0 82,10 84,0 86,10 88,0 90,10 92,0 94,10 96,0 98,10 100,0"
            fill="none"
            stroke="#D1D5DB"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </aside>
  );
};

export default CartDesktop;
