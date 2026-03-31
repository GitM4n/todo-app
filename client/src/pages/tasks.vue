<script setup lang="ts">
import { TasksList } from '@/features/tasks';

const AddTaskModal = defineAsyncComponent(
  () => import('@/features/tasks/components/AddTaskModal.vue')
);

const isAddTaskModalOpened = ref(false);
</script>

<template>
  <div class="container d-flex flex-column gap-4">
    <h2 class="font-monospace text-success">Tasks List</h2>

    <div class="d-flex">
      <button class="btn btn-primary col-md-2" @click="isAddTaskModalOpened = true">
        Add Task
      </button>
    </div>

    <TasksList />

    <AddTaskModal v-if="isAddTaskModalOpened" v-model="isAddTaskModalOpened" />
  </div>
</template>
