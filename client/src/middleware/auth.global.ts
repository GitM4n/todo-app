import { useAuthStore } from '@/stores';

export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore();
  
  if (authStore.isLoggedIn && !authStore.user) {
    try {
      await authStore.getUser();
    } catch {
      return navigateTo('/login');
    }
  }

  if (!authStore.isLoggedIn && to.path !== '/login')
    return navigateTo('/login');

  if (authStore.isLoggedIn && to.path === '/login') return navigateTo('/');
});
