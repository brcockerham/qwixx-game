import { selector, selectorFamily } from 'recoil';
import scoreCardMapAtom from './scoreCardMapAtom';
import getScoreValues from '../../helpers/getScoreValues';
import userIdAtom from './userIdAtom';
import scoreCardsAtom from '../atoms/scoreCardsAtom';
import numCompleteTurnsAtom from './numCompleteTurnsAtom';
import turnStatusAtom, { TurnStatus } from '../atoms/turnStatusAtom';
import activePlayerAtom from './activePlayerAtom';
import diceMapAtom from './diceMapAtom';
import lockedColorsAtom from './lockedColorsAtom';
import isGameOverAtom from './isGameOverAtom';
import colorsAtom from './colorsAtom';
import getPointRange from '../../helpers/getPointRange';
import isGameStartedAtom from '../atoms/isGameStartedAtom';

const scoreValues = getScoreValues()

const unlockedColorsAtom = selector({
  key: 'unlockedColorsAtom',
  get: ({ get }) => get(colorsAtom).baseColors.filter(({ key }) => !get(lockedColorsAtom).some(c => c.key === key))
})

const isPlayerReadyAtom = selectorFamily({
  key: 'isPlayerReadyAtom',
  get: (userId: string) => ({ get }) => {
    const numTurns = get(scoreCardsAtom)[userId]?.length || 0
    const isPlayerReady = get(turnStatusAtom) === TurnStatus.WAIT ||
      (numTurns ? numTurns > get(numCompleteTurnsAtom) : false)

    return isPlayerReady
  }
})

const pendingLocksAtom = selectorFamily({
  key: 'pendingLocksAtom',
  get: (userId: string) => ({ get }) => {
    const scoreCardMap = get(scoreCardMapAtom(userId))
    const isActivePlayer = userId === get(activePlayerAtom)?.userId
    const diceMap = get(diceMapAtom)
    const unlockedColors = get(unlockedColorsAtom)
    const isGameOver = get(isGameOverAtom)
    const iGameStarted = get(isGameStartedAtom)
    const isPlayerReady = get(isPlayerReadyAtom(userId))

    if (!iGameStarted || isPlayerReady || isGameOver) {
      return
    }

    const wildValue = diceMap.get('w')!
    const wildTotal = wildValue.reduce((p, c) => p + c, 0)

    return unlockedColors.filter(({ key, lockValue }) => {
      const currentScores = scoreCardMap.get(key) || []
      const currentTotal = currentScores.length
      const colorValue = diceMap.get(key)![0]

      if (currentTotal < 4) {
        return false
      }

      const min = Math.min(...currentScores)
      const max = Math.max(...currentScores)

      const validAnswers = new Set([
        wildTotal,
        ...wildValue.map(singleValue => singleValue + colorValue),
      ])

      const numbersLeft = new Set((lockValue === 2
        ? getPointRange(lockValue, min - 1)
        : getPointRange(max + 1, lockValue))
          .filter(value => validAnswers.has(value)))

      if (!numbersLeft.size || !numbersLeft.has(lockValue)) {
        return false
      }

      if (isActivePlayer && currentTotal === 4) {
        return numbersLeft.size >= 2
      } 
      
      if (currentTotal >= 5) {
        return isActivePlayer || numbersLeft.has(wildTotal)
      }

      return false
    }).map(({ key }) => key)
  }
})

const playerCardAtom = selectorFamily({
  key: 'playerScoreAtom',
  get: (userId: string) => ({ get }) => {
    const scoreCardMap = get(scoreCardMapAtom(userId))
    const scoreCardEntries = [...scoreCardMap.entries()]
    const lockedLocks: string[] = []
    const counts: Record<string, number> = {}

    const score = scoreCardEntries
      .map(([key, value]) => {
        if (key === 'p') {
          return value.length * -5
        }

        const { lockValue } = get(colorsAtom).colorMap.get(key)!
        
        if (value.includes(lockValue)) {
          lockedLocks.push(key)
          return scoreValues[value.length + 1]
        }
        
        counts[key] = value.length

        return scoreValues[value.length]
      })
      .reduce((p, c) => p + c, 0)

    const penalties = scoreCardMap.get('p')

    const isActivePlayer = userId === get(activePlayerAtom)?.userId
    const isCurrentPlayer = userId === get(userIdAtom)
    const isPlayerReady = get(isPlayerReadyAtom(userId))
    

    const pendingLocks = get(pendingLocksAtom(userId))

    return {
      score,
      penalties,
      pendingLocks,
      lockedLocks,
      isActivePlayer,
      isCurrentPlayer,
      isPlayerReady,
    }
  }
})


export default playerCardAtom
