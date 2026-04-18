<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavBar from '@/components/NavBar.vue'
</script>

<template>
  <div class="app-shell">
    <NavBar />

    <main>
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
}

main {
  max-width: 900px;
  margin: 0 auto;
  padding: 30px;
}

@media (max-width: 768px) {
  main {
    padding-left: 20px;
    padding-right: 20px;
  }
}
</style>
