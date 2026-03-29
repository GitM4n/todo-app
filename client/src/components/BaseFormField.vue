<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
  label: string;
  type?: string;
  validator?: (value: string) => string | null;
  id?: string;
}>();

const error = ref<string | null>(null);

const inpuValue = defineModel<string>();

function onBlur() {
  if (props.validator && inpuValue.value)
    error.value = props.validator(inpuValue.value);
}

watch(
  () => inpuValue.value,
  () => {
    if (!inpuValue.value) return;

    if (error.value)
      error.value = props.validator ? props.validator(inpuValue.value) : null;
  }
);
</script>

<template>
  <div class="mb-3">
    <label :for="id" class="form-label">{{ label }}</label>
    <input
      :id
      v-model.lazy="inpuValue"
      :type
      class="form-control"
      :class="{ 'is-invalid': error }"
      @blur="onBlur"
    />
    <div v-if="error" class="invalid-feedback">{{ error }}</div>
  </div>
</template>
