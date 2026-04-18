<script setup lang="ts">
import type { StudentSortOption } from '@/lib/types'

const props = defineProps<{
  searchTerm: string
  sortOption: StudentSortOption
}>()

const emit = defineEmits<{
  search: [value: string]
  'sort-change': [value: StudentSortOption]
}>()

function handleSearch(event: Event) {
  emit('search', (event.target as HTMLInputElement).value)
}

function handleSortChange(event: Event) {
  emit('sort-change', (event.target as HTMLSelectElement).value as StudentSortOption)
}
</script>

<template>
  <div class="filter-students-container">
    <input
      :value="props.searchTerm"
      type="text"
      placeholder="Search by name..."
      @input="handleSearch"
    />

    <div class="sort-group">
      <label for="sort-students">Sort by</label>
      <select id="sort-students" :value="props.sortOption" @change="handleSortChange">
        <option value="name">Name</option>
        <option value="grade">Grade</option>
      </select>
    </div>
  </div>
</template>

<style scoped>
.filter-students-container {
  display: flex;
  gap: 8px;
  align-items: end;
}

.sort-group {
  min-width: 140px;
}

.sort-group label {
  display: block;
  margin-bottom: 6px;
}

@media (max-width: 768px) {
  .filter-students-container {
    flex-direction: column;
    align-items: stretch;
  }

  .sort-group {
    width: 100%;
  }
}
</style>
