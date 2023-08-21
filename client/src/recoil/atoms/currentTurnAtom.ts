import { PointBox } from '../../types'
import createPersistedAtom from './createPersistedAtom'

const currentTurnAtom = createPersistedAtom<PointBox[]>({
  key: 'currentTurnAtom',
  default: [],
})

export default currentTurnAtom
