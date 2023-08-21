import { selectorFamily } from 'recoil';
import scoreCardMapAtom from './scoreCardMapAtom';
import getScoreValues from '../../helpers/getScoreValues';
import CONSTANTS from '../../constants';
import userIdAtom from './userIdAtom';
import scoreCardsAtom from '../atoms/scoreCardsAtom';
import numCompleteTurnsAtom from './numCompleteTurnsAtom';
import turnStatusAtom, { TurnStatus } from '../atoms/turnStatusAtom';
import activePlayerAtom from './activePlayerAtom';

const scoreValues = getScoreValues()

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

        const { reverse } = CONSTANTS.COLORS_MAP.get(key)!
        
        if (value.includes(reverse ? 2 : 12)) {
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

    const numTurns = get(scoreCardsAtom)[userId]?.length || 0
    const isPlayerReady = get(turnStatusAtom) === TurnStatus.WAIT ||
      (numTurns ? numTurns > get(numCompleteTurnsAtom) : false)

    const pendingLocks = Object.keys(counts).filter(key => counts[key] >= 5)

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
