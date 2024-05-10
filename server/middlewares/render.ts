import { readFile } from 'node:fs/promises';
import { type RequestHandler } from 'express';
import { getViteServer } from '../vite-server.js';

// Constants
const isProduction = process.env.NODE_ENV === 'production';
const port = process.env.PORT || 5173;
const base = process.env.BASE || '/';

// Cached production assets
let onlineTemplate = '';
let onlineSSRManifest: string | undefined = undefined;

async function getTemplateHTMLAndSSRManiFest(url: string): Promise<{
  template: string;
  ssrManifest?: string;
}> {
  // for dev server
  if (!isProduction) {
    const vite = await getViteServer();
    // Always read fresh template in development
    const htmlTemplate = await readFile('./index.html', 'utf-8');
    const template = await vite.transformIndexHtml(url, htmlTemplate);
    return {
      template,
    };
  }

  // for production
  if (onlineTemplate === '') {
    // Parallel read
    [onlineTemplate, onlineSSRManifest] = await Promise.all([
      readFile('./dist/client/index.html', 'utf-8'),
      readFile('./dist/client/.vite/ssr-manifest.json', 'utf-8'),
    ]);
  }
  return {
    template: onlineTemplate,
    ssrManifest: onlineSSRManifest,
  };
}

async function getStream(url: string) {
  const { template, ssrManifest } = await getTemplateHTMLAndSSRManiFest(url);
  const vite = await getViteServer();

  // TODO online render cache
  const { render } = !isProduction
    ? await vite.ssrLoadModule('/src/entry-server.ts')
    : // @ts-expect-error
      await import('../../dist/server/entry-server.js');
  const { stream } = render(url, ssrManifest);

  const [htmlStart, htmlEnd] = template.split('<!--app-html-->');

  return {
    htmlStart,
    stream,
    htmlEnd,
  };
}

export async function getRenderRouter(): Promise<[string, RequestHandler]> {
  const vite = await getViteServer();
  const requestHandler: RequestHandler = async (req, res) => {
    try {
      const url = req.originalUrl.replace(base, '');
      const { htmlStart, htmlEnd, stream } = await getStream(url);
      res.status(200).set({ 'Content-Type': 'text/html' });
      res.write(htmlStart);
      for await (const chunk of stream) {
        if (res.closed) break;
        res.write(chunk);
      }
      res.write(htmlEnd);
      res.end();
    } catch (error) {
      const e = error as Error;
      vite?.ssrFixStacktrace(e);
      console.log(e.stack);
      res.status(500).end(e.stack);
    }
  };

  return ['*', requestHandler];
}
