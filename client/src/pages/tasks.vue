<script setup lang="ts">
import { useAuthStore, useTasksStore } from  '@/stores';

const authStore = useAuthStore();
const tasksStore = useTasksStore();

onMounted(async() => {

  if (!authStore.user) {
   return navigateTo('/login');
  }

  await tasksStore.getTasks({author: authStore.user.email});
})
</script>

<template>
  <div>
    <h1>{{authStore.user}}</h1>

    <ul class="list-group">
      <li v-for="task in tasksStore.tasks" :key="task.id" class="p-2 border rounded-3">
        <h2>{{task.title}}</h2>
        <p>{{task.description}}</p>
        <p>{{task.dueDate}}</p>
      </li>
    </ul>
  </div>
</template>

<style scoped>
/* Your styles here */
</style>
