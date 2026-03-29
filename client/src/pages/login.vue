<script setup lang="ts">
import { ref } from 'vue';
import BaseForm from '@/components/BaseForm.vue';
import BaseFormField from '@/components/BaseFormField.vue';
import { useToast } from '@/composables/useToast';

const email = ref('');
const password = ref('');

const { show } = useToast();

function validateEmail(value: string) {
  return value.includes('@') ? null : 'Invalid email';
}

function validatePassword(value: string) {
  return value.length >= 6 ? null : 'Password must be at least 6 characters';
}

function handleLogin() {
  if (validateEmail(email.value) || validatePassword(password.value)) {
    show('Please fix the errors', 'error');
    return;
  }

  show('Login successful', 'success');
}
</script>

<template>
  <div class="d-flex justify-content-center align-items-center vh-100 bg-light">
    <div class="card p-4 shadow-sm" style="width: 400px">
      <h3 class="mb-4 text-center">Login</h3>

      <BaseForm :submit-text="'Login'" :on-submit="handleLogin">
        <BaseFormField
          v-model="email"
          label="Email"
          type="email"
          :validator="validateEmail"
        />
        <BaseFormField
          v-model="password"
          label="Password"
          type="password"
          :validator="validatePassword"
        />
      </BaseForm>
    </div>
  </div>
</template>
