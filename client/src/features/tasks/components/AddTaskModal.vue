<script setup lang="ts">
import { ref } from 'vue';
import { useTasksStore } from '@/stores';

const showModal = ref(false);
const tasksStore = useTasksStore();

const title = ref('');
const description = ref('');
const dueDate = ref<Date | number>();

const openModal = () => (showModal.value = true);
const closeModal = () => (showModal.value = false);

const addTask = async () => {
  if (!title.value || !description.value || !dueDate.value) return;

  await tasksStore.addTask({
    title: title.value,
    description: description.value,
    dueDate: new Date(dueDate.value).getTime(),
    createdAt: new Date().getTime(),
  });
  closeModal();
  title.value = '';
  description.value = '';
  dueDate.value = undefined;
};
</script>

<template>
  <button class="btn btn-primary mb-3" @click="openModal">Add Task</button>

  <div
    class="modal fade"
    tabindex="-1"
    :class="{ show: showModal }"
    style="display: block"
    v-if="showModal"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Add Task</h5>
          <button type="button" class="btn-close" @click="closeModal"></button>
        </div>
        <div class="modal-body d-flex flex-column gap-3">
          <input v-model="title" class="form-control" placeholder="Title" />
          <textarea
            v-model="description"
            class="form-control"
            placeholder="Description"
          ></textarea>
          <input v-model="dueDate" type="datetime-local" class="form-control" />
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closeModal">Cancel</button>
          <button class="btn btn-primary" @click="addTask">Add</button>
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
