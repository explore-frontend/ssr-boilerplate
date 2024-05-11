import { VueQueryPlugin } from '@tanstack/vue-query'
import { createPinia } from 'pinia'
import { createSSRApp } from 'vue'
import { createMemoryHistory, createRouter, createWebHistory } from 'vue-router'

import App from './App.vue'
import { routes } from './router/index'

export function createApp(isServer = false) {
  const app = createSSRApp(App)
  const history = isServer ? createMemoryHistory() : createWebHistory()

  // new QueryClient()

  const router = createRouter({
    history,
    routes,
  })
  const pinia = createPinia()

  app.use(VueQueryPlugin)
  app.use(router)
  app.use(pinia)

  return { app, router }
}
