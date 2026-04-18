<script setup lang="ts">
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { RouterLink } from 'vue-router'
import AddStudentForm from '@/components/AddStudentForm.vue'
import FilterStudents from '@/components/FilterStudents.vue'
import StudentCard from '@/components/StudentCard.vue'
import { useCourseStore } from '@/stores/courses'
import { useStudentStore } from '@/stores/students'

const courseStore = useCourseStore()
const studentStore = useStudentStore()

const { students, filteredStudents, isLoading, errorMessage, searchTerm, sortOption } =
  storeToRefs(studentStore)

onMounted(() => {
  Promise.all([studentStore.load(), courseStore.load()])
})
</script>

<template>
  <section class="students-page page-section">
    <div class="page-header">
      <div>
        <h2>Students ({{ students.length }})</h2>
        <p class="status-message">
          Manage students, search the list, and navigate to full details.
        </p>
      </div>

      <RouterLink class="secondary-link" :to="{ name: 'courses' }">Browse Courses</RouterLink>
    </div>

    <AddStudentForm />

    <FilterStudents
      :search-term="searchTerm"
      :sort-option="sortOption"
      @search="studentStore.setSearchTerm"
      @sort-change="studentStore.setSortOption"
    />

    <p v-if="isLoading && students.length < 1" class="status-message">Loading students...</p>
    <p v-else-if="errorMessage" class="error">{{ errorMessage }}</p>
    <p v-else-if="students.length < 1" class="status-message">No students yet</p>
    <p v-else-if="filteredStudents.length < 1" class="status-message">
      No students match your search
    </p>

    <div v-else class="card-grid">
      <StudentCard
        v-for="student in filteredStudents"
        :key="student.id"
        :student="student"
        @remove="studentStore.remove"
      />
    </div>
  </section>
</template>
