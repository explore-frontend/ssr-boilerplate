<script setup lang="ts">
import { onMounted } from 'vue'

import { LogParams } from '../../logs'

const props = defineProps<{
  log: LogParams
}>()

onMounted(() => {
  console.log('发送了一个show埋点， 埋点参数是', props.log)
})
</script>

<template>
  <slot />
</template>
