import fs from 'node:fs/promises';
import express, { type Request, Response, NextFunction, RequestHandler } from 'express';

import compression from 'compression';
import sirv from 'sirv';

import { base, isProduction, port } from './env';
import { getViteServer } from './vite-server';
import 'colors';

type ExpressMiddleware = (req?: Request, res?: Response, next?: NextFunction) => void;

async function createMiddlewares() {
  const middlewares: Array<ExpressMiddleware> = [];
  if (isProduction) {
    compression();
  } else {
    const { middlewares: viteMiddleware } = await getViteServer();
    middlewares.push(viteMiddleware);
  }

  return middlewares;
}

type ExpressRouter = [string, RequestHandler];

function createRouters() {
  const routers: ExpressRouter[] = [];
  if (isProduction) {
    routers.push([base, sirv('./dist/client', { extensions: [] })]);
  }

  return routers;
}

async function createServer() {
  const app = express();
  console.log('Creating middlewares...'.yellow);
  const middlewares = await createMiddlewares();
  console.log('Creating middlewares... done!'.green);

  console.log('Creating routers...'.yellow);
  const routers = createRouters();
  console.log('Creating routers... done!'.green);

  console.log('Registering middlewares and routes...'.yellow);
  middlewares.forEach((middleware) => app.use(middleware));
  routers.forEach(([path, router]) => app.use(path, router));
  console.log('Registering middlewares and routes... done!'.green);

  return app;
}

(async function startServer() {
  console.log('Creating server...'.yellow);
  const server = await createServer();
  console.log('Creating server... done'.yellow);

  console.log('Server staring...'.yellow);

  server.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`.green);
  });
})();

console.log('Creating middlewares...'.yellow);
