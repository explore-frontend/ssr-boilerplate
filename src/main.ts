import { VueQueryPlugin } from '@tanstack/vue-query'
import { createSSRApp } from 'vue'
import { createMemoryHistory, createRouter, createWebHistory } from 'vue-router'

import App from './App.vue'
import { routes } from './router/index'

export function createApp(isServer = false) {
  const app = createSSRApp(App)
  app.use(VueQueryPlugin)
  const history = isServer ? createWebHistory() : createMemoryHistory()

  const router = createRouter({
    history,
    routes,
  })

  return { app, router }
}
