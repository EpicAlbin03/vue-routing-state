<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import type { Student } from '@/lib/types'
import { useCourseStore } from '@/stores/courses'

const props = defineProps<{
  student: Student
}>()

const emit = defineEmits<{
  remove: [id: number]
}>()

const courseStore = useCourseStore()
const courseName = computed(() => courseStore.getById(props.student.course)?.name || 'Unknown course')
</script>

<template>
  <article class="card">
    <p><b>Name:</b> {{ props.student.name }}</p>
    <p><b>Email:</b> {{ props.student.email }}</p>
    <p><b>Grade:</b> {{ props.student.grade }}</p>
    <p><b>Course:</b> {{ courseName }}</p>

    <div class="card-actions">
      <RouterLink class="details-link" :to="{ name: 'student-detail', params: { id: props.student.id } }">
        View Details
      </RouterLink>
      <button type="button" class="delete-btn" @click="emit('remove', props.student.id)">Delete</button>
    </div>
  </article>
</template>

<style scoped>
.card {
  background: #ffffff;
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.06);
}

p + p {
  margin-top: 8px;
}

.card-actions {
  margin-top: 16px;
  display: flex;
  gap: 10px;
}

.details-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 16px;
  font-weight: 600;
  color: #0f172a;
  background: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  text-decoration: none;
}

.details-link:hover {
  background: #f8fafc;
}

.delete-btn {
  background: #b91c1c;
  border-color: #b91c1c;
}

.delete-btn:hover {
  background: #991b1b;
  border-color: #991b1b;
}

@media (max-width: 768px) {
  .card-actions {
    flex-direction: column;
  }

  .details-link,
  .delete-btn {
    width: 100%;
  }
}
</style>
