<script setup lang="ts">
import { useRouter } from 'vue-router'

import Footer from '../page1/components/Footer.vue'
const router = useRouter()
const goBack = () => {
  router.back()
}
</script>

<template>
  <div>
    <h1>Page 2</h1>
    <button @click="goBack">Go Back</button>
    <Footer></Footer>
  </div>
</template>

<style lang="scss" scoped>
button {
  margin-top: 20px;
}
</style>
