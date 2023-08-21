import createPersistedAtom from './createPersistedAtom';

const isGameStartedAtom = createPersistedAtom({
  key: 'isGameStartedAtom',
  default: false,
})

export default isGameStartedAtom
