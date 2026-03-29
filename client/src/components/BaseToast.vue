<script setup lang="ts">
import { useToast } from '@/composables/useToast';

const { toasts, remove } = useToast();

const getClass = (type: string) => {
  return {
    'text-bg-success': type === 'success',
    'text-bg-danger': type === 'error',
    'text-bg-primary': type === 'info',
  };
};
</script>

<template>
  <div
    class="toast-container position-fixed top-0 end-0 p-3"
    style="z-index: 1055"
  >
    <TransitionGroup name="toast-fade" tag="div">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="toast show mb-2"
        :class="getClass(toast.type)"
      >
        <div
          class="toast-body d-flex justify-content-between align-items-center"
        >
          <span>{{ toast.message }}</span>
          <button
            type="button"
            class="btn-close"
            aria-label="Close"
            @click="remove(toast.id)"
          />
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: all 0.3s ease;
}
.toast-fade-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}
.toast-fade-enter-to {
  opacity: 1;
  transform: translateY(0);
}
.toast-fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}
.toast-fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
