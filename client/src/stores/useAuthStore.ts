import { defineStore } from 'pinia';
import { useLocalStorage } from '@vueuse/core';
import type { User } from '@/types';

export const JWT_STORAGE_KEY = 'jwt';

export const useAuthStore = defineStore('auth', () => {
  const jwt: Ref<string | null> = useLocalStorage(JWT_STORAGE_KEY, null);
  const user = ref<User | null>(null);
  const loading = ref(false);

  const api = useApi();
  const toast = useToast();

  const login = async (email: string, password: string) => {
    loading.value = true;
    try {
      const data = await api.post<{
        accessToken: string;
        refreshToken: string;
      }>('/auth/login', { email, password });
      jwt.value = data.accessToken;

      user.value = await api.get<User>('/user');

      toast.show('Login successful', 'success');
      navigateTo('/');
    } catch (e) {
      console.error(e);
    } finally {
      loading.value = false;
    }
  };

  const logout = () => {
    jwt.value = null;
    user.value = null;
    toast.show('Logged out', 'info');
    navigateTo('/login');
  };

  const isLoggedIn = computed(() => !!jwt.value);

  return { jwt, user, loading, login, logout, isLoggedIn };
});
