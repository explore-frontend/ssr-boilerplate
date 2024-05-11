import { useQuery } from '@tanstack/vue-query'
import { defineStore } from 'pinia'
import { onServerPrefetch, ref } from 'vue'
import { useRoute } from 'vue-router'

type MockResponse = {
  result: number
  data: {
    abc: number
  }
}

export const usePage1Model = defineStore('page1', () => {
  const route = useRoute()
  const { data, suspense } = useQuery({
    queryKey: ['page1', route.path],
    refetchOnMount: true,
    staleTime: 0,
    queryFn: () => {
      console.warn('请求数据了')
      return new Promise<MockResponse>((resolve) => {
        setTimeout(() => {
          resolve({
            result: 1,
            data: {
              abc: 123,
            },
          })
        }, 1000)
      })
    },
  })
  onServerPrefetch(suspense)
  // 定义数据
  const count = ref(0)

  return {
    count,
    data,
  }
})
