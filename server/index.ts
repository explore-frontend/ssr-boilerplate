import express from 'express'

import { port } from './env'
import 'colors'
import { createMiddlewares, createRouters } from './middlewares'

async function createServer() {
  const app = express()
  console.log('Creating middlewares...'.yellow)
  const middlewares = await createMiddlewares()
  console.log('Creating middlewares... done!'.green)

  console.log('Creating routers...'.yellow)
  const routers = await createRouters()
  console.log('Creating routers... done!'.green)

  console.log('Registering middlewares and routes...'.yellow)
  middlewares.forEach((middleware) => app.use(middleware))
  routers.forEach(([path, router]) => app.use(path, router))
  console.log('Registering middlewares and routes... done!'.green)

  return app
}

;(async function startServer() {
  console.log('Creating server...'.yellow)
  const server = await createServer()
  console.log('Creating server... done'.yellow)

  console.log('Server staring...'.yellow)

  server.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`.green)
  })
})()
