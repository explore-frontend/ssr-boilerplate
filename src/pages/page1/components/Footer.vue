<script setup lang="ts">
import { usePage1Model } from '../model'
const { count, data } = usePage1Model()
</script>
<template>
  <div>
    Footer
    {{ count }}
    {{ data }}
  </div>
</template>
<style lang="scss" scoped>
div {
  color: red;
}
</style>
