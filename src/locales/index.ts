import enLocales from './en-US.json'
import zhLocales from './zh-CN.json'

export const messages = {
  'en-US': enLocales,
  'zh-CN': zhLocales,
} as const

export const defaultLocale = 'zh-CN'

export type MessageSchema = (typeof messages)['zh-CN']
