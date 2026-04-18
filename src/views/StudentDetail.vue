<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useCourseStore } from '@/stores/courses'
import { useStudentStore } from '@/stores/students'

const route = useRoute()
const studentStore = useStudentStore()
const courseStore = useCourseStore()

const studentId = computed(() => Number(route.params.id))
const student = computed(() => studentStore.getById(studentId.value))
const course = computed(() => {
  if (!student.value) {
    return null
  }

  return courseStore.getById(student.value.course)
})

onMounted(async () => {
  await Promise.all([studentStore.load(), courseStore.load()])
})
</script>

<template>
  <section class="student-detail-page page-section">
    <div class="page-header">
      <div>
        <h2>Student Detail</h2>
        <p class="status-message">Review the selected student and their course information.</p>
      </div>

      <RouterLink class="secondary-link" :to="{ name: 'students' }">Back to Students</RouterLink>
    </div>

    <p v-if="studentStore.isLoading" class="status-message">Loading student...</p>
    <p v-else-if="studentStore.errorMessage" class="error">{{ studentStore.errorMessage }}</p>
    <p v-else-if="!student" class="status-message">Student not found</p>

    <article v-else class="card detail-card">
      <div class="detail-row">
        <span>Name</span>
        <strong>{{ student.name }}</strong>
      </div>
      <div class="detail-row">
        <span>Email</span>
        <strong>{{ student.email }}</strong>
      </div>
      <div class="detail-row">
        <span>Grade</span>
        <strong>{{ student.grade }}</strong>
      </div>
      <div class="detail-row">
        <span>Course</span>
        <strong>{{ course?.name || 'Unknown course' }}</strong>
      </div>
      <div class="detail-row">
        <span>Course Code</span>
        <strong>{{ course?.code || 'N/A' }}</strong>
      </div>
      <div v-if="course?.description" class="detail-description">
        <span>Description</span>
        <p>{{ course.description }}</p>
      </div>
    </article>
  </section>
</template>
