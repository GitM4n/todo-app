<script setup lang="ts">
import { useTasksStore } from '@/stores';

const isOpenedModal = defineModel({ default: false });
const tasksStore = useTasksStore();

const title = ref('');
const description = ref('');
const dueDate = ref<Date | number>();

function closeModal() {
  isOpenedModal.value = false;
}

async function addTask() {
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
  <BaseModal v-model="isOpenedModal" title="Add Task">
    <div class="d-flex flex-column gap-3">
      <input v-model="title" class="form-control" placeholder="Title" />
      <textarea
        v-model="description"
        class="form-control"
        placeholder="Description"
      ></textarea>
      <input v-model="dueDate" type="datetime-local" class="form-control" />
    </div>

    <template #footer>
      <button class="btn btn-secondary" @click="closeModal">Cancel</button>
      <button class="btn btn-primary" @click="addTask">Add</button>
    </template>
  </BaseModal>
</template>
