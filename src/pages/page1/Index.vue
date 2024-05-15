<script setup lang="ts">
import { useRouter } from 'vue-router'

import ClickLog from '@/components/log/ClickLog.vue'
import ShowLog from '@/components/log/ShowLog.vue'

import Footer from './components/Footer.vue'
import { usePage1Model } from './model'

const { count, data } = usePage1Model()
const router = useRouter()
const goPage = () => {
  router.push('page2')
}
</script>

<template>
  <ShowLog
    :log="{
      event: 'show',
      action: 'example show',
      params: {
        title: 'example title',
        body: 'example body',
      },
    }"
  >
    <div>
      <h1>Page 1</h1>
      {{ count }}

      {{ data }}
      <ClickLog
        :log="{
          event: 'click',
          action: 'example click',
          params: {
            title: 'example title',
            body: 'example body',
          },
        }"
      >
        <!-- 123 -->
        <button>Click me</button>
      </ClickLog>
      <button @click="count++">+count</button>
      <button @click="goPage">Go Page2</button>

      <Footer></Footer>
    </div>
  </ShowLog>
</template>

<style lang="scss" module>
button {
  margin-bottom: 20px;
}
</style>
