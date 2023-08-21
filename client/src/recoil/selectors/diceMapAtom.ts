import { selector } from 'recoil';
import CONSTANTS from '../../constants';
import diceAtom from '../atoms/diceAtom';

const diceMapAtom = selector({
  key: 'diceMapAtom',
  get: ({ get }) => new Map(CONSTANTS.COLORS.map(({ key }, index) => [key, get(diceAtom)[index] || [0]])),
})

export default diceMapAtom
