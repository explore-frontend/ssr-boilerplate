import { QueryClient, VueQueryPlugin, dehydrate, hydrate } from '@tanstack/vue-query'
import { createSSRApp } from 'vue'
import { createI18n } from 'vue-i18n'
import { createMemoryHistory, createRouter, createWebHistory } from 'vue-router'

import { plugin } from '@/utils/model'

import App from './App.vue'
import { defaultLocale, messages } from './locales'
import { routes } from './router/index'

declare global {
  interface Window {
    HYDRATION_INIT_STATE: Record<string, any>
  }
}

export function createApp(isServer = false) {
  const app = createSSRApp(App)
  const history = isServer ? createMemoryHistory() : createWebHistory()

  const i18n = createI18n({
    legacy: false,
    locale: defaultLocale,
    messages,
  })

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        // 服务端的staleTime最好长一些，主要怕被ServerTime和ClientTime不一致坑到
        // client端的时间可以后续根据经验再调整一下，主要影响两个地方：hydration的耗时，以及其他缓存接口的耗时，暂时先设置成1s
        staleTime: isServer ? 1000 * 60 : 1000,
        // 掉线和window重新focus的时候都先关一下
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
      },
    },
  })

  const hydrationInfo = isServer ? { toJSON: () => dehydrate(queryClient) } : null

  if (!isServer) {
    hydrate(queryClient, window.HYDRATION_INIT_STATE)
  }

  const router = createRouter({
    history,
    routes,
  })
  app.use(i18n)
  // 用于hydration使用
  app.use(VueQueryPlugin, { queryClient })
  app.use(router)
  app.use(plugin)

  return { app, router, hydrationInfo }
}
