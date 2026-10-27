import useSWR from 'swr';
import { getMenuData } from '../services/airtableService';
import type {
  MenuData,
  UseMenuDataReturn,
} from '../types/airtable';

const fetcher = async (): Promise<MenuData> => {
  const token = import.meta.env.VITE_AIRTABLE_TOKEN;
  if (!token || token.trim() === '' || token.includes('tu_token_aqui')) {
    throw new Error(
      'Falta configurar tu token VITE_AIRTABLE_TOKEN en el archivo .env.'
    );
  }
  return await getMenuData();
};

/**
 * Hook useMenuData optimizado con SWR:
 * - Caching en memoria para evitar re-fetches innecesarios.
 * - Protege los límites de la API de Airtable (revalidateOnFocus desactivado).
 * - Deduplicación de peticiones y persistencia de datos previos (stale-while-revalidate).
 */
export function useMenuData(): UseMenuDataReturn {
  const token = import.meta.env.VITE_AIRTABLE_TOKEN;
  const isConfigured = Boolean(token && token.trim() !== '' && !token.includes('tu_token_aqui'));

  const { data, error, isLoading, mutate } = useSWR<MenuData>(
    isConfigured ? 'airtable-menu-catalog' : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      dedupingInterval: 120000, // 2 minutos de deduplicación
      keepPreviousData: true,
      shouldRetryOnError: false,
    }
  );

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
