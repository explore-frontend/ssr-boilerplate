import { useI18n as useI18nVue } from 'vue-i18n'

import { MessageSchema } from '@/locales'

export function useI18n() {
  // TODO还差其他类型，以及override掉全局消息的类型
  return useI18nVue<{ message: MessageSchema }>()
}
