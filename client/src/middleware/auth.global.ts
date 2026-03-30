import { useAuthStore } from '@/stores';

export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.client) {
    const authStore = useAuthStore();

    if (!authStore.isLoggedIn && to.path !== '/login')
      return navigateTo('/login');

    if (authStore.isLoggedIn && to.path === '/login') return navigateTo('/');
  }
});
