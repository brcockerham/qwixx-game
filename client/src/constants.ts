import { Color } from './types'

const COLORS: Color[] = [
  {
    key: 'w',
    color: '#ffffff',
    isWild: true,
  },
  {
    key: 'r',
    color: '#e7153b',
  },
  {
    key: 'y',
    color: '#ffc400',
  },
  {
    key: 'g',
    color: '#3cac2c',
    reverse: true,
  },
  {
    key: 'b',
    color: '#1a61b3',
    reverse: true,
  },
]

const CONSTANTS = {
  COLORS,
  COLORS_MAP: new Map(COLORS.map(color => [color.key, color])),
  BASE_COLORS: COLORS.filter(color => !color.isWild),
}

export default CONSTANTS
