import type {
  ProductData,
  DeliveryZoneData,
  ConfigData,
  CouponData,
  MenuData,
  AirtableRecord,
  AirtableResponse,
} from '../types/airtable';
import { parsePrice } from '../utils/formatters';

const DEFAULT_BASE_ID = 'appQvWaZRnWWpkmo3';

function getBaseUrl(): { apiUrl: string; baseId: string; token: string } {
  const token = import.meta.env.VITE_AIRTABLE_TOKEN;
  const baseId = import.meta.env.VITE_AIRTABLE_BASE_ID || DEFAULT_BASE_ID;

  if (!token || token.trim() === '' || token.includes('tu_token_aqui')) {
    throw new Error(
      'Falta configurar tu token VITE_AIRTABLE_TOKEN en el archivo .env. Después de agregarlo, recuerda reiniciar el servidor (Ctrl+C y npm run dev).'
    );
  }

  return {
    apiUrl: `https://api.airtable.com/v0/${baseId}`,
    baseId,
    token: token.trim(),
  };
}

/**
 * Normaliza y verifica si un valor indica disponibilidad (true, "SI", "sí", 1, etc.).
 */
function checkAvailability(val: any): boolean {
  if (val === true || val === 1) return true;
  if (typeof val === 'string') {
    const s = val.trim().toLowerCase();
    return s === 'true' || s === 'si' || s === 'sí' || s === '1' || s === 'activo' || s === 'disponible';
  }
  return false;
}

/**
 * Extrae la URL de la primera imagen y guarda attachments si existen.
 */
function parseFirstPhoto(photoField: any, imageField?: any): { url: string; attachments: any[] } {
  const source = photoField || imageField;
  if (!source) return { url: '', attachments: [] };

  if (Array.isArray(source) && source.length > 0) {
    const valid = source.filter((item) => item && typeof item.url === 'string');
    return {
      url: valid[0]?.url || '',
      attachments: valid,
    };
  }

  if (typeof source === 'string' && source.trim().length > 0) {
    return {
      url: source.trim(),
      attachments: [{ url: source.trim() }],
    };
  }

  return { url: '', attachments: [] };
}

/**
 * Petición GET a Airtable con soporte para paginación y nombres alternativos de tabla.
 */
