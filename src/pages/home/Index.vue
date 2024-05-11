<script setup lang="ts">
import { RouterLink } from 'vue-router'

import HelloWorld from '../../components/HelloWorld.vue'
</script>

<template>
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
    <HelloWorld msg="Vite + Vue" />
    <p>
      <RouterLink to="/page1">Go To Page1</RouterLink>
      <RouterLink to="/page2">Go To Page2</RouterLink>
    </p>
  </div>
</template>

<style lang="scss" scoped>
button {
  margin-top: 20px;
}
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
