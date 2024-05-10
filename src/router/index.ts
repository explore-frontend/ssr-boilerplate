import { type RouteRecordRaw } from 'vue-router'

export const routes: Readonly<RouteRecordRaw[]> = [
  {
    path: '/page1',
    component: () => import('@/pages/page1/Index.vue'),
  },
]
