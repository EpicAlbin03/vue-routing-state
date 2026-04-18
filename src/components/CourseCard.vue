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
