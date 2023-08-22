import { constSelector } from 'recoil';
import { Color } from '../../types';

const allColors: Color[] = [
  {
    key: 'w',
    color: '#ffffff',
    lockValue: 0,
  },
  {
    key: 'r',
    color: '#e7153b',
    lockValue: 12,
  },
  {
    key: 'y',
    color: '#ffc400',
    lockValue: 12,
  },
  {
    key: 'g',
    color: '#3cac2c',
    lockValue: 2,
  },
  {
    key: 'b',
    color: '#1a61b3',
    lockValue: 2,
  },
]

const baseColors = allColors.filter(color => color.lockValue !== 0)
const colorMap = new Map(allColors.map(color => [color.key, color]))

const colorsAtom = constSelector({
  allColors,
  baseColors,
  colorMap,
})

export default colorsAtom


