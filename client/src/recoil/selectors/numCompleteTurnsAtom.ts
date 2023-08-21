import { selector } from 'recoil';
import playersAtom from '../atoms/playersAtom';
import scoreCardsAtom from '../atoms/scoreCardsAtom';

const numCompleteTurnsAtom = selector({
  key: 'numCompleteTurnsAtom',
  get: ({ get }) => {
    const numPlayers = get(playersAtom).length
    const playerScoreCards = Object.values(get(scoreCardsAtom))

    return numPlayers && playerScoreCards.length === numPlayers
      ?  Math.min(...playerScoreCards.map(scoreCard => scoreCard.length))
      : 0
  }
})

export default numCompleteTurnsAtom
