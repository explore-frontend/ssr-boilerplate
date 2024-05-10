<script setup lang="ts">
import { useRouter } from 'vue-router'

import Footer from './components/Footer.vue'
const router = useRouter()
const goPage = () => {
  router.push('page2')
}
</script>

<template>
  <div>
    <h1>Page 1</h1>
    <button @click="goPage">Go Page2</button>
    <Footer></Footer>
  </div>
</template>

<style lang="scss" module>
button {
  margin-top: 20px;
}
</style>
