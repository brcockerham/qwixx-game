import { selector } from 'recoil';
import isActivePlayerAtom from './isActivePlayerAtom';
import turnStatusAtom, { TurnStatus } from '../atoms/turnStatusAtom';
import isGameStartedAtom from '../atoms/isGameStartedAtom';
import isGameOverAtom from './isGameOverAtom';

const isRollDisabledAtom = selector({
  key: 'isRollDisabledAtom',
  get: ({ get }) => {
    const isActivePlayer = get(isActivePlayerAtom)
    const turnStatus = get(turnStatusAtom)
    const isGameStarted = get(isGameStartedAtom)
    const isGameOver = get(isGameOverAtom)

    return isGameOver || !isActivePlayer || !isGameStarted || turnStatus !== TurnStatus.WAIT
  }
})

export default isRollDisabledAtom
