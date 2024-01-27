import { createServer } from "http"
import { parse } from "url"
import next from "next"
import { Server } from "socket.io"
import ServerEngine from "./ServerEngine"
import { REALTIME_API_PATH } from "./types/CONSTANTS"

const port = parseInt(process.env.PORT || "3000", 10)
const dev = process.env.NODE_ENV !== "production"
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    const parsedUrl = parse(req.url!, true)
    //console.log('parsedUrl',parsedUrl)
    const { method, url } = req
    //console.log(url)
    if (url == '/api/characters') {
      console.log(method)
      if (method == 'GET') {
        console.log('do it')
        //return engine.getAllCharacters()
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json')
        const characters = engine.getAllCharacters()
        res.write(JSON.stringify(Array.from(characters.values())))

        res.end()

      }
      else if (method == 'DELETE') {
        let buffer = [];
        req
          .on('error', err => {
            console.error(err);
          })
          .on('data', chunk => {
            buffer.push(chunk);
          })
          .on('end', () => {
            const body = Buffer.concat(buffer).toString();
            // At this point, we have the headers, method, url and body, and can now
            // do whatever we need to in order to respond to this request.
            engine.deleteCharacters(JSON.parse(body))
          });



      }

      return
    }

    handle(req, res, parsedUrl)
  }).listen(port)

  const io = new Server(httpServer, {
    path: REALTIME_API_PATH
    // options
  })

  const engine: ServerEngine = new ServerEngine(io)

  console.log(
    `> Server listening at http://localhost:${port} as ${dev ? "development" : process.env.NODE_ENV
    }`
  )
})
