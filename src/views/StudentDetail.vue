<script setup lang="ts">
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { RouterLink } from 'vue-router'
import { useCourseStore } from '@/stores/courses'
import { useStudentStore } from '@/stores/students'
import type { Course, Student } from '@/lib/types'

const props = defineProps<{
  id: number
}>()

const studentStore = useStudentStore()
const courseStore = useCourseStore()

const { isLoading: isLoadingStudents, errorMessage: studentErrorMessage } =
  storeToRefs(studentStore)

const student = ref<Student | null>(null)
const course = ref<Course | null>(null)

// Fetch student and course to get newest data
watch(
  () => props.id,
  async (id) => {
    student.value = null
    course.value = null

    const fetchedStudent = await studentStore.loadStudent(id)

    if (!fetchedStudent) {
      return
    }

    student.value = fetchedStudent
    course.value = await courseStore.loadCourse(fetchedStudent.course)
  },
  { immediate: true },
)
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

    <p v-if="isLoadingStudents" class="status-message">Loading student...</p>
    <p v-else-if="studentErrorMessage" class="error">{{ studentErrorMessage }}</p>
    <p v-else-if="!student" class="status-message">Student not found</p>

    <div v-else class="card detail-card">
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
    </div>
  </section>
</template>
