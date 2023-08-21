import { selector } from 'recoil';
import playersAtom from '../atoms/playersAtom';
import userIdAtom from './userIdAtom';

const isHostAtom = selector({
  key: 'isHostAtom',
  get: ({ get }) => {
    const players = get(playersAtom)
    const userId = get(userIdAtom)

    return players.find(player => player.userId === userId)?.isHost || false
  }
})

export default isHostAtom
