import { selector } from 'recoil';
import playerScoreCardsMapAtom from './playerScoreCardsMapAtom';
import colorsAtom from './colorsAtom';

const lockedColorsAtom = selector({
  key: 'lockedColorsAtom',
  get: ({ get }) => {
    const playerScoreCardsMap = get(playerScoreCardsMapAtom)

    return get(colorsAtom)
    .baseColors
    .filter(({ key, lockValue }) => playerScoreCardsMap.get(key)?.includes(lockValue))
  }
})

export default lockedColorsAtom
