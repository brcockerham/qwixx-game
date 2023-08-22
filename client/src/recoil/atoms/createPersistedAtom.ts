import { AtomOptions, atom } from 'recoil'
import persistEffect from '../effects/persistEffect'

const createPersistedAtom = <T>(options: AtomOptions<T>) => atom<T>({
  ...options,
  effects: [
    ...options.effects || [],
    persistEffect(options.key),
  ]
})

export default createPersistedAtom
