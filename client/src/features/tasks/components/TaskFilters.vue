<script setup lang="ts">
import { useAuthStore } from '@/stores';
import type { TaskQuery, TaskSortField, SortOrder } from '@/types';

const emit = defineEmits<{
  (e: 'onFilterChange', query: TaskQuery): void;
}>();

const authStore = useAuthStore();

const statusText = ref<'all' | 'completed' | 'pending'>('all');
const status = computed(() =>
  statusText.value === 'all' ? undefined : statusText.value === 'completed'
);

const isAllTasksShowed = ref(false);
const searchByAuthor = ref('');
const sortField = ref<TaskSortField>('createdAt');
const sortOrder = ref<SortOrder>('asc');
const limit = ref(10);

const user = computed(() => authStore.user);

const author = computed(() => {
  if (!user.value) return undefined;

  if (user.value.role === 'admin') return searchByAuthor.value || undefined;

  if (!isAllTasksShowed.value) return user.value.email;

  return searchByAuthor.value || undefined;
});

watch(
  [statusText, isAllTasksShowed, searchByAuthor, sortField, sortOrder, limit],
  () => {
    const query: TaskQuery = {
      limit: limit.value,
      status: status.value,
      sort: sortField.value,
      order: sortOrder.value,
      author: author.value,
    };
    emit('onFilterChange', { ...query, page: 1 });
  },
  { immediate: true }
);

const isSearchByAuthorInputVisible = computed(() => user.value?.role === 'admin' || isAllTasksShowed.value);
</script>

<template>
  <div class="d-flex flex-wrap gap-2 mb-3 align-items-end">
    <div>
      <label for="status" class="form-label fst-italic fw-bold">Status</label>
      <select id="status" v-model="statusText" class="form-select w-auto">
        <option value="all">All</option>
        <option value="completed">Completed</option>
        <option value="pending">Pending</option>
      </select>
    </div>

    <input
      v-if="isSearchByAuthorInputVisible"
      v-model.lazy="searchByAuthor"
      type="text"
      placeholder="Search by author"
      class="form-control w-auto"
    />

    <div>
      <label for="sortField" class="form-label fst-italic fw-bold">
        Sort By
      </label>
      <select id="sortField" v-model="sortField" class="form-select w-auto">
        <option value="createdAt">Created At</option>
        <option value="dueDate">Due Date</option>
        <option value="isCompleted">Status</option>
      </select>
    </div>

    <div class="d-flex flex-column item">
      <label for="sortOrder" class="form-label fst-italic fw-bold">Order</label>
      <select id="sortOrder" v-model="sortOrder" class="form-select w-auto">
        <option value="asc">Asc</option>
        <option value="desc">Desc</option>
      </select>
    </div>

    <div>
      <label for="limit" class="form-label fst-italic fw-bold">Limit</label>
      <select id="limit" v-model="limit" class="form-select w-auto">
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="20">20</option>
      </select>
    </div>

    <button
      v-if="user?.role !== 'admin'"
      class="btn"
      :class="isAllTasksShowed ? 'btn-success' : 'btn-warning'"
      @click="isAllTasksShowed = !isAllTasksShowed"
    >
      {{ isAllTasksShowed ? 'Show My Tasks' : 'Show All Tasks' }}
    </button>
  </div>
</template>
