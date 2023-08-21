import { selector } from 'recoil';
import { Color } from '../../types';
import playerScoreCardsMapAtom from './playerScoreCardsMapAtom';

const isColorLockedAtom = selector({
  key: 'isColorLockedAtom',
  get: ({ get }) => {
    const playerScoreCardsMap = get(playerScoreCardsMapAtom)

    return ({ key, reverse }: Color) => {
      const lockValue = reverse ? 2 : 12
      return playerScoreCardsMap.get(key)?.includes(lockValue)
    }
  }
})

export default isColorLockedAtom
