import { selector } from 'recoil';
import playersAtom from '../atoms/playersAtom';
import userIdAtom from './userIdAtom';

const isLoggedInAtom = selector({
  key: 'isLoggedInAtom',
  get: ({ get }) => {
    const players = get(playersAtom)
    const userId = get(userIdAtom)

    return players.some(player => player.userId === userId)
  }
})

export default isLoggedInAtom
