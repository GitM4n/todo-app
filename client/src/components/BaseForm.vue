<script setup lang="ts">
withDefaults(
  defineProps<{
    submitText?: string;
    onSubmit: () => void;
  }>(),
  {
    submitText: 'Submit',
  }
);
</script>

<template>
  <form @submit.prevent="onSubmit">
    <slot />
    <div class="mt-3">
      <button type="submit" class="btn btn-primary w-100">
        {{ submitText }}
      </button>
    </div>
  </form>
</template>
