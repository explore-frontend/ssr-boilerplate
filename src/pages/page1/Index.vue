<script setup lang="ts">
import { onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'

import Footer from './components/Footer.vue'
import { usePage1Model } from './model'

const page1Model = usePage1Model()
const router = useRouter()
const goPage = () => {
  router.push('page2')
}
onBeforeUnmount(() => {
  page1Model.$dispose()
})
</script>

<template>
  <div>
    <h1>Page 1</h1>
    {{ page1Model.count }}

    {{ page1Model.data }}

    <button @click="page1Model.count++">+count</button>
    <button @click="goPage">Go Page2</button>
    <Footer></Footer>
  </div>
</template>

<style lang="scss" module>
button {
  margin-bottom: 20px;
}
</style>
