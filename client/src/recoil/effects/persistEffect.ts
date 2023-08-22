import { AtomEffect } from 'recoil';
import storageUtil from '../../utils/storageUtil';

const persistEffect = <T>(key: string): AtomEffect<T> => ({ setSelf, onSet }) => {
  const savedValue = storageUtil.sessionStorage.get(key)
  if (savedValue != null) {
    setSelf(savedValue)
  }

  onSet((newValue, _, isReset) => {
    const currentValue = storageUtil.sessionStorage.get()

    if (isReset) {
      delete currentValue[key]
      return storageUtil.sessionStorage.set(currentValue)
    }

    return storageUtil.sessionStorage.set({
      ...currentValue,
      [key]: newValue,
    })
  })
}

export default persistEffect
