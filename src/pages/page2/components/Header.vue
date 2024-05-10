<script setup lang="ts">
defineProps<{
  title: string;
}>()
</script>

<template>
  <div :class="$style.header">
    {{ title }}
  </div>
</template>

<style lang="scss" module>
.header {
  display: flex;
}
</style>
