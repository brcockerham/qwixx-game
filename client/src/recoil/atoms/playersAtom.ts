import { Player } from '../../types';
import createPersistedAtom from './createPersistedAtom';

const playersAtom = createPersistedAtom<Player[]>({
  key: 'playersAtom',
  default: [],
})

export default playersAtom
