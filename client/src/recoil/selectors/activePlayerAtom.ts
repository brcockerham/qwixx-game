import { selector } from 'recoil';
import playersAtom from '../atoms/playersAtom';
import activePlayerIndexAtom from './activePlayerIndexAtom';

const activePlayerAtom = selector({
  key: 'activePlayerAtom',
  get: ({ get }) => {
    const players = get(playersAtom)
    const activePlayerIndex = get(activePlayerIndexAtom)

    return players[activePlayerIndex] ? players[activePlayerIndex] : null
  },
})

export default activePlayerAtom
