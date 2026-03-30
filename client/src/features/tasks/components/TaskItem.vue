<script setup lang="ts">
import type { Task } from '@/types';
import { format } from 'date-fns';

defineProps<{ task: Task }>();

const formatDate = (timestamp: number) =>
  format(new Date(timestamp), 'dd/MM/yyyy HH:mm');


</script>

<template>
  <div
    class="card mb-3 shadow-sm"
    :class="task.isCompleted ? 'border-success' : 'border-primary'"
  >
    <div class="card-body d-flex flex-column gap-2">
      <div class="d-flex justify-content-between align-items-start">
        <h5 class="card-title mb-0">{{ task.title }}</h5>
        <span
          class="badge"
          :class="task.isCompleted ? 'bg-success' : 'bg-warning text-dark'"
        >
          {{ task.isCompleted ? 'Completed' : 'Pending' }}
        </span>
      </div>
      <p class="card-text text-muted">{{ task.description }}</p>

      <div class="d-flex justify-content-between align-items-center mt-auto">
        <small class="text-secondary">
          Created: {{ formatDate(task.createdAt) }}
        </small>
        <small class="text-secondary">
          Due: {{ formatDate(task.dueDate) }}
        </small>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  cursor: pointer;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

.card-title {
  font-weight: 600;
}

.badge {
  font-size: 0.8rem;
}
</style>
