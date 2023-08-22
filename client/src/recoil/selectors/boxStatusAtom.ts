import { selectorFamily } from 'recoil'
import scoreCardMapAtom from './scoreCardMapAtom'
import currentAnswersAtom from './currentAnswersAtom'
import currentTurnMapAtom from './currentTurnMapAtom'
import maxSelectedAtom from './maxSelectedAtom'
import playerScoreCardsMapAtom from './playerScoreCardsMapAtom'
import currentTurnAtom from '../atoms/currentTurnAtom'
import isActivePlayerAtom from './isActivePlayerAtom'
import turnStatusAtom, { TurnStatus } from '../atoms/turnStatusAtom'
import userIdAtom from './userIdAtom'
import colorsAtom from './colorsAtom'

const boxStatusAtom = selectorFamily({
  key: 'boxStatusAtom',
  get: (pointBox: string) => ({ get }) => {
    const { key, value } = JSON.parse(pointBox)
    const isPenalty = key === 'p'

    const currentTurn = get(currentTurnMapAtom).get(key) 
    const scoreCard = get(scoreCardMapAtom(get(userIdAtom))).get(key)
    const isActivePlayer = get(isActivePlayerAtom)
    const turnStatus = get(turnStatusAtom)
    const inProgress = turnStatus === TurnStatus.IN_PROGRESS

    const currentTurnSelected = currentTurn?.includes(value) || false
    const scoreCardSelected = scoreCard?.includes(value) || false

    if (isPenalty) {
      const maxSelected = !!get(currentTurnAtom).length

      return {
        selected: currentTurnSelected || scoreCardSelected,
        currentTurnSelected,
        disabled: (scoreCardSelected || maxSelected || !isActivePlayer || !inProgress) && !currentTurnSelected,
        isLock: false,
        voided: scoreCardSelected,
      }
    }
    
    const currentAnswers = get(currentAnswersAtom)
    const maxSelected = get(maxSelectedAtom)
    const playerScoreCards = get(playerScoreCardsMapAtom).get(key)
    
    const lockValue = get(colorsAtom).colorMap.get(key)!.lockValue

    const isLock = value === lockValue
    const canLock = isLock
      ? ((scoreCard?.length || 0) + (currentTurn?.length || 0)) >= 5
      : true

      const invalid = !currentAnswers.get(key)?.has(value)
      const isLocked = playerScoreCards?.includes(lockValue)
      const voided = isLocked || scoreCard?.some(n => (lockValue === 2 ? n : value) < (lockValue === 2 ? value : n)) || false
    
    return {
      selected: currentTurnSelected || scoreCardSelected,
      currentTurnSelected,
      disabled: (invalid || maxSelected || voided || scoreCardSelected || !canLock || !inProgress) && !currentTurnSelected,
      isLock,
      voided,
    }
  },
})

export default boxStatusAtom
