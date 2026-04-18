<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useCourseStore } from '@/stores/courses'
import { useStudentStore } from '@/stores/students'

const router = useRouter()

const authStore = useAuthStore()
const studentStore = useStudentStore()
const courseStore = useCourseStore()

const { hasValidAccessToken, user } = storeToRefs(authStore)

async function handleLogout() {
  studentStore.clear()
  courseStore.clear()
  authStore.logout()
  await router.replace({ name: 'login' })
}
</script>

<template>
  <header>
    <nav>
      <RouterLink class="brand" :to="{ name: hasValidAccessToken ? 'students' : 'login' }">
        Student Dashboard
      </RouterLink>

      <div v-if="hasValidAccessToken" class="nav-user">
        <div class="nav-links">
          <RouterLink :to="{ name: 'students' }">Students</RouterLink>
          <RouterLink :to="{ name: 'courses' }">Courses</RouterLink>
        </div>

        <p><b>Logged in as:</b> {{ user?.username }}</p>
        <button type="button" @click="handleLogout">Logout</button>
      </div>
    </nav>
  </header>
</template>

<style scoped>
header {
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
}

nav {
  max-width: 900px;
  margin: 0 auto;
  padding: 18px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.brand {
  color: #0f172a;
  font-size: 1.5rem;
  font-weight: 700;
  text-decoration: none;
}

.nav-user {
  display: flex;
  gap: 16px;
  align-items: center;
  color: #334155;
}

.nav-links {
  display: flex;
  gap: 14px;
}

.nav-links a {
  color: #334155;
  font-weight: 600;
  text-decoration: none;
}

.nav-links a.router-link-active {
  color: #0f172a;
  text-decoration: underline;
}

@media (max-width: 768px) {
  nav {
    padding-left: 20px;
    padding-right: 20px;
    flex-direction: column;
    align-items: flex-start;
  }

  .nav-user {
    width: 100%;
    flex-direction: column;
    align-items: flex-start;
  }

  .nav-links {
    flex-wrap: wrap;
  }
}
</style>
