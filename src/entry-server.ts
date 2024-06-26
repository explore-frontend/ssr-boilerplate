import { createApp } from './main'

export async function getApp(url: string) {
  const { app, router, hydrationInfo } = createApp(true)
  // passing SSR context object which will be available via useSSRContext()
  // @vitejs/plugin-vue injects code into a component's setup() that registers
  // itself on ctx.modules. After the render, ctx.modules would contain all the
  // components that have been instantiated during this render call.
  router.push(url)
  await router.isReady()

  return { app, hydrationInfo }
}
