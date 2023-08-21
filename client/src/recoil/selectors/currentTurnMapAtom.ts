import { selector } from 'recoil'
import arrayToMap from '../../helpers/arrayToMap'
import currentTurnAtom from '../atoms/currentTurnAtom'

const currentTurnMapAtom = selector({
  key: 'currentTurnMapAtom',
  get: ({ get }) => arrayToMap(get(currentTurnAtom)),
})

export default currentTurnMapAtom
