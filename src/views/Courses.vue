<script setup lang="ts">
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { RouterLink } from 'vue-router'
import CourseCard from '@/components/CourseCard.vue'
import { useCourseStore } from '@/stores/courses'
import { useStudentStore } from '@/stores/students'

const courseStore = useCourseStore()
const studentStore = useStudentStore()

const { courses, isLoading, errorMessage } = storeToRefs(courseStore)

onMounted(() => {
  Promise.all([courseStore.load(), studentStore.load()])
})
</script>

<template>
  <section class="courses-page page-section">
    <div class="page-header">
      <div>
        <h2>Courses ({{ courses.length }})</h2>
        <p class="status-message">
          Browse courses and see how many students are enrolled in each one.
        </p>
      </div>

      <RouterLink class="secondary-link" :to="{ name: 'students' }">Back to Students</RouterLink>
    </div>

    <p v-if="isLoading && courses.length < 1" class="status-message">Loading courses...</p>
    <p v-else-if="errorMessage" class="error">{{ errorMessage }}</p>
    <p v-else-if="courses.length < 1" class="status-message">No courses yet</p>
    <div v-else class="card-grid">
      <CourseCard
        v-for="course in courses"
        :key="course.id"
        :course="course"
        :student-count="studentStore.getStudentsInCourse(course.id).length"
      />
    </div>
  </section>
</template>
