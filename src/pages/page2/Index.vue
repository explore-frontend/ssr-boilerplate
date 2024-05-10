<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
const goBack = () => {
  router.back()
}
</script>

<template>
  <div>
    <h1>Page 2</h1>
    <button @click="goBack">Go Back</button>
  </div>
</template>

<style lang="scss" scoped>
button {
  margin-top: 20px;
}
</style>
