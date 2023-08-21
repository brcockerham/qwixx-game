import { selector } from 'recoil';
import userIdAtom from './userIdAtom';
import activePlayerAtom from './activePlayerAtom';

const isActivePlayerAtom = selector({
  key: 'isActivePlayerAtom',
  get: ({ get }) => {
    const activePlayer = get(activePlayerAtom)
    const userId = get(userIdAtom)

    return activePlayer?.userId === userId
  }
})

export default isActivePlayerAtom
