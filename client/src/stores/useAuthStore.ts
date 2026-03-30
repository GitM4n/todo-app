import { defineStore } from 'pinia';
import { useLocalStorage } from '@vueuse/core';

export const JWT_STORAGE_KEY = 'jwt';

export const useAuthStore = defineStore('auth', () => {
  const jwt: Ref<string | null> = useLocalStorage(JWT_STORAGE_KEY, null);

  const fetching = ref(false);

  const isLoggedIn = computed(() => !!jwt.value);


  const api = useApi();
  const toast = useToast();



  async function login(email: string, password: string) {
    fetching.value = true;
    try {
      const data = await api.post<{
        accessToken: string;
        refreshToken: string;
      }>('auth/login', { email, password });

      jwt.value = data.accessToken;

      toast.show('Login successful', 'success');
      navigateTo('/');
    } catch (e) {
      console.error(e);
    } finally {
      fetching.value = false;
    }
  }

  async function logout() {
    jwt.value = null;
    toast.show('Logged out', 'info');
    navigateTo('/login');
  }

  return { jwt, fetching, login, logout, isLoggedIn};
});
