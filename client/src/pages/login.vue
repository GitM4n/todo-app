<script setup lang="ts">
import { LoginForm } from '@/features/auth';

definePageMeta({
  layout: false,
});
</script>

<template>
  <div class="d-flex justify-content-center align-items-center vh-100 bg-light">
    <div class="card p-4 shadow-sm" style="width: 400px">
      <h3 class="mb-4 text-center">Login</h3>

      <LoginForm />
    </div>
  </div>
</template>
