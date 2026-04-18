<script setup lang="ts">
import { onMounted } from 'vue'
import AddStudentForm from '@/components/AddStudentForm.vue'
import FilterStudents from '@/components/FilterStudents.vue'
import StudentCard from '@/components/StudentCard.vue'
import { useCourseStore } from '@/stores/courses'
import { useStudentStore } from '@/stores/students'

const courseStore = useCourseStore()
const studentStore = useStudentStore()

onMounted(async () => {
  await Promise.all([studentStore.load(), courseStore.load()])
})
</script>

<template>
  <section class="students-page page-section">
    <div class="page-header">
      <div>
        <h2>Students ({{ studentStore.students.length }})</h2>
        <p class="status-message">
          Manage students, search the list, and navigate to full details.
        </p>
      </div>
    </div>

    <AddStudentForm />

    <FilterStudents
      :search-term="studentStore.searchTerm"
      :sort-option="studentStore.sortOption"
      @search="studentStore.setSearchTerm"
      @sort-change="studentStore.setSortOption"
    />

    <p v-if="studentStore.isLoading" class="status-message">Loading students...</p>
    <p v-else-if="studentStore.errorMessage" class="error">{{ studentStore.errorMessage }}</p>
    <p v-else-if="studentStore.students.length < 1" class="status-message">No students yet</p>
    <p v-else-if="studentStore.filteredStudents.length < 1" class="status-message">
      No students match your search
    </p>

    <div v-else class="card-grid">
      <StudentCard
        v-for="student in studentStore.filteredStudents"
        :key="student.id"
        :student="student"
        @remove="studentStore.remove"
      />
    </div>
  </section>
</template>
