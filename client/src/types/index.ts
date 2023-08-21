type color = 'w' | 'r' | 'y' | 'g' | 'b' | 'p'

export type Color = {
  key: color
  color: string
  isWild?: true
  reverse?: true
}

export type PointBox = {
  key: color
  value: number
}

export type Player =  {
  userId: string
  userName: string
  order: number
  isHost: boolean
}
