import { getRenderRouter } from './render';
import type { Request, Response, NextFunction, RequestHandler } from 'express';

import { base, isProduction } from '../env';

import compression from 'compression';
import sirv from 'sirv';

import { getViteServer } from '../vite-server';
import 'colors';

type ExpressMiddleware = (req: Request, res: Response, next: NextFunction) => void;

type ExpressRouter = [string, RequestHandler];

export async function createMiddlewares() {
  const middlewares: Array<ExpressMiddleware> = [];

  if (isProduction) {
    middlewares.push(compression());
  } else {
    const { middlewares: viteMiddleware } = await getViteServer();
    middlewares.push(viteMiddleware);
  }

  return middlewares;
}

export async function createRouters() {
  const routers: ExpressRouter[] = [];

  const renderRouter = await getRenderRouter();

  if (isProduction) {
    // Compress all assets
    routers.push([base, sirv('./dist/client', { extensions: [] })]);
  }

  // Server render
  routers.push(renderRouter);

  return routers;
}
