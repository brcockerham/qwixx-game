import { selector } from 'recoil';
import scoreCardsAtom from '../atoms/scoreCardsAtom';
import arrayToMap from '../../helpers/arrayToMap';
import numCompleteTurnsAtom from './numCompleteTurnsAtom';

const playerScoreCardsMapAtom = selector({
  key: 'playerScoreCardsMapAtom',
  get: ({ get }) => {
    const flatScoreCards = Object.values(get(scoreCardsAtom)).flatMap(scoreCards => {
      return scoreCards.filter((_scoreCard, index) => index < get(numCompleteTurnsAtom))
    }).flat()

    return arrayToMap(flatScoreCards)
  },
})

export default playerScoreCardsMapAtom
