import { Chance } from 'chance'
import * as express from 'express'
import * as path from 'path'
import { WebSocket, Server } from 'ws'
import { CronJob } from 'cron'

const MAX_GAMES = 20

const oneHour = 60 * 60 * 1000
const oneDay = oneHour * 24

const job = new CronJob(
  '0 * * * *',
  function() {
    const currentTime = new Date().getTime()
    const oneHourAgo = currentTime - oneHour
    const oneDayAgo = currentTime - oneDay

    for (const gameId in games) {
      const { date, start } = games[gameId]
      const gameTime = date.getTime()

      // delete games created over an hour ago and have not started
      // delete all games created over a day ago
      if ((gameTime < oneHourAgo && !start) || gameTime < oneDayAgo) {
        delete games[gameId]
      }
    }
  },
)

interface UserMessage {
  userName: string
  order: number
  gameStart?: true
  restart?: true
}

interface User {
  userId: string
  userName: string
  order: number
  isHost: boolean
}

type Game = {
  clients: Record<string, WebSocket>
  players: Record<string, User>
  messageQueue: Record<string, UserMessage[]>
  hostUserId: string
  start: boolean
  date: Date
}

const randomUserName = () => {
  const chance = Chance()
  return `${chance.prefix()} ${chance.animal()}`
}

const parseQueryParams = (input?: string) => {
  if (!input) return {}

  return Object.fromEntries(input
    .split('&')
    .filter(str => str.includes('='))
    .map(str => {
      const [key, value] = str.replace('/?', '').split('=')

      return [key, value]
    }))
}

const games: Record<string, Game> = {}

const createGame = (hostUserId: string): Game => ({
  clients: {},
  players: {},
  messageQueue: {},
  start: false,
  hostUserId,
  date: new Date(),
})

const wss = new Server({ noServer: true })

const broadcastMessage = (game: Game, message: any) => {
  const data = JSON.stringify(message)

  for (const userId in game.players) {
    const client = game.clients[userId]
    if (client?.readyState === WebSocket.OPEN) {
      client.send(data)
    } else {
      game.messageQueue[userId] = game.messageQueue[userId] || []
      game.messageQueue[userId].push(message)
    }
  }
}

wss.on('connection', (connection, req) => {
  const { userId, gameId } = parseQueryParams(req.url)

  if (!games[gameId] && Object.keys(games).length === MAX_GAMES) {
    return
  }

  const game = games[gameId] = games[gameId] || createGame(userId)

  game.clients[userId] = connection

  if (game.messageQueue[userId]?.length) {
    connection.send(JSON.stringify(game.messageQueue[userId]))
    delete game.messageQueue[userId]
  }

  connection.on('message', data => {
    const message: UserMessage = JSON.parse(data.toString())

    if (!game.players[userId] && !game.start && Object.keys(game.players).length <= 5) {
      game.players[userId] = {
        userId,
        userName: message.userName || randomUserName(),
        order: message.order,
        isHost: game.hostUserId === userId,
      }

      broadcastMessage(game, {
        players: Object.values(game.players).sort((a, b) => b.order - a.order),
      })
    } else {
      if (message.gameStart) {
        game.start = message.gameStart
        game.date = new Date()
      } else if (message.restart) {
        game.start = false
      }
      broadcastMessage(game, { ...message, userId })
    }
    
    
  })

  connection.on('close', () => {
    delete game.clients[userId]
    if (!game.start && userId !== game.hostUserId) {
      delete game.players[userId]
    }
  })
})

const app = express()

app.use(express.static(path.join(__dirname, 'client', 'build')))

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'))
})

const server = app.listen(9000)
job.start()

server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, socket => {
    wss.emit('connection', socket, request)
  })
})

