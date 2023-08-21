import { selector } from 'recoil';
import createPersistedAtom from './createPersistedAtom';
import appLoaded from '../../utils/appLoaded';

export enum TurnStatus {
  WAIT,
  IN_PROGRESS,
  DONE,
}

const _turnStatusAtom = createPersistedAtom({
  key: 'turnStatusAtom',
  default: TurnStatus.WAIT,
})

const turnStatusAtom = selector({
  key: 'turnStatusAtom/selector',
  get: ({ get }) => get(_turnStatusAtom),
  set: ({ set }, newValue) => {
    if (appLoaded.loaded) {
      return set(_turnStatusAtom, newValue)
    }
  }, 
})

export default turnStatusAtom
