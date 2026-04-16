# Student Dashboard — Routing & State Management

## Overview

Migrate your component-based Vue dashboard to use **Vue Router** for page navigation and **Pinia** for shared state management.

---

## Setup

Starting from your session 10 project:

```bash
cd student-dashboard
npm install vue-router@4 pinia
```

---

## New File Structure

```
src/
├── main.js                     ← add router + pinia
├── App.vue                     ← NavBar + <router-view> only
├── router/
│   └── index.js                ← route definitions + guard
├── stores/
│   ├── auth.js                 ← token, username, login(), logout()
│   └── students.js             ← students[], loadStudents(), addStudent(), deleteStudent()
├── views/                      ← pages (one per URL)
│   ├── Login.vue               ← login form page
│   ├── Dashboard.vue           ← student list + search + add form
│   ├── StudentDetail.vue       ← single student view (NEW)
│   └── Courses.vue             ← course list (NEW)
└── components/                 ← reusable pieces
    ├── NavBar.vue              ← reads from authStore directly
    ├── StudentCard.vue          ← receives :student prop
    ├── AddStudentForm.vue       ← emits or calls store directly
    └── SearchBar.vue            ← emits search term
```

---

## Step by Step

### 1. Create the Stores

**src/stores/auth.js:**
- state: token (init from localStorage), username (init from localStorage)
- getters: isLoggedIn (returns !!state.token)
- actions: login(username, password) — fetch /api/token/, store token, return true/false
- actions: logout() — clear state + localStorage

**src/stores/students.js:**
- state: students (array), isLoading (boolean)
- getters: (optional) filteredStudents if you want search in the store
- actions: loadStudents() — fetch /api/students/ using auth token
- actions: addStudent(data) — POST to /api/students/, then reload
- actions: deleteStudent(id) — DELETE, then remove from array

**src/stores/courses.js:**
- state: courses (array), isLoading (boolean)
- actions: loadCourses() — fetch /api/courses/ using auth token

Same pattern as the students store but simpler — just load and display, no add/delete needed.

### 2. Create the Router

**src/router/index.js:**
- Routes: /login → Login, / → Dashboard, /students/:id → StudentDetail, /courses → Courses
- Mark Dashboard, StudentDetail, Courses with meta: { requiresAuth: true }
- Add a beforeEach guard: if route requiresAuth and no token, redirect to /login

### 3. Update main.js

```javascript
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
```

### 4. Simplify App.vue

App.vue should now only contain NavBar and <router-view>. No more v-if for login/dashboard toggling — the router handles that.

### 5. Create the Views

**Login.vue:**
- Form with v-model for username/password
- On submit: call authStore.login(), if success → $router.push('/')

**Dashboard.vue:**
- On mounted: call studentsStore.loadStudents()
- Display search bar, add form, student cards
- StudentCard "View" button links to /students/:id

**StudentDetail.vue (NEW):**
- Read $route.params.id
- Fetch the single student from the API or find from the store
- Display full details
- Back button with $router.back()

**Courses.vue (NEW):**
- Create a src/stores/courses.js store
- Fetch from /api/courses/ in mounted
- Display course list

### 6. Update NavBar

- Import useAuthStore, read auth.isLoggedIn and auth.username directly
- No more props from parent
- Logout calls auth.logout() then $router.push('/login')
- Add router-links: Dashboard, Courses

### 7. Update Other Components

- StudentCard can still receive :student prop (makes sense, it's a reusable card)
- AddStudentForm can call studentsStore.addStudent() directly, or still emit — your choice
- SearchBar can emit to Dashboard, or update a searchTerm in studentsStore

---

## Checklist

- [ ] Pinia installed and wired in main.js
- [ ] Auth store with login/logout actions
- [ ] Students store with load/add/delete actions
- [ ] Vue Router installed and wired in main.js
- [ ] Routes defined for Login, Dashboard, StudentDetail, Courses
- [ ] Route guard redirects to /login when not authenticated
- [ ] App.vue simplified to NavBar + router-view
- [ ] Login.vue redirects to / after successful login
- [ ] Dashboard.vue loads students from store
- [ ] StudentDetail.vue reads :id from route params
- [ ] Courses.vue fetches and displays courses
- [ ] NavBar reads from authStore directly (no props)
- [ ] NavBar has router-links for navigation
- [ ] Scoped styles on all components

---

## Bonus Challenges

- [ ] **Redirect back** — remember where the user was going before login, redirect there after
- [ ] **404 page** — catch unmatched routes with { path: '/:pathMatch(.*)*', component: NotFound }
- [ ] **Active link styling** — style the current nav link differently using .router-link-active
- [ ] **Search in store** — move searchTerm into studentsStore with a filteredStudents getter
- [ ] **Courses store** — add a getCourseById getter and create a CourseDetail view with /courses/:id

---

## When You're Done

```bash
git add .
git commit -m "Session 11: Vue Router + Pinia state management"
git push
```

**Next session**: Deploying to AWS.
