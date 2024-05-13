<script setup lang="ts">
import { RouterView } from 'vue-router'

import { useI18n } from '@/utils/i18n'

const { t } = useI18n()
</script>

<template>
  <div>
    {{ t('hello') }}
    <RouterView></RouterView>
  </div>
</template>
