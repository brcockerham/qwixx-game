import createPersistedAtom from './createPersistedAtom'

const diceAtom = createPersistedAtom<number[][]>({
  key: 'diceAtom',
  default: [],
})

export default diceAtom
