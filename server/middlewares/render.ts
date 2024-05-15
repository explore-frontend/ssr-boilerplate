import { type RequestHandler } from 'express'
import { readFile } from 'node:fs/promises'
import { basename } from 'node:path'
import { fileURLToPath, URL } from 'node:url'
import { renderToNodeStream, type SSRContext } from 'vue/server-renderer'

import { getViteServer } from '../vite-server.js'

function resolvePath(dir: string) {
  return fileURLToPath(new URL(dir, import.meta.url))
}

// Constants
const isProduction = process.env.NODE_ENV === 'production'
const base = process.env.BASE || '/'

// Cached production assets
let onlineTemplate = ''
let onlineSSRManifest: Record<string, Array<string>> | undefined = undefined

async function getTemplateHTMLAndSSRManiFest(url: string): Promise<{
  template: string
  ssrManifest?: Record<string, Array<string>>
}> {
  // for dev server
  if (!isProduction) {
    const vite = await getViteServer()
    // Always read fresh template in development
    const htmlTemplate = await readFile(resolvePath('../../index.html'), 'utf-8')
    const template = await vite.transformIndexHtml(url, htmlTemplate)
    return {
      template,
    }
  }

  // for production
  if (onlineTemplate === '') {
    // Parallel read
    const [template, ssrManifestFile] = await Promise.all([
      readFile(resolvePath('../../dist/client/index.html'), 'utf-8'),
      readFile(resolvePath('../../dist/client/.vite/ssr-manifest.json'), 'utf-8'),
    ])

    onlineTemplate = template

    onlineSSRManifest = JSON.parse(ssrManifestFile)
  }
  return {
    template: onlineTemplate,
    ssrManifest: onlineSSRManifest,
  }
}

function renderPreloadLink(file: string) {
  // 临时解决 legacy js 被 preload 的问题
  if (file.endsWith('.js') && !/.*-legacy-.*\.js/.test(file)) {
    return `<link rel="modulepreload" crossorigin href="${file}">`
  }
  if (file.endsWith('.css')) {
    return `<link rel="stylesheet" href="${file}">`
  }
  if (file.endsWith('.woff')) {
    return ` <link rel="preload" href="${file}" as="font" type="font/woff" crossorigin>`
  }
  if (file.endsWith('.woff2')) {
    return ` <link rel="preload" href="${file}" as="font" type="font/woff2" crossorigin>`
  }
  // TODO
  return ''
}

function renderPreloadLinks(modules: Set<string>, manifest: Record<string, string[]>) {
  let links = ''
  const seen = new Set()
  modules.forEach((id) => {
    const files = manifest[id]
    if (files != null) {
      files.forEach((file) => {
        if (!seen.has(file)) {
          seen.add(file)
          const filename = basename(file)
          const files = manifest[filename]
          if (files != null) {
            for (const depFile of files) {
              links += renderPreloadLink(depFile)
              seen.add(depFile)
            }
          }
          links += renderPreloadLink(file)
        }
      })
    }
  })
  return links
}

async function getStream(url: string) {
  const { template, ssrManifest } = await getTemplateHTMLAndSSRManiFest(url)
  const vite = await getViteServer()

  // TODO online render cache
  const { getApp } = !isProduction
    ? await vite.ssrLoadModule('/src/entry-server.ts')
    : // @ts-expect-error
      await import('../../dist/server/entry-server.js')

  const { app, hydrationInfo } = await getApp(url)

  const ctx: SSRContext = {}
  const stream = renderToNodeStream(app, ctx)

  const preloadLinks = ssrManifest ? renderPreloadLinks(ctx.modules, ssrManifest) : ''

  const [htmlStart, htmlEnd] = template.split('<!--app-html-->')

  return {
    htmlStart: htmlStart?.replace('<!--app-head-->', preloadLinks),
    stream,
    htmlEnd,
    hydrationInfo,
  }
}

export async function getRenderRouter(): Promise<[string, RequestHandler]> {
  const vite = await getViteServer()
  const requestHandler: RequestHandler = async (req, res) => {
    try {
      const url = req.originalUrl.replace(base, '')
      const { htmlStart, htmlEnd, stream, hydrationInfo } = await getStream(url)
      res.status(200).set({ 'Content-Type': 'text/html' })
      res.write(htmlStart)
      for await (const chunk of stream) {
        if (res.closed) {
          break
        }
        res.write(chunk)
      }

      res.write(
        htmlEnd?.replace(
          '<!--app-init-state-->',
          ['<script>', `window.HYDRATION_INIT_STATE=${JSON.stringify(hydrationInfo.toJSON())}`, '</script>'].join(''),
        ),
      )
      res.end()
    } catch (error) {
      const e = error as Error
      vite?.ssrFixStacktrace(e)
      console.log(e.stack)
      res.status(500).end(e.stack)
    }
  }

  return ['*', requestHandler]
}

// import type { SSRRenderContext } from '@pex/ug-ssr-server';
// import { createFetcher, logError, logger, renderPreloadLinks, type RenderOptions } from '@pex/ug-ssr-server/server';
// import stringify from 'safe-stable-stringify';
// import { createSSRApp } from 'vue';
// import { renderToString } from 'vue/server-renderer';

// import { createApp } from './main';
// import { base } from './router';

// export async function render(
//     url: string,
//     manifest: Record<string, string[]>,
//     ctx: SSRRenderContext,
// ): Promise<[string, string, string]> {
//     const semFetcher = createFetcher(ctx);

//     const { app, router, cache } = createApp(
//         createSSRApp,
//         // @ts-expect-error
//         semFetcher,
//         true,
//         ctx,
//     );

//     app.config.errorHandler = (err, instance, info) => {
//         logError(err, info + stringify(instance));
//     };

//     app.config.warnHandler = (msg, instance, trace) => {
//         // logError(err, info + info + stringify(instance))
//         logger.warn({
//             message: msg,
//             tags: {
//                 instance: stringify(instance),
//                 trace,
//             },
//         });
//     };

//     // set the router to the desired URL before rendering
//     await router.push(url.startsWith(base) ? url.replace(base, '') : url);

//     await router.isReady();

//     // passing SSR context object which will be available via useSSRContext()
//     // @vitejs/plugin-vue injects code into a component's setup() that registers
//     // itself on ctx.modules. After the render, ctx.modules would contain all the
//     // components that have been instantiated during this render call.
//     const html = await renderToString(app, ctx);

//     // the SSR manifest generated by Vite contains module -> chunk/asset mapping
//     // which we can then use to determine what files need to be preloaded for this
//     // request.

//     return [html, preloadLinks, cache.extract()];
// }
