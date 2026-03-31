<script setup lang="ts">
import type { PaginatedTasks } from '@/types';

defineProps<{
  pagination: PaginatedTasks['pagination'];
}>();

const emits = defineEmits<{
  (e: 'goToPage', page: number): void;
}>();

function goToPage(page: number) {
  emits('goToPage', page);
}
</script>

<template>
  <nav aria-label="Tasks pagination">
    <ul class="pagination mt-3">
      <li class="page-item" :class="{ disabled: pagination.page === 1 }">
        <button class="page-link" @click="goToPage(pagination.page - 1)">
          Previous page
        </button>
      </li>

      <li
        v-for="page in pagination.totalPages"
        :key="page"
        class="page-item"
        :class="{ active: pagination.page === page }"
      >
        <button
          class="page-link"
          :aria-label="`Go to page ${page}`"
          @click="goToPage(page)"
        >
          {{ page }}
        </button>
      </li>

      <li
        class="page-item"
        :class="{
          disabled: pagination.page === pagination.totalPages,
        }"
      >
        <button class="page-link" @click="goToPage(pagination.page + 1)">
          Next page
        </button>
      </li>
    </ul>
  </nav>
</template>


