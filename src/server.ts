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
  app.use(express.json());
  const server = createServer(app)
  const io = new Server(server, {
    path: REALTIME_API_PATH
  })
  const engine: ServerEngine = new ServerEngine(io)

  app.route('/api/characters')
    .get(async (req, res) => {
      if (req.query.reload == 'datastore') {
        await engine.loadAllCharacters()
      }
      const characters = engine.getAllCharacters()
      res.json(Array.from(characters.values()))
    })
    .delete((req, res) => {
      console.log('req.body',req.body)
      //console.log('req.body',req.json)

      engine.deleteCharacters(req.body)
      const characters = engine.getAllCharacters()
      res.json(Array.from(characters.values()))
    })
    .post((req, res) => {
      //TODO updates
      console.log('req.body',req.body)
    })


  app.route('/api/players')
    .get((req, res) => {
      const players = engine.getAllPlayers()
      res.json(Array.from(players.values()))
    })
    .delete((req, res) => {
      console.log(req.body)
      engine.deletePlayers(req.body)
      const players = engine.getAllPlayers()
      res.json(Array.from(players.values()))
    })

  //everthing else goes to the nextjs handler
  app.all('*', (req: any, res: any) => nextHandler(req, res))

  server.listen(port, () => {
    console.log(
      `> Server listening at http://localhost:${port} as ${dev ? "development" : process.env.NODE_ENV}`
    )
  })
})