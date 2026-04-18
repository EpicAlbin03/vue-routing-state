<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import CourseCard from '@/components/CourseCard.vue'
import { useCourseStore } from '@/stores/courses'
import { useStudentStore } from '@/stores/students'

const courseStore = useCourseStore()
const studentStore = useStudentStore()

onMounted(async () => {
  await Promise.all([courseStore.load(), studentStore.load()])
})
</script>

<template>
  <section class="courses-page">
    <div class="page-header">
      <div>
        <h2>Courses ({{ courseStore.courses.length }})</h2>
        <p class="status-message">
          Browse courses and see how many students are enrolled in each one.
        </p>
      </div>

      <RouterLink class="secondary-link" :to="{ name: 'students' }">Back to Students</RouterLink>
    </div>

    <p v-if="courseStore.isLoading" class="status-message">Loading courses...</p>
    <p v-else-if="courseStore.errorMessage" class="errorMessage">{{ courseStore.errorMessage }}</p>
    <p v-else-if="courseStore.courses.length < 1" class="status-message">No courses yet</p>
    <div v-else class="card-grid">
      <CourseCard
        v-for="course in courseStore.courses"
        :key="course.id"
        :course="course"
        :student-count="studentStore.getStudentsInCourse(course.id).length"
      />
    </div>
  </section>
</template>

<style scoped>
.courses-page {
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

.page-header > div {
  display: flex;
  flex-direction: column;
  gap: 6px;
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

.card-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
}

.card-grid > * {
  flex: 1 1 260px;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
  }

  .secondary-link {
    width: 100%;
  }

  .card-grid {
    flex-direction: column;
  }

  .card-grid > * {
    flex-basis: auto;
  }
}
</style>
