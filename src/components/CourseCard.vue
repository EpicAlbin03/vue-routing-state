<script setup lang="ts">
import type { Course } from '@/lib/types'

defineProps<{
  course: Course
  studentCount?: number
}>()
</script>

<template>
  <article class="card">
    <p><b>Name:</b> {{ course.name }}</p>
    <p><b>Code:</b> {{ course.code }}</p>
    <p><b>Description:</b> {{ course.description }}</p>
    <p><b>Students:</b> {{ studentCount ?? 0 }}</p>
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
</style>
