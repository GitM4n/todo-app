<script setup lang="ts">
import { useToast } from '@/composables/useToast';
import { useAuthStore } from '#imports';

const authStore = useAuthStore();

const state = reactive<{
  email: {
    value: string;
    error?: string;
  };
  password: {
    value: string;
    error?: string;
  };
}>({
  email: {
    value: '',
    error: undefined,
  },
  password: {
    value: '',
    error: undefined,
  },
});

const toast = useToast();

function validateEmail(value: string) {
  state.email.error = value.includes('@') ? undefined : 'Invalid email';
}

function validatePassword(value: string) {
  state.password.error =
    value.length >= 6 ? undefined : 'Password must be at least 6 characters';
}

async function handleLogin() {
  if (state.email.error || state.password.error)
    return toast.show('Invalid credentials', 'error');

  await authStore.login(state.email.value, state.password.value);
}
</script>

<template>
  <form @submit.prevent="handleLogin">
    <div class="mb-3">
      <label for="email" class="form-label">E-mail</label>
      <input
        id="email"
        v-model.lazy="state.email.value"
        type="text"
        class="form-control"
        :class="{ 'is-invalid': state.email.error }"
        @blur="validateEmail(($event.target as HTMLInputElement).value)"
      />

      <div v-if="state.email.error" class="invalid-feedback">
        {{ state.email.error }}
      </div>
    </div>

    <div class="mb-3">
      <label for="state.password." class="form-label">Password</label>
      <input
        id="password"
        v-model.lazy="state.password.value"
        type="password"
        class="form-control"
        :class="{ 'is-invalid': state.password.error }"
        @blur="validatePassword(($event.target as HTMLInputElement).value)"
      />

      <div v-if="state.password.error" class="invalid-feedback">
        {{ state.password.error }}
      </div>
    </div>
    <div class="mt-3">
      <button type="submit" class="btn btn-primary w-100">Log in</button>
    </div>
  </form>
</template>

<style scoped>
/* Your styles here */
</style>
