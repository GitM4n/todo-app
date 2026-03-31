<script setup lang="ts">
import { useTasksStore } from '@/stores';
import type { Task } from '@/types';
import { format } from 'date-fns';

const props = defineProps<{
  taskId: number;
}>();

const isOpenedModal = defineModel({ default: false });
const tasksStore = useTasksStore();

const dueDateInput = ref('');

const state = reactive<Partial<Task>>({
  title: undefined,
  description: undefined,
  isCompleted: undefined,
});

function closeModal() {
  isOpenedModal.value = false;
}

function timestampToInputValue(ts: number | undefined) {
  if (!ts) return '';
  return format(ts, "yyyy-MM-dd'T'HH:mm");
}

async function editTask() {
  if (!state.title || !state.description || !dueDateInput.value) return;

  await tasksStore.updateTask({
    id: props.taskId,
    title: state.title,
    description: state.description,
    dueDate: new Date(dueDateInput.value).getTime(),
    createdAt: new Date().getTime(),
    isCompleted: state.isCompleted ?? false,
  });
  closeModal();
}

onMounted(async () => {
  const editedTask = await tasksStore.getTaskById(props.taskId);
  console.log(editedTask);

  if (!editedTask) return;

  state.title = editedTask.title;
  state.description = editedTask.description;
  dueDateInput.value = timestampToInputValue(editedTask.dueDate);
  state.isCompleted = editedTask.isCompleted;
});
</script>

<template>
  <BaseModal v-model="isOpenedModal" title="Edit Task">
    <div class="d-flex flex-column gap-3">
      <input v-model="state.title" class="form-control" placeholder="Title" />
      <textarea
        v-model="state.description"
        class="form-control"
        placeholder="Description"
      ></textarea>
      <input
        v-model="dueDateInput"
        type="datetime-local"
        class="form-control"
      />
      <div class="d-flex align-items-start gap-2">
        <label for="isCompleted" class="form-label">Task Completed</label>
        <input
          id="isCompleted"
          v-model="state.isCompleted"
          type="checkbox"
          class="form-check"
        />
      </div>
    </div>

    <template #footer>
      <button class="btn btn-secondary" @click="closeModal">Cancel</button>
      <button class="btn btn-primary" @click="editTask">Update</button>
    </template>
  </BaseModal>
</template>
