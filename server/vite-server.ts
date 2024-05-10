import { type ViteDevServer, createServer } from 'vite'

import { base } from './env'

// Cache Dev Server
let vite: Promise<ViteDevServer> | undefined = undefined

export async function getViteServer() {
  if (!vite) {
    vite = createServer({
      server: { middlewareMode: true },
      appType: 'custom',
      base,
    })
  }

  return vite
}
