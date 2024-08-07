import express from 'express'
import next, { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import ServerEngine from './ServerEngine'
import { REALTIME_API_PATH } from './types/CONSTANTS'
import { createServer } from 'http'
import { Server } from 'socket.io'
import Character from './types/Character'
import Player from './types/Player'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })
dotenv.config()
const world: string = process.env.WORLD || 'prod'

console.log('starting server for world', world)

const port: number = parseInt(process.env.PORT || '3000', 10)
const dev: boolean = process.env.NODE_ENV !== 'production'
const nextApp = next({ dev })
const nextHandler: NextApiHandler = nextApp.getRequestHandler()

nextApp.prepare().then(async () => {
  const app = express()
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }));

  const server = createServer(app)
  const io = new Server(server, {
    path: REALTIME_API_PATH
  })
  const engine: ServerEngine = new ServerEngine(io, world)
  engine.start()

  process.on('SIGINT', async function () {
    console.log('SIGINT')
    await engine.stop()
    process.exit()
  })

  process.on('SIGTERM', async function () {
    console.log('SIGTERM')
    await engine.stop()
    process.exit()
  })

  app.route('/admin/reconnect')
    .get(async (req, res) => {
      engine.connectPersistance()
      console.log('reconnected to datastore')
      res.json({ reconnected: true })
    })

  app.route('/api/engine/activeCharacters')
    .get(async (req, res) => {
      const c = engine.getActiveCharacters()
      const newLocal = Array.from(c.entries())
      res.json(newLocal.map(([k, v]) => [k, Array.from(v)]))
    })

  app.route('/api/characters')
    .get(async (req, res) => {
      if (req.query.reload == 'datastore') {
        await engine.loadAllCharacters()
      }
      const characters = engine.getAllCharacters()
      res.json(Array.from(characters.values()))
    })
    .delete((req, res) => {
      engine.deleteCharacters(req.body)
      const characters = engine.getAllCharacters()
      res.json(Array.from(characters.values()))
    })
    .patch(async (req, res) => {
      const update = engine.updateCharacter(new Character(req.body))
      await engine.persistCharacter(update)
      const characters = engine.getAllCharacters()
      res.json(Array.from(characters.values()))
    })

  app.route('/api/players')
    .get((req, res) => {
      const players = engine.getAllPlayers()
      res.json(Array.from(players.values()))
    })
    .delete((req, res) => {
      engine.deletePlayers(req.body)
      const players = engine.getAllPlayers()
      res.json(Array.from(players.values()))
    })
    .patch(async (req, res) => {
      await engine.savePlayer(new Player(req.body))
      const players = engine.getAllPlayers()
      res.json(Array.from(players.values()))
    })

  //everything else goes to the nextjs handler 
  app.all('*', (req: any, res: any) => {
    return nextHandler(req, res)
  })

  server.listen(port, () => {
    console.log(
      `> Server listening at http://localhost:${port} as ${dev ? "development" : process.env.NODE_ENV}`
    )
  })
}).catch((e) => {
  console.log('oops', e)
})