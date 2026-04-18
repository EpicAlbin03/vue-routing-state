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
  <section class="student-detail-page">
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

    <article v-else class="detail-card">
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

<style scoped>
.student-detail-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}

.secondary-link {
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

.secondary-link:hover {
  background: #f8fafc;
}

.detail-card {
  padding: 24px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.05);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.detail-row,
.detail-description {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-row span,
.detail-description span {
  color: #64748b;
  font-size: 0.95rem;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
  }

  .secondary-link {
    width: 100%;
  }
}
</style>
