import { navigateTo } from '#app';
import { useAuthStore } from '@/stores';
import {
  HttpError,
  type HttpMethod,
  type RequestBodyOption,
  type RequestHeaderOption,
  type RequestQueryOption,
  apiRequest,
} from '@/plugins/apiRequest';

export function useApi() {
  const { show } = useToast();
  const store = useAuthStore();

  function handleError(error: unknown) {
    if (error instanceof HttpError) {
      if (error.status === 401) {
        store.jwt = null;
        navigateTo('/login');
      }

      const message =
        typeof error.response === 'object' &&
        error.response !== null &&
        'message' in error.response
          ? (error.response as { message: string }).message
          : 'Unknown error';

      show(message, 'error');
    } else show('Unknown error', 'error');

    throw error;
  }

  async function request<T>(
    method: HttpMethod,
    url: string,
    options?: { query?: RequestQueryOption; body?: RequestBodyOption }
  ): Promise<T> {
    try {
      const headers: RequestHeaderOption = {};
      if (store.jwt) headers['Authorization'] = `Bearer ${store.jwt}`;

      return await apiRequest<T>(method, url, { ...options, headers });
    } catch (error) {
      handleError(error);
      throw error;
    }
  }

  return {
    get: <T>(url: string, query?: RequestQueryOption) =>
      request<T>('GET', url, { query }),

    post: <T>(url: string, body?: RequestBodyOption) =>
      request<T>('POST', url, { body }),

    put: <T>(url: string, body?: RequestBodyOption) =>
      request<T>('PUT', url, { body }),

    delete: <T>(url: string) => request<T>('DELETE', url),
  };
}
