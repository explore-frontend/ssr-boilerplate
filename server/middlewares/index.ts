import compression from 'compression'
import type { Request, Response, NextFunction, RequestHandler } from 'express'
import sirv from 'sirv'

import { getRenderRouter } from './render'
import { base, isProduction } from '../env'
import { getViteServer } from '../vite-server'
import 'colors'

type ExpressMiddleware = (req: Request, res: Response, next: NextFunction) => void

type ExpressRouter = [string, RequestHandler]

export async function createMiddlewares() {
  const middlewares: Array<ExpressMiddleware> = []

  if (isProduction) {
    middlewares.push(compression())
  } else {
    const { middlewares: viteMiddleware } = await getViteServer()
    middlewares.push(viteMiddleware)
  }

  return middlewares
}

export async function createRouters() {
  const routers: ExpressRouter[] = []

  const renderRouter = await getRenderRouter()

  if (isProduction) {
    // Compress all assets
    routers.push([base, sirv('./dist/client', { extensions: [] })])
  }

  // Server render
  routers.push(renderRouter)

  return routers
}
