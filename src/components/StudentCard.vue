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
const courseName = computed(
  () => courseStore.getById(props.student.course)?.name || 'Unknown course',
)
</script>

<template>
  <div class="card">
    <div>
      <p><b>Name:</b> {{ props.student.name }}</p>
      <p><b>Email:</b> {{ props.student.email }}</p>
      <p><b>Grade:</b> {{ props.student.grade }}</p>
      <p><b>Course:</b> {{ courseName }}</p>
    </div>

    <div class="card-actions">
      <RouterLink
        class="secondary-link"
        :to="{ name: 'student-detail', params: { id: props.student.id } }"
      >
        View Details
      </RouterLink>
      <button type="button" class="button-danger" @click="emit('remove', props.student.id)">
        Delete
      </button>
    </div>
  </div>
</template>
