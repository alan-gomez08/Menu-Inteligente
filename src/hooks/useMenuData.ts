import { useEffect } from 'react';
import useSWR from 'swr';
import { getMenuData } from '../services/airtableService';
import type {
  MenuData,
  UseMenuDataReturn,
} from '../types/airtable';

const CACHE_KEY = 'menu_catalog_cache_v2';

const getInitialCachedData = (): MenuData | undefined => {
  if (typeof window === 'undefined') return undefined;
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.productos) && parsed.productos.length > 0) {
        return parsed;
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
      localStorage.setItem(CACHE_KEY, JSON.stringify(result));
    } catch (e) {
      // Ignore cache storage error
    }
  }
  return result;
};

/**
 * Hook useMenuData optimizado con SWR:
 * - Caching en memoria y persistencia local (stale-while-revalidate instantáneo).
 * - Protege los límites de la API de Airtable (revalidateOnFocus desactivado).
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
      revalidateIfStale: false,
      dedupingInterval: 120000, // 2 minutos de deduplicación
      keepPreviousData: true,
      shouldRetryOnError: false,
    }
  );

  useEffect(() => {
    if (data && typeof window !== 'undefined') {
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(data));
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
