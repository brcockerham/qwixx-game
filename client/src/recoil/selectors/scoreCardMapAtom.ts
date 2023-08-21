import { selectorFamily } from 'recoil'
import arrayToMap from '../../helpers/arrayToMap'
import scoreCardsAtom from '../atoms/scoreCardsAtom'

const scoreCardMapAtom = selectorFamily({
  key: 'scoreCardMapAtom',
  get: (userId: string) => ({ get }) => {
    const scoreCard = get(scoreCardsAtom)[userId] || []
    return arrayToMap(scoreCard.flat())
  },
})

export default scoreCardMapAtom
