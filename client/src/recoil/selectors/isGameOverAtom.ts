import { selector } from 'recoil';
import playerScoreCardsMapAtom from './playerScoreCardsMapAtom';
import lockedColorsAtom from './lockedColorsAtom';

const MAX_LOCK = 2
const MAX_PENALTY = 4

const isGameOverAtom = selector({
  key: 'isGameOverAtom',
  get: ({ get }) => {
    if (get(lockedColorsAtom).length >= MAX_LOCK) {
      return true
    }
    
    const playerScoreCardsMap = get(playerScoreCardsMapAtom)

    return new Set(playerScoreCardsMap.get('p')).size >= MAX_PENALTY
  }
})

export default isGameOverAtom
