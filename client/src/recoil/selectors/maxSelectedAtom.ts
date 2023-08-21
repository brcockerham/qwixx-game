import { selector } from 'recoil'
import currentTurnAtom from '../atoms/currentTurnAtom'
import isActivePlayerAtom from './isActivePlayerAtom'

const maxSelectedAtom = selector({
  key: 'maxSelectedAtom',
  get: ({ get }) => {
    const currentTurn = get(currentTurnAtom)
    const isActivePlayer = get(isActivePlayerAtom)

    if (isActivePlayer) {
      return currentTurn.length === 2 || currentTurn.some(score => score.key === 'p')
    }
    
    return currentTurn.length === 1
  },
})

export default maxSelectedAtom
