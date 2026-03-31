<script setup lang="ts">
const authStore = useAuthStore();
const user = computed(() => authStore.user);
</script>

<template>
  <div>
    <header class="container">
      <div class="d-flex align-items-center justify-content-between flex-wrap mb-3">
        <h1 v-if="user" class="font-monospace text-info">
          You joined as {{ user.role }}: {{ user.email }}
        </h1>

        <button class="btn btn-danger" @click="authStore.logout()">
          Logout
        </button>
      </div>
    </header>

    <main>
      <slot />
    </main>
  </div>
</template>
