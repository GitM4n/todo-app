import type { User } from '@/types';
import { useAuthStore } from '@/stores';

export async function useCurrentUser() {
  const isFetchingUser = ref(false);
  const user = ref<User | null>(null);

  const authStore = useAuthStore();
  const api = useApi();

  async function getUser() {
    try {
      const user = await api.get<User>('user');
      return user;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  if (authStore.isLoggedIn) {
    isFetchingUser.value = true;
    try {
      user.value = await getUser();
    } catch (e) {
      console.error(e);
    } finally {
      isFetchingUser.value = false;
    }
  }

  return { user, isFetchingUser };
}