async function fetchTableWithAlternatives(
  tableNames: string[],
  maxRecords?: number
): Promise<{ records: AirtableRecord[]; matchedName: string }> {
  const { apiUrl, baseId, token } = getBaseUrl();
  let lastError: Error | null = null;

  for (const tableName of tableNames) {
    try {
      let allRecords: AirtableRecord[] = [];
      let offset: string | undefined = undefined;

      do {
        const url = new URL(`${apiUrl}/${encodeURIComponent(tableName)}`);
        url.searchParams.append('pageSize', '100');
        if (maxRecords) {
          url.searchParams.append('maxRecords', String(maxRecords));
        }
        if (offset) {
          url.searchParams.append('offset', offset);
        }

        const response = await fetch(url.toString(), {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 404) {
          throw new Error(`Tabla "${tableName}" no encontrada (404)`);
        }

        if (response.status === 401 || response.status === 403) {
          throw new Error(
            `Error de autenticación (${response.status}): El token VITE_AIRTABLE_TOKEN es inválido o no tiene permisos 'data.records:read' en la Base ${baseId}.`
          );
        }

        if (!response.ok) {
          const errorBody = await response.json().catch(() => null);
          throw new Error(errorBody?.error?.message || `Error HTTP ${response.status}: ${response.statusText}`);
        }

        const data: AirtableResponse = await response.json();
        if (Array.isArray(data.records)) {
          allRecords = allRecords.concat(data.records);
        }

        if (maxRecords && allRecords.length >= maxRecords) {
          return { records: allRecords.slice(0, maxRecords), matchedName: tableName };
        }

        offset = data.offset;
      } while (offset);

      return { records: allRecords, matchedName: tableName };
    } catch (err: any) {
      lastError = err;
      if (err.message.includes('autenticación')) {
        throw err;
      }
    }
  }

  throw lastError || new Error(`No se pudo encontrar ninguna de las tablas: ${tableNames.join(', ')}`);
}

/**
 * Consulta la tabla "Configuración" en Airtable vía GET (primer registro).
 */
export async function getConfiguracion(): Promise<ConfigData | null> {
  try {
    const candidateNames = ['Configuración', 'Configuracion', 'Config'];
    const { records } = await fetchTableWithAlternatives(candidateNames, 1);

    if (!records || records.length === 0) return null;

    const fields = records[0].fields || {};

    const nombreLocal = String(
      fields['Nombre del Local'] ||
      fields.Nombre ||
      fields.Local ||
      fields.nombreLocal ||
      ''
    ).trim();

    const whatsappPedidos = String(
      fields['WhatsApp Pedidos'] ||
      fields['Whatsapp Pedidos'] ||
      fields.WhatsApp ||
      fields.whatsapp ||
      ''
    ).trim();

    const localAbierto = checkAvailability(
      fields['Local Abierto'] ?? fields.Abierto ?? fields.localAbierto ?? true
    );

    const soloTakeaway = checkAvailability(
      fields['Solo Takeaway (Modo Lluvia)'] ??
      fields['Solo Takeaway'] ??
      fields['Modo Lluvia'] ??
      fields.soloTakeaway ??
      false
    );

    const bannerPromocional = String(
      fields['Banner Promocional'] ||
      fields.Banner ||
      fields.bannerPromocional ||
      ''
    ).trim();

    const aliasBancario = String(
      fields['Alias Bancario'] ||
      fields['Alias Bancario / CBU'] ||
      fields.Alias ||
      fields.CBU ||
      fields.aliasBancario ||
      ''
    ).trim();

    const titularCuenta = String(
      fields['Titular Cuenta'] ||
      fields['Titular de la Cuenta'] ||
      fields.Titular ||
      fields.titularCuenta ||
      ''
    ).trim();

    const horariosAtencion = String(
      fields['Horarios de Atención'] ||
      fields['Horario de Atención'] ||
      fields['Horarios'] ||
      fields.horarios ||
      'Martes a Domingo: 19:30 a 00:00 hs'
    ).trim();

    return {
      'Nombre del Local': nombreLocal,
      'WhatsApp Pedidos': whatsappPedidos,
      'Local Abierto': localAbierto,
      'Solo Takeaway (Modo Lluvia)': soloTakeaway,
      'Banner Promocional': bannerPromocional,
      'Alias Bancario': aliasBancario,
      'Titular Cuenta': titularCuenta,
      'Horarios de Atención': horariosAtencion,
      nombreLocal,
      whatsappPedidos,
      localAbierto,
      soloTakeaway,
      bannerPromocional,
      aliasBancario,
      titularCuenta,
      horariosAtencion,
    };
  } catch (error) {
    console.error('Error al obtener configuración desde Airtable:', error);
    throw error;
  }
}

/**
 * Consulta la tabla "Productos" en Airtable vía GET.
 * Mapea a ProductData, extrae la URL de la primera imagen y filtra donde Disponible === true.
 */
export async function getProducts(): Promise<ProductData[]> {
  try {
    const candidateNames = ['Productos', 'productos', 'Menu', 'Menú', 'Carta'];
    const { records, matchedName } = await fetchTableWithAlternatives(candidateNames);

    console.log(`[Airtable] Tabla de productos conectada con éxito ("${matchedName}"). Registros totales: ${records.length}`);

    const mappedProducts: ProductData[] = records.map((record) => {
      const fields = record.fields || {};

      const name = String(
        fields['Nombre del Producto'] ||
        fields.Nombre ||
        fields.Titulo ||
        fields.title ||
        fields.Producto ||
        ''
      ).trim();

      const description = String(
        fields.Descripcion ||
        fields['Descripción'] ||
        fields.Detalle ||
        fields.Description ||
        ''
      ).trim();

      const category = String(
        fields['Categoría'] ||
        fields.Categoria ||
        fields.Category ||
        fields.Rubro ||
        'General'
      ).trim();

      const priceRaw = fields.Precio ?? fields.Price ?? fields.Valor ?? 0;
      const price = typeof priceRaw === 'number' ? priceRaw : parsePrice(priceRaw);

      const { url: photoUrl, attachments } = parseFirstPhoto(fields.Foto, fields.Imagen || fields.Image);

      const available = checkAvailability(fields.Disponible ?? fields.Activo ?? fields.disponible);

      let badge: string | undefined = undefined;
      if (typeof fields.Badge === 'string' && fields.Badge.trim()) {
        badge = fields.Badge.trim();
      } else if (typeof fields.Etiqueta === 'string' && fields.Etiqueta.trim()) {
        badge = fields.Etiqueta.trim();
      } else if (fields['Más Vendido'] === true || fields['Mas Vendido'] === true) {
        badge = 'Más Vendido';
      } else if (fields.Picante === true) {
        badge = 'Picante';
      } else if (fields.Agotado === true) {
        badge = 'Agotado';
      } else if (fields.Nuevo === true) {
        badge = 'Nuevo';
      }

      return {
        id: record.id,
        'Nombre del Producto': name,
        Descripcion: description,
        Categoría: category,
        Precio: price,
        Foto: photoUrl,
        Disponible: available,
        Badge: badge,
        nombre: name,
        descripcion: description,
        categoria: category,
        precio: price,
        foto: photoUrl,
        badge,
        fotos: attachments,
      };
    });

    const availableProducts = mappedProducts.filter((product) => product.Disponible === true);

    return availableProducts;
  } catch (error) {
    console.error('Error al obtener productos desde Airtable:', error);
    throw error;
  }
}

/**
 * Consulta la tabla "Zonas de Envio" en Airtable vía GET.
 * Mapea a DeliveryZoneData y filtra únicamente registros donde Disponible === true.
 */
export async function getDeliveryZones(): Promise<DeliveryZoneData[]> {
  try {
    const candidateNames = ['Zonas de Envio', 'Zonas de Envío', 'Zonas de envio', 'Zonas', 'Delivery', 'Envios'];
    const { records, matchedName } = await fetchTableWithAlternatives(candidateNames);

    console.log(`[Airtable] Tabla de zonas conectada ("${matchedName}"). Registros totales: ${records.length}`);

    const mappedZones: DeliveryZoneData[] = records.map((record) => {
      const fields = record.fields || {};

      const name = String(
        fields['Nombre de la Zona'] ||
        fields.Nombre ||
        fields.Zona ||
        fields.name ||
        ''
      ).trim();

      const costRaw = fields.Costo ?? fields.Precio ?? fields.Price ?? fields.Valor ?? 0;
      const cost = typeof costRaw === 'number' ? costRaw : parsePrice(costRaw);

      const available = checkAvailability(fields.Disponible ?? fields.Activo ?? fields.disponible);

      return {
        id: record.id,
        'Nombre de la Zona': name,
        Costo: cost,
        Disponible: available,
        nombre: name,
        costo: cost,
      };
    });

    const availableZones = mappedZones.filter((zone) => zone.Disponible === true);

    return availableZones;
  } catch (error) {
    console.error('Error al obtener zonas de envío desde Airtable:', error);
    throw error;
  }
}

/**
 * Consulta la tabla "Cupones" en Airtable vía GET.
 * Filtra estrictamente registros con Activo === true y mapea Codigo y Descuento Porcentaje.
 */
export async function getCupones(): Promise<CouponData[]> {
  try {
    const candidateNames = ['Cupones', 'cupones', 'Coupons', 'Descuentos'];
    const { records } = await fetchTableWithAlternatives(candidateNames);

    const activeRecords = records.filter((r) => checkAvailability(r.fields?.Activo));

    return activeRecords.map((record) => {
      const fields = record.fields || {};

      const codigo = String(
        fields.Codigo ||
        fields['Código'] ||
        fields.Code ||
        fields.codigo ||
        ''
      ).trim();

      const descRaw =
        fields['Descuento Porcentaje'] ??
        fields['Descuento'] ??
        fields.Porcentaje ??
        fields.DescuentoPorcentaje ??
        0;
      const descuentoPorcentaje =
        typeof descRaw === 'number' ? descRaw : parseFloat(descRaw) || 0;

      return {
        id: record.id,
        Codigo: codigo,
        'Descuento Porcentaje': descuentoPorcentaje,
        Activo: true,
        codigo,
        descuentoPorcentaje,
        activo: true,
      };
    });
  } catch (error) {
    console.error('Error al obtener cupones desde Airtable:', error);
    throw error;
  }
}

/**
 * Ejecuta en paralelo con Promise.all la consulta de las 4 entidades
 */
export async function getMenuData(): Promise<MenuData> {
  const [configuracion, productos, zonasEnvio, cupones] = await Promise.all([
    getConfiguracion(),
    getProducts(),
    getDeliveryZones(),
    getCupones(),
  ]);

  const categoriasUnicas = Array.from(
    new Set(productos.map((p) => p['Categoría']).filter(Boolean))
  );

  return {
    configuracion,
    productos,
    zonasEnvio,
    cupones,
    categoriasUnicas,
    config: configuracion,
    products: productos,
    deliveryZones: zonasEnvio,
    coupons: cupones,
    categories: categoriasUnicas,
  };
}
