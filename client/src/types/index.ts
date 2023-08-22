type color = 'w' | 'r' | 'y' | 'g' | 'b' | 'p'

export type Color = {
  key: color
  color: string
  lockValue: 0 | 2 | 12
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
