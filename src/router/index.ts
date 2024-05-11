import { type RouteRecordRaw } from 'vue-router'

export const routes: Readonly<RouteRecordRaw[]> = [
  {
    path: '/',
    component: () => import('@/pages/home/Index.vue'),
  },
  {
    path: '/page1',
    component: () => import('@/pages/page1/Index.vue'),
  },
  {
    path: '/page2',
    component: () => import('@/pages/page2/Index.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]
