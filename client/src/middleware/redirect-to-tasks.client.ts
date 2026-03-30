import { useAuthStore } from '@/stores';

export default defineNuxtRouteMiddleware(() => {
  const authStore = useAuthStore();

  return navigateTo(authStore.isLoggedIn ? '/tasks' : '/login');
});
