import { selector, selectorFamily } from 'recoil';
import scoreCardMapAtom from './scoreCardMapAtom';
import getScoreValues from '../../helpers/getScoreValues';
import userIdAtom from './userIdAtom';
import scoreCardsAtom from '../atoms/scoreCardsAtom';
import numCompleteTurnsAtom from './numCompleteTurnsAtom';
import turnStatusAtom, { TurnStatus } from '../atoms/turnStatusAtom';
import activePlayerAtom from './activePlayerAtom';
import isActivePlayerAtom from './isActivePlayerAtom';
import diceMapAtom from './diceMapAtom';
import lockedColorsAtom from './lockedColorsAtom';
import isGameOverAtom from './isGameOverAtom';
import colorsAtom from './colorsAtom';

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
    const isPlayerReady = get(isPlayerReadyAtom(userId))

    if (isPlayerReady || isGameOver) {
      return
    }

    const wildValue = diceMap.get('w')!
    const wildTotal = wildValue.reduce((p, c) => p + c, 0)

    return unlockedColors.filter(({ key, lockValue }) => {
      const currentScores = scoreCardMap.get(key) || []
      const currentTotal = currentScores.length
      const colorValue = diceMap.get(key)![0]

      const min = Math.min(...currentScores)
      const max = Math.max(...currentScores)

      const wildMatch = lockValue === 2
        ? wildTotal < min
        : wildTotal > max

      const colorMatch = wildValue.some(value => {
        const total = value + colorValue

        return lockValue === 2
          ? total < min
          : lockValue === 12 && total > max
      })

      if (isActivePlayer && currentTotal === 4) {
        return wildMatch && colorMatch
      } 
      
      if (currentTotal >= 5) {
        return isActivePlayer
          ? wildMatch || colorMatch
          : wildMatch
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
