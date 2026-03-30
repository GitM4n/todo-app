import { httpUrl } from '@/utils/apiRequest';

export default defineNuxtPlugin(() => {
  const { apiBaseUrl } = useRuntimeConfig().public;

  httpUrl.apiBaseUrl = apiBaseUrl;
});
