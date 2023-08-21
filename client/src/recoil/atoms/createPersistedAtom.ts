import { AtomOptions, atom } from 'recoil'
import localStorageEffect from '../effects/localStorageEffect'

const createPersistedAtom = <T>(options: AtomOptions<T>) => atom<T>({
  ...options,
  effects: [
    ...options.effects || [],
    localStorageEffect(options.key),
  ]
})

export default createPersistedAtom
