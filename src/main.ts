import { VueQueryPlugin } from '@tanstack/vue-query'
import { createPinia } from 'pinia'
import { createSSRApp } from 'vue'
import { createI18n } from 'vue-i18n'
import { createMemoryHistory, createRouter, createWebHistory } from 'vue-router'

import App from './App.vue'
import { defaultLocale, locales } from './locales'
import { routes } from './router/index'

export function createApp(isServer = false) {
  const app = createSSRApp(App)
  const history = isServer ? createMemoryHistory() : createWebHistory()

  const i18n = createI18n({
    locale: defaultLocale,
    allowComposition: true,
    messages: locales,
  })

  // new QueryClient()

  const router = createRouter({
    history,
    routes,
  })
  const pinia = createPinia()

  app.use(VueQueryPlugin)
  app.use(router)
  app.use(pinia)
  app.use(i18n)

  return { app, router }
}
