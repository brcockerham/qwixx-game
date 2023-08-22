import { selector } from 'recoil';
import diceAtom from '../atoms/diceAtom';
import colorsAtom from './colorsAtom';

const diceMapAtom = selector({
  key: 'diceMapAtom',
  get: ({ get }) => new Map(get(colorsAtom).allColors.map(({ key }, index) => [key, get(diceAtom)[index] || [0]])),
})

export default diceMapAtom
