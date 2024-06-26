import { isServer, useQuery } from '@tanstack/vue-query'
import { onServerPrefetch, ref } from 'vue'
import { useRoute } from 'vue-router'

import { createModel } from '@/utils/model'

type MockResponse = {
  result: number
  data: {
    abc: number
  }
}

export const usePage1Model = createModel(() => {
  const route = useRoute()
  const { data, suspense } = useQuery({
    queryKey: ['page1', route.path],
    refetchOnMount: true,
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
  onServerPrefetch(async () => {
    await suspense()
    console.error('李克和回复')
  })
  // 定义数据
  const count = ref(0)

  return {
    count,
    data,
  }
})
