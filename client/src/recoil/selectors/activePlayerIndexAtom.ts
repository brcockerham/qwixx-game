import { selector } from 'recoil';
import playersAtom from '../atoms/playersAtom';
import numCompleteTurnsAtom from './numCompleteTurnsAtom';

const activePlayerIndexAtom = selector({
  key: 'activePlayerIndexAtom',
  get: ({ get }) => {
    const players = get(playersAtom)
    const numCompleteTurns = get(numCompleteTurnsAtom)

    const numPlayers = players.length

    return numPlayers
      ? numCompleteTurns % numPlayers
      : 0
  }
})

export default activePlayerIndexAtom
