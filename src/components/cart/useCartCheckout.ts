import { useState, useEffect, useMemo, useCallback } from 'react';
import type { DeliveryZoneData, ConfigData, CouponData } from '../../types/airtable';
import type { CartItem, ClientData } from '../../types';
import { parsePrice, formatPrice } from '../../utils/formatters';

export interface UseCartCheckoutProps {
  cart: CartItem[];
  data?: ClientData;
  configuracion?: ConfigData | null;
  zonasEnvio?: DeliveryZoneData[];
  cupones?: CouponData[];
  bannerText?: string | null;
  updateQuantity: (id: string, delta: number) => void;
  removeItem?: (id: string) => void;
  externalDeliveryType?: 'takeaway' | 'delivery';
  onDeliveryTypeChange?: (type: 'takeaway' | 'delivery') => void;
}

export function useCartCheckout({
  cart = [],
  data,
  configuracion: propConfig,
  zonasEnvio: propZonas,
  cupones: propCupones,
  bannerText: propBannerText,
  updateQuantity,
  removeItem,
  externalDeliveryType,
  onDeliveryTypeChange,
}: UseCartCheckoutProps) {
  // Configuración global proveniente de Airtable o fallback
  const configuracion: ConfigData | null =
    propConfig || (data as any)?.configuracion || null;

  const localAbierto = configuracion
    ? Boolean(configuracion['Local Abierto'] ?? configuracion.localAbierto)
    : true;

  const soloTakeaway = Boolean(
    configuracion?.['Solo Takeaway (Modo Lluvia)'] ??
    configuracion?.soloTakeaway ??
    (data as any)?.config?.soloTakeaway ??
    false
  );

  const aliasBancario = String(
    configuracion?.['Alias Bancario'] ||
    configuracion?.aliasBancario ||
    'SU.BURGER.MP'
  ).trim();

  const titularCuenta = String(
    configuracion?.['Titular Cuenta'] ||
    configuracion?.titularCuenta ||
    'Juan Pérez'
  ).trim();

  const horariosAtencion = String(
    configuracion?.['Horarios de Atención'] ||
    configuracion?.horariosAtencion ||
    'Martes a Domingo: 19:30 a 00:00 hs'
  ).trim();

  const whatsapp = String(
    configuracion?.['WhatsApp Pedidos'] ||
    configuracion?.whatsappPedidos ||
    data?.contact?.whatsapp ||
    '5491123456789'
  ).trim();

  // Zonas de envío normalizadas
  const zonasEnvio: DeliveryZoneData[] = useMemo(() => {
    const fallbackZones = (data as any)?.zonasEnvio || data?.config?.deliveryZones || [];
    const list = propZonas && propZonas.length > 0 ? propZonas : fallbackZones;

    return list.map((z: any, idx: number) => ({
      id: z.id || z.name || z['Nombre de la Zona'] || `zone-${idx}`,
      'Nombre de la Zona': z['Nombre de la Zona'] || z.name || '',
      Costo: Number(z.Costo ?? z.price ?? z.costo ?? 0),
      Disponible: z.Disponible !== false,
      nombre: z['Nombre de la Zona'] || z.name || '',
      costo: Number(z.Costo ?? z.price ?? z.costo ?? 0),
    })).filter((z: DeliveryZoneData) => z.Disponible === true);
  }, [propZonas, data]);

  // Cupones activos normalizados
  const cuponesActivos: CouponData[] = useMemo(() => {
    const fallbackCupones = (data as any)?.cupones || [];
    const list = propCupones && propCupones.length > 0 ? propCupones : fallbackCupones;

    return list.filter((c: any) => c.Activo === true || c.activo === true);
  }, [propCupones, data]);

  // Banner Promocional y detección automática del beneficio
  const effectiveBannerText = String(
    propBannerText ||
    configuracion?.['Banner Promocional'] ||
    configuracion?.bannerPromocional ||
    ''
  ).trim();

  const bannerPromo = useMemo(() => {
    if (!effectiveBannerText) return null;
    const clean = effectiveBannerText.trim();
    const text = clean.toLowerCase();

    const isFreeShipping =
      text.includes('envio gratis') ||
      text.includes('envío gratis') ||
      text.includes('delivery gratis') ||
      text.includes('envio sin cargo') ||
      text.includes('envío sin cargo') ||
      text.includes('sin costo de envio') ||
      text.includes('sin costo de envío') ||
      text.includes('free delivery') ||
      text.includes('free shipping');

    const nxmMatch = clean.match(/(\d+)\s*x\s*(\d+)(?:\s+en|\s+de)?\s+["'«“]?([^"'»”]+?)["'»”]?$/i);
    let nxm = null;
    if (nxmMatch) {
      const buyQty = parseInt(nxmMatch[1], 10);
      const payQty = parseInt(nxmMatch[2], 10);
      const targetQuery = nxmMatch[3].trim();
      if (buyQty > payQty && payQty > 0 && targetQuery) {
        nxm = { buyQty, payQty, freePerGroup: buyQty - payQty, targetQuery };
      }
    }

    let gift = null;
    if (!isFreeShipping) {
      const giftMatch =
        clean.match(/(.+?)\s+de\s+regalo/i) ||
        clean.match(/regalo(?:\s+de)?\s+(.+)/i) ||
        clean.match(/(.+?)\s+gratis/i);
      if (giftMatch) {
        const targetQuery = giftMatch[1].trim();
        gift = { targetQuery };
      }
    }

    const percentMatch = clean.match(/(\d+)\s*%/);
    const discountPercent = percentMatch ? parseInt(percentMatch[1], 10) : 0;

    return {
      raw: clean,
      isFreeShipping,
      nxm,
      gift,
      discountPercent,
    };
  }, [effectiveBannerText]);

  const normStr = (s: string) =>
    (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();

  const matchItemTarget = useCallback((item: CartItem, target: string): boolean => {
    const nTarget = normStr(target);
    const nCat = normStr(item.category || '');
    const nTitle = normStr(item.title || '');

    if (
      nCat === nTarget ||
      nCat.replace(/s$/, '') === nTarget.replace(/s$/, '') ||
      nCat.includes(nTarget) ||
      nTarget.includes(nCat)
    ) {
      return true;
    }

    if (nTarget.includes('bebid') || nTarget.includes('trago') || nTarget.includes('gaseosa')) {
      if (nCat.includes('bebid')) return true;
      if (nTitle.match(/coca|pepsi|sprite|fanta|agua|cerveza|gaseosa|jugo|heineken|crystal|corona/i)) {
        return true;
      }
    }

    if (nTitle.includes(nTarget) || nTarget.includes(nTitle)) {
      return true;
    }

    return false;
  }, []);

  const parseTargetList = (str: string): string[] => {
    return str
      .split(/,|\s+y\s+|\s+e\s+|\s+o\s+|&/i)
      .map((s) => s.trim().replace(/^["'«“]|["'»”]$/g, ''))
      .filter(Boolean);
  };

  // Motor de Promociones de Producto (NxM, 50% 2da unidad, combo regalo, regalo simple)
  const productPromo = useMemo(() => {
    if (!bannerPromo || cart.length === 0) return null;
    const clean = bannerPromo.raw;

    // CASO 1: Combo regalo
    const comboGiftMatch =
      clean.match(/llevando\s+(\d+)\s+(.+?)(?:\s+x|\s*,|\s+con|\s*[-–])\s+(?:una\s+|1\s+)?(.+?)\s+(?:a\s+elecci[oó]n\s+)?(?:de\s+regalo|gratis)/i) ||
      clean.match(/con\s+(?:la\s+compra\s+de\s+)?(\d+)\s+(.+?)(?:\s*,|\s+te\s+llev[aá]s|\s+llevate|\s+con|\s*[-–])\s+(?:una\s+|1\s+)?(.+?)\s+(?:a\s+elecci[oó]n\s+)?(?:de\s+regalo|gratis)/i);

    if (comboGiftMatch) {
      const requiredQty = parseInt(comboGiftMatch[1], 10);
      const sourceTarget = comboGiftMatch[2].trim();
      const giftTarget = comboGiftMatch[3].trim();

      const sourceCount = cart
        .filter((i) => matchItemTarget(i, sourceTarget))
        .reduce((sum, i) => sum + i.quantity, 0);

      const giftItem = cart.find((i) => matchItemTarget(i, giftTarget));

      if (sourceCount >= requiredQty) {
        if (giftItem) {
          const discountAmount = parsePrice(giftItem.price);
          return {
            type: 'combo_gift' as const,
            discountAmount,
            discountedItem: giftItem,
            fullProductName: giftItem.title,
            description: `Bebida de regalo (${giftItem.title})`,
            badgeText: `1u de regalo por promo combo`,
            statusText: `Bebida de regalo aplicada a ${giftItem.title} (-${formatPrice(discountAmount)})`,
            isFullyApplied: true,
            progressCurrent: sourceCount,
            progressTarget: requiredQty,
            motivationalText: `¡Genial! Desbloqueaste una ${giftTarget} de regalo con tu pedido.`,
          };
        } else {
          return {
            type: 'combo_gift' as const,
            discountAmount: 0,
            discountedItem: null,
            fullProductName: '',
            description: `${giftTarget} de regalo`,
            badgeText: '',
            statusText: `¡Tenés una ${giftTarget} de regalo! Agregá cualquier ${giftTarget.toLowerCase()} al pedido para recibirla gratis.`,
            isFullyApplied: false,
            progressCurrent: sourceCount,
            progressTarget: requiredQty,
            motivationalText: `¡Alcanzaste la meta! Sumá una ${giftTarget.toLowerCase()} al carrito para que sea gratis.`,
          };
        }
      } else {
        const missing = requiredQty - sourceCount;
        return {
          type: 'combo_gift' as const,
          discountAmount: 0,
          discountedItem: null,
          fullProductName: '',
          description: `Llevando ${requiredQty} ${sourceTarget}`,
          badgeText: '',
          statusText: `Agregá ${missing} ${missing === 1 ? 'producto más' : 'productos más'} de ${sourceTarget} para llevarte una ${giftTarget} de regalo.`,
          isFullyApplied: false,
          progressCurrent: sourceCount,
          progressTarget: requiredQty,
          motivationalText: `Estás a solo ${missing} ${missing === 1 ? 'unidad' : 'unidades'} de ${sourceTarget} de tu ${giftTarget} de regalo.`,
        };
      }
    }

    // CASO 2: Segunda unidad %
    const secondUnitMatch = clean.match(
      /(\d+)\s*%\s+en\s+la\s+(?:segunda|2da|2°|2da\.)\s+unidad\s+de\s+(.+)/i
    );
    if (secondUnitMatch) {
      const discountPct = parseInt(secondUnitMatch[1], 10);
      const targetsStr = secondUnitMatch[2].trim();
      const targets = parseTargetList(targetsStr);

      const eligibleUnits: { item: CartItem; price: number }[] = [];
      cart.forEach((item) => {
        if (targets.some((t) => matchItemTarget(item, t))) {
          const price = parsePrice(item.price);
          for (let i = 0; i < item.quantity; i++) {
            eligibleUnits.push({ item, price });
          }
        }
      });

      if (eligibleUnits.length >= 2) {
        const pairs = Math.floor(eligibleUnits.length / 2);
        eligibleUnits.sort((a, b) => a.price - b.price);
        const discountedUnits = eligibleUnits.slice(0, pairs);
        const discountAmount = discountedUnits.reduce(
          (acc, u) => acc + Math.round((u.price * discountPct) / 100),
          0
        );
        const fullProductName = Array.from(new Set(discountedUnits.map((u) => u.item.title))).join(', ');
        return {
          type: 'second_unit' as const,
          discountAmount,
          discountedItem: discountedUnits[0].item,
          fullProductName,
          description: `${discountPct}% 2da unidad (${fullProductName})`,
          badgeText: `${discountPct}% OFF en 2da unidad`,
          statusText: `${discountPct}% en 2da unidad aplicado a ${fullProductName} (-${formatPrice(discountAmount)})`,
          isFullyApplied: true,
          progressCurrent: eligibleUnits.length,
          progressTarget: 2,
          motivationalText: `¡Promo desbloqueada! ${discountPct}% OFF aplicado en la 2da unidad.`,
        };
      } else {
        return {
          type: 'second_unit' as const,
          discountAmount: 0,
          discountedItem: null,
          fullProductName: '',
          description: `${discountPct}% en 2da unidad de ${targetsStr}`,
          badgeText: '',
          statusText: `Agregá 1 unidad más de ${targetsStr} para obtener el ${discountPct}% en la 2da unidad.`,
          isFullyApplied: false,
          progressCurrent: eligibleUnits.length,
          progressTarget: 2,
          motivationalText: `¡Estás a solo 1 ${targetsStr} del ${discountPct}% OFF en tu pedido!`,
        };
      }
    }

    // CASO 3: NxM Multi-categoría
    const nxmMatch = clean.match(/(\d+)\s*x\s*(\d+)(?:\s+en|\s+de)?\s+(.+)/i);
    if (nxmMatch) {
      const buyQty = parseInt(nxmMatch[1], 10);
      const payQty = parseInt(nxmMatch[2], 10);
      const targetsStr = nxmMatch[3].trim();
      const targets = parseTargetList(targetsStr);

      const eligibleUnits: { item: CartItem; price: number }[] = [];
      cart.forEach((item) => {
        if (targets.some((t) => matchItemTarget(item, t))) {
          const price = parsePrice(item.price);
          for (let i = 0; i < item.quantity; i++) {
            eligibleUnits.push({ item, price });
          }
        }
      });

      if (eligibleUnits.length >= buyQty) {
        const groups = Math.floor(eligibleUnits.length / buyQty);
        const freeCount = groups * (buyQty - payQty);
        eligibleUnits.sort((a, b) => a.price - b.price);
        const discountedUnits = eligibleUnits.slice(0, freeCount);
        const discountAmount = discountedUnits.reduce((acc, u) => acc + u.price, 0);
        const fullProductName = Array.from(new Set(discountedUnits.map((u) => u.item.title))).join(', ');
        return {
          type: 'nxm' as const,
          discountAmount,
          discountedItem: discountedUnits[0].item,
          fullProductName,
          description: `Promoción ${buyQty}x${payQty} (${fullProductName})`,
          badgeText: `1u bonificada por promo ${buyQty}x${payQty}`,
          statusText: `Promo ${buyQty}x${payQty} aplicada a ${fullProductName} (-${formatPrice(discountAmount)})`,
          isFullyApplied: true,
          progressCurrent: eligibleUnits.length % buyQty === 0 ? buyQty : eligibleUnits.length % buyQty,
          progressTarget: buyQty,
          motivationalText: `¡Promo desbloqueada! ${buyQty}x${payQty} aplicada en ${fullProductName}.`,
        };
      } else {
        const missing = buyQty - eligibleUnits.length;
        return {
          type: 'nxm' as const,
          discountAmount: 0,
          discountedItem: null,
          fullProductName: '',
          description: `Promoción ${buyQty}x${payQty} en ${targetsStr}`,
          badgeText: '',
          statusText: `Agregá ${missing} ${missing === 1 ? 'producto más' : 'productos más'} de ${targetsStr} para activar la promo ${buyQty}x${payQty}.`,
          isFullyApplied: false,
          progressCurrent: eligibleUnits.length,
          progressTarget: buyQty,
          motivationalText: `¡Estás a solo ${missing} ${missing === 1 ? 'unidad' : 'unidades'} de activar la promo ${buyQty}x${payQty}!`,
        };
      }
    }

    // CASO 4: Regalo simple
    if (bannerPromo.gift) {
      const query = bannerPromo.gift.targetQuery;
      const eligibleItem = cart.find((i) => matchItemTarget(i, query));

      if (eligibleItem) {
        const unitPrice = parsePrice(eligibleItem.price);
        const fullProductName = eligibleItem.title;
        return {
          type: 'simple_gift' as const,
          discountAmount: unitPrice,
          discountedItem: eligibleItem,
          fullProductName,
          description: `Bebida de regalo (${fullProductName})`,
          badgeText: `1u de regalo (${fullProductName})`,
          statusText: `Bebida de regalo aplicada: ${fullProductName} (-${formatPrice(unitPrice)})`,
          isFullyApplied: true,
          progressCurrent: 1,
          progressTarget: 1,
          motivationalText: `¡Genial! Tu ${query} de regalo ya está bonificada.`,
        };
      } else {
        return {
          type: 'simple_gift' as const,
          discountAmount: 0,
          discountedItem: null,
          fullProductName: '',
          description: `${query} de regalo`,
          badgeText: '',
          statusText: `¡Tenés una ${query} de regalo! Agregá cualquier ${query.toLowerCase()} a tu pedido para recibirla gratis.`,
          isFullyApplied: false,
          progressCurrent: 0,
          progressTarget: 1,
          motivationalText: `¡Tenés una ${query} de regalo disponible! Sumala al pedido con 1 clic.`,
        };
      }
    }

    return null;
  }, [bannerPromo, cart, matchItemTarget]);

  // ESTADOS DEL CHECKOUT
  const [internalDeliveryType, setInternalDeliveryType] = useState<'takeaway' | 'delivery'>('takeaway');
  const deliveryType = externalDeliveryType ?? internalDeliveryType;

  const setDeliveryType = useCallback((type: 'takeaway' | 'delivery') => {
    if (onDeliveryTypeChange) {
      onDeliveryTypeChange(type);
    }
    setInternalDeliveryType(type);
  }, [onDeliveryTypeChange]);

  const [zone, setZone] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'efectivo' | 'transferencia'>('efectivo');

  // Estado del Motor de Cupones
  const [couponInput, setCouponInput] = useState<string>('');
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountPercentage: number;
  } | null>(null);
  const [couponFeedback, setCouponFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Estado de Copia de Alias
  const [copiedAlias, setCopiedAlias] = useState<boolean>(false);

  // Auto-selección de Delivery si el banner ofrece Envío Gratis
  useEffect(() => {
    if (bannerPromo?.isFreeShipping && !soloTakeaway) {
      setDeliveryType('delivery');
    }
  }, [bannerPromo?.isFreeShipping, soloTakeaway, setDeliveryType]);

  // Si el texto del banner menciona un cupón activo, auto-aplicarlo
  useEffect(() => {
    if (!appliedCoupon && cuponesActivos.length > 0 && effectiveBannerText) {
      const upperText = effectiveBannerText.toUpperCase();
      const matchedCoupon = cuponesActivos.find((c) => {
        const code = (c.Codigo || c.codigo || '').trim().toUpperCase();
        return code.length >= 3 && upperText.includes(code);
      });
      if (matchedCoupon) {
        const discountPercentage = Number(
          matchedCoupon['Descuento Porcentaje'] ?? matchedCoupon.descuentoPorcentaje ?? 0
        );
        setAppliedCoupon({
          code: matchedCoupon.Codigo || matchedCoupon.codigo,
          discountPercentage,
        });
        setCouponFeedback({
          type: 'success',
          message: `Cupón ${matchedCoupon.Codigo || matchedCoupon.codigo} del banner aplicado automáticamente: ${discountPercentage}% de descuento.`,
        });
      }
    }
  }, [effectiveBannerText, cuponesActivos, appliedCoupon]);

  // Forzar Takeaway si el Modo Lluvia está encendido
  useEffect(() => {
    if (soloTakeaway && deliveryType === 'delivery') {
      setDeliveryType('takeaway');
    }
  }, [soloTakeaway, deliveryType, setDeliveryType]);

  const handleRemoveProduct = (item: CartItem) => {
    if (removeItem) {
      removeItem(item.id);
    } else {
      updateQuantity(item.id, -item.quantity);
    }
  };

  const handleApplyCoupon = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanInput = couponInput.trim().toUpperCase();

    if (!cleanInput) {
      setCouponFeedback({
        type: 'error',
        message: 'Por favor, ingresá un código de cupón.',
      });
      return;
    }

    const match = cuponesActivos.find(
      (c) => (c.Codigo || c.codigo || '').trim().toUpperCase() === cleanInput
    );

    if (match) {
      const discountPercentage = Number(
        match['Descuento Porcentaje'] ?? match.descuentoPorcentaje ?? 0
      );
      setAppliedCoupon({
        code: match.Codigo || match.codigo,
        discountPercentage,
      });
      setCouponFeedback({
        type: 'success',
        message: `Cupón ${match.Codigo || match.codigo} aplicado: ${discountPercentage}% de descuento.`,
      });
    } else {
      setCouponFeedback({
        type: 'error',
        message: 'El cupón no es válido o se encuentra inactivo.',
      });
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput('');
    setCouponFeedback(null);
  };

  const handleCopyAlias = async () => {
    if (!aliasBancario) return;
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(aliasBancario);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = aliasBancario;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopiedAlias(true);
      setTimeout(() => setCopiedAlias(false), 2400);
    } catch (err) {
      console.error('Error al copiar el alias al portapapeles:', err);
    }
  };

  // CÁLCULOS
  const totalItems = useMemo(() => {
    return cart.reduce((acc, item) => acc + (Number(item.quantity) || 1), 0);
  }, [cart]);

  const subtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + parsePrice(item.price) * item.quantity, 0);
  }, [cart]);

  const selectedZoneObj = useMemo(() => {
    return zonasEnvio.find((z) => z['Nombre de la Zona'] === zone);
  }, [zonasEnvio, zone]);

  const isFreeShippingActive = Boolean(deliveryType === 'delivery' && bannerPromo?.isFreeShipping);
  const rawDeliveryFee = deliveryType === 'delivery' && selectedZoneObj ? selectedZoneObj.Costo : 0;
  const deliveryFee = isFreeShippingActive ? 0 : rawDeliveryFee;

  const productDiscountAmount = productPromo?.discountAmount || 0;
  const promoPercent = bannerPromo?.discountPercent || 0;
  const couponPercent = appliedCoupon?.discountPercentage || 0;
  const effectiveDiscountPercentage = Math.max(couponPercent, promoPercent);

  const percentDiscountAmount = useMemo(() => {
    if (effectiveDiscountPercentage <= 0) return 0;
    const baseSubtotal = Math.max(0, subtotal - productDiscountAmount);
    return Math.round((baseSubtotal * effectiveDiscountPercentage) / 100);
  }, [subtotal, productDiscountAmount, effectiveDiscountPercentage]);

  const totalDiscountAmount = productDiscountAmount + percentDiscountAmount;
  const total = Math.max(0, subtotal - totalDiscountAmount) + deliveryFee;

  // Validación de Pedido
  const isDeliveryIncomplete = deliveryType === 'delivery' && (!zone || zone.trim() === '' || !address.trim());
  const isOrderValid = localAbierto && cart.length > 0 && !isDeliveryIncomplete;

  // COMANDA DE WHATSAPP (100% fiel al formato establecido)
  const sendOrderToWhatsApp = () => {
    if (!isOrderValid) return;

    let message = `*NUEVO PEDIDO*\n`;
    message += `--------------------------------\n`;
    message += `*Detalle del pedido:*\n`;

    cart.forEach((item) => {
      const priceNum = parsePrice(item.price);
      const itemSub = priceNum * item.quantity;
      message += `- ${item.quantity}x ${item.title} (${formatPrice(itemSub)})\n`;
    });

    message += `--------------------------------\n`;
    message += `*Subtotal:* ${formatPrice(subtotal)}\n`;

    if (productPromo && productDiscountAmount > 0) {
      message += `*Descuento Promoción (${productPromo.description}):* -${formatPrice(productDiscountAmount)}\n`;
    }

    if (appliedCoupon && percentDiscountAmount > 0) {
      message += `*Descuento Cupón (${appliedCoupon.code} - ${appliedCoupon.discountPercentage}%):* -${formatPrice(percentDiscountAmount)}\n`;
    } else if (promoPercent > 0 && percentDiscountAmount > 0) {
      message += `*Descuento Promoción ("${bannerPromo?.raw}" - ${promoPercent}%):* -${formatPrice(percentDiscountAmount)}\n`;
    }

    if (deliveryType === 'delivery') {
      message += `*Tipo de entrega:* Delivery\n`;
      if (isFreeShippingActive && selectedZoneObj) {
        message += `*Zona de entrega:* ${zone} (Envío Gratis - Promoción "${bannerPromo?.raw}" aplicada: Bonificado $0)\n`;
      } else {
        message += `*Zona de entrega:* ${zone} (${deliveryFee > 0 ? formatPrice(deliveryFee) : 'Envío sin cargo'})\n`;
      }
      message += `*Dirección:* ${address.trim()}\n`;
    } else {
      message += `*Tipo de entrega:* Retiro por local (Takeaway)\n`;
    }

    message += `--------------------------------\n`;
    message += `*TOTAL A PAGAR:* *${formatPrice(total)}*\n`;
    message += `*Método de pago:* ${paymentMethod === 'transferencia' ? 'Transferencia Bancaria' : 'Efectivo'}\n`;
    message += `--------------------------------\n`;

    if (paymentMethod === 'transferencia') {
      message += `*A continuación te envío el comprobante de transferencia.*`;
    } else {
      message += `Aguardamos confirmación del pedido.`;
    }

    const cleanNumber = whatsapp.replace(/\D/g, '');
    const urlWaMe = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
    window.open(urlWaMe, '_blank');
  };

  return {
    localAbierto,
    soloTakeaway,
    aliasBancario,
    titularCuenta,
    horariosAtencion,
    whatsapp,
    zonasEnvio,
    cuponesActivos,
    effectiveBannerText,
    bannerPromo,
    productPromo,
    deliveryType,
    setDeliveryType,
    zone,
    setZone,
    address,
    setAddress,
    paymentMethod,
    setPaymentMethod,
    couponInput,
    setCouponInput,
    appliedCoupon,
    couponFeedback,
    handleApplyCoupon,
    handleRemoveCoupon,
    copiedAlias,
    handleCopyAlias,
    handleRemoveProduct,
    totalItems,
    subtotal,
    selectedZoneObj,
    isFreeShippingActive,
    deliveryFee,
    productDiscountAmount,
    percentDiscountAmount,
    totalDiscountAmount,
    total,
    isDeliveryIncomplete,
    isOrderValid,
    sendOrderToWhatsApp,
  };
}
