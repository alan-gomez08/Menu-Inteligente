import { useEffect } from 'react';
import useSWR from 'swr';
import { getMenuData } from '../services/airtableService';
import type {
  MenuData,
  UseMenuDataReturn,
} from '../types/airtable';

const CACHE_KEY = 'menu_catalog_cache_v3';
const MAX_CACHE_AGE_MS = 60 * 60 * 1000; // 1 hora máximo para evitar URLs de imágenes vencidas

const getInitialCachedData = (): MenuData | undefined => {
  if (typeof window === 'undefined') return undefined;
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Validar que el caché no tenga más de 1 hora de antigüedad
      if (parsed && parsed.timestamp && (Date.now() - parsed.timestamp < MAX_CACHE_AGE_MS)) {
        if (parsed.data && Array.isArray(parsed.data.productos) && parsed.data.productos.length > 0) {
          return parsed.data;
        }
      }
    }
  } catch (e) {
    // Ignore cache parse error
  }
  return undefined;
};

const fetcher = async (): Promise<MenuData> => {
  const token = import.meta.env.VITE_AIRTABLE_TOKEN;
  if (!token || token.trim() === '' || token.includes('tu_token_aqui')) {
    throw new Error(
      'Falta configurar tu token VITE_AIRTABLE_TOKEN en el archivo .env.'
    );
  }
  const result = await getMenuData();
  if (result && typeof window !== 'undefined') {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({ data: result, timestamp: Date.now() }));
    } catch (e) {
      // Ignore cache storage error
    }
  }
  return result;
};

/**
 * Hook useMenuData optimizado con SWR:
 * - Caching en memoria y persistencia local (stale-while-revalidate instantáneo).
 * - Revalidación en cada montaje para garantizar URLs de imágenes frescas y activas.
 * - Deduplicación de peticiones y persistencia de datos previos.
 */
export function useMenuData(): UseMenuDataReturn {
  const token = import.meta.env.VITE_AIRTABLE_TOKEN;
  const isConfigured = Boolean(token && token.trim() !== '' && !token.includes('tu_token_aqui'));

  const { data, error, isLoading, mutate } = useSWR<MenuData>(
    isConfigured ? 'airtable-menu-catalog' : null,
    fetcher,
    {
      fallbackData: getInitialCachedData(),
      revalidateOnFocus: false,
      revalidateIfStale: true,
      revalidateOnMount: true,
      dedupingInterval: 60000, // 1 minuto de deduplicación
      keepPreviousData: true,
      shouldRetryOnError: true,
      errorRetryCount: 3,
    }
  );

  useEffect(() => {
    if (data && typeof window !== 'undefined') {
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }));
      } catch (e) {
        // Ignore
      }
    }
  }, [data]);

  const errorMessage = !isConfigured
    ? 'Falta configurar tu token VITE_AIRTABLE_TOKEN en el archivo .env.'
    : error ? (error.message || 'Error al sincronizar con Airtable') : null;

  const loading = isConfigured ? (isLoading && !data) : false;

  return {
    data: data || null,
    loading,
    error: errorMessage,
    refetch: async () => {
      await mutate();
    },

    // Atajos directos a las 4 entidades estructuradas
    configuracion: data?.configuracion ?? null,
    productos: data?.productos ?? [],
    zonasEnvio: data?.zonasEnvio ?? [],
    cupones: data?.cupones ?? [],
    categoriasUnicas: data?.categoriasUnicas ?? [],

    // Aliases ergonómicos
    config: data?.configuracion ?? null,
    products: data?.productos ?? [],
    deliveryZones: data?.zonasEnvio ?? [],
    coupons: data?.cupones ?? [],
    categories: data?.categoriasUnicas ?? [],
    isLoading: loading,
  };
}

export default useMenuData;
