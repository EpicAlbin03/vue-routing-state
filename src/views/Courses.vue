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
  <section class="courses-page page-section">
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
    <p v-else-if="courseStore.errorMessage" class="error">{{ courseStore.errorMessage }}</p>
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
