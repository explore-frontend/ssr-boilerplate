import { type ViteDevServer, createServer } from 'vite';
import { base } from './env';

let vite: ViteDevServer | undefined;

export async function getViteServer() {
  if (vite) {
    return vite;
  }
  vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
    base,
  });
  return vite;
}
