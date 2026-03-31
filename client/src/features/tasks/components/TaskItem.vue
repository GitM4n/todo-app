<script setup lang="ts">
import type { Task } from '@/types';
import { format } from 'date-fns';

const props = defineProps<{ task: Task }>();
const emit = defineEmits<{
  (e: 'deleteTask' | 'editTask', id: number): void
}>();

const authStore = useAuthStore();


const formatDate = (timestamp: number) =>
  format(new Date(timestamp), 'dd/MM/yyyy HH:mm');

const canModifyTask = computed(() => {
  const user = authStore.user;
  return user?.role === 'admin' || user?.id === props.task.createdBy.id;
});
</script>

<template>
  <div
    class="card mb-3 shadow-sm"
    :class="task.isCompleted ? 'border-success' : 'border-primary'"
    role="article"
    :aria-labelledby="'task-title-' + task.id"
  >
    <div class="card-body d-flex flex-column gap-2">
      <div class="d-flex justify-content-between align-items-start">
        <h5 :id="'task-title-' + task.id" class="card-title mb-0">
          {{ task.title }}
        </h5>
        <div class="d-flex gap-2 align-items-center">
          <p>Executor: {{ task.createdBy.email }}</p>
          <span
            class="badge"
            :class="task.isCompleted ? 'bg-success' : 'bg-warning text-dark'"
          >
            {{ task.isCompleted ? 'Completed' : 'Pending' }}
          </span>
        </div>
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
      
      <div v-if="canModifyTask" class="d-flex gap-3">
        <button class="btn btn-primary" @click="emit('editTask', task.id)">
          Edit
        </button>
        <button class="btn btn-danger" @click="emit('deleteTask', task.id)">
          Delete
        </button>
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
