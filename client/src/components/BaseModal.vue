<script setup lang="ts">
defineProps<{
  title?: string;
}>();

const modalRef = ref<HTMLElement | null>(null);

const isOpened = defineModel({ default: false });

function closeModal() {
  isOpened.value = false;
}

watch(
  () => isOpened.value,
  async (val) => {
    if (val) {
      await nextTick();
      modalRef.value?.focus();
    }
  }
);

const onKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') closeModal();
};
</script>

<template>
  <div
    v-if="isOpened"
    ref="modalRef"
    class="modal"
    :class="{ show: isOpened }"
    role="dialog"
    aria-modal="true"
    :aria-labelledby="'modal-title'"
    style="display: block"
    tabindex="-1"
    @keydown="onKeydown"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <slot name="header">
            <h4 id="modal-title" class="modal-title font-monospace fw-bold">{{ title }}</h4>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              @click="closeModal"
            />
          </slot>
        </div>

        <div class="modal-body">
          <slot />
        </div>

        <div class="modal-footer">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal {
  background: rgba(0, 0, 0, 0.5);
}
</style>
