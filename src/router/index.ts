import { useAuthStore } from '@/stores/auth'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      // Lazy loading: https://router.vuejs.org/guide/advanced/lazy-loading.html
      component: () => import('../views/Login.vue'),
    },
    {
      path: '/',
      redirect: '/students',
      meta: { requiresAuth: true },
    },
    {
      path: '/students',
      name: 'students',
      component: () => import('../views/Students.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/students/:id',
      name: 'student-detail',
      component: () => import('../views/StudentDetail.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/courses',
      name: 'courses',
      component: () => import('../views/Courses.vue'),
      meta: { requiresAuth: true },
    },
  ],
})

router.beforeEach((to) => {
  const authStore = useAuthStore()
  const isAuthenticated = authStore.validateAccessToken()

  if (to.meta.requiresAuth && !isAuthenticated) {
    return {
      name: 'login',
      query: { redirect: to.fullPath },
    }
  }

  if (to.name === 'login' && isAuthenticated) {
    return { name: 'students' }
  }
})

export default router
