import { type Plugin, onBeforeUnmount, getCurrentInstance, provide, inject } from 'vue'

type ModelContextMap = Map<FNModelCreator<any>, ReturnType<typeof createModelContextInfo>>

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    /**
     * 缓存一下之前的context数据
     */
    modelContextMap: ModelContextMap
  }
}

export const plugin: Plugin = {
  install(app) {
    // eslint-disable-next-line
    app.config.globalProperties.modelContextMap = new Map()
  },
}

function useRootModelContextMap(): ModelContextMap | undefined {
  const modelContextMap = getCurrentInstance()?.root.appContext.config.globalProperties.modelContextMap
  // if self is not provided store, then use injected store from parent
  return modelContextMap
}

type ModelConstructor<T> = () => T

type FNModelCreator<T> = {
  fn: ModelConstructor<T>
}

type RebornInstanceType<T extends FNModelCreator<any>> = T extends FNModelCreator<infer U> ? U : never

function createModelInternal<T>(fn: ModelConstructor<T>) {
  return {
    fn,
  }
}

function createModelContextInfo<T extends FNModelCreator<any> = FNModelCreator<any>>(ctor: T) {
  const vueInstance = getCurrentInstance()
  return {
    key: Symbol('modelContext'),
    instance: ctor.fn(),
    vueInstance,
  }
}

export function useModel<T extends FNModelCreator<any> = FNModelCreator<any>>(ctor: T) {
  const instance = getCurrentInstance()

  if (!instance) {
    throw new Error('useModel must use in a setup context!')
  }

  const modelContextMap = useRootModelContextMap()

  if (!modelContextMap) {
    throw new Error(`You haven't install model for @tanstack/vue-query!!`)
  }

  if (!modelContextMap.has(ctor)) {
    const contextInfo = createModelContextInfo(ctor)
    modelContextMap.set(ctor, contextInfo)
  }

  const modelInfo = modelContextMap.get(ctor)!

  if (modelInfo.vueInstance === instance) {
    // 顶层组件，provide起点
    provide(modelInfo.key, modelInfo.instance)

    // Server Prefetch会随着app被GC后GC掉
    onBeforeUnmount(() => {
      modelContextMap.delete(ctor)
    })

    return modelInfo.instance as RebornInstanceType<T>
  }

  // 子组件，消费inject来的实例，避免重新创建
  return inject(modelInfo.key) as RebornInstanceType<T>
}

export function createModel<T>(fn: ModelConstructor<T>) {
  const model = createModelInternal(fn)
  return () => useModel(model)
}
