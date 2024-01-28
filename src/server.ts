import express from 'express'
import next, { NextApiHandler } from 'next'
import ServerEngine from './ServerEngine'
import { REALTIME_API_PATH } from './types/CONSTANTS'
import { createServer } from 'http'
import { Server } from 'socket.io'

const port: number = parseInt(process.env.PORT || '3000', 10)
const dev: boolean = process.env.NODE_ENV !== 'production'
const nextApp = next({ dev })
const nextHandler: NextApiHandler = nextApp.getRequestHandler()

nextApp.prepare().then(async () => {
  const app = express()
  const server = createServer(app)
  const io = new Server(server, {
    path: REALTIME_API_PATH
  })
  const engine: ServerEngine = new ServerEngine(io)

  io.attach(server)

  app.route('/api/characters')
    .get((req, res) => {
      const characters = engine.getAllCharacters()
      res.json(Array.from(characters.values()))
    })
    .delete((req, res) => {
      engine.deleteCharacters(JSON.parse(JSON.parse(req.body)))
    })

  //everthing else goes to the nextjs handler
  app.all('*', (req: any, res: any) => nextHandler(req, res))

  server.listen(port, () => {
    console.log(
      `> Server listening at http://localhost:${port} as ${dev ? "development" : process.env.NODE_ENV}`
    )
  })
})