import { PointBox } from '../../types';
import createPersistedAtom from './createPersistedAtom';

const scoreCardsAtom = createPersistedAtom<Record<string, PointBox[][]>>({
  key: 'scoreCardsAtom',
  default: {},
})

export default scoreCardsAtom

