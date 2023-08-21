import { AtomEffect } from 'recoil';
import localStorageUtil from '../../utils/localStorageUtil';
import getGameId from '../../utils/getGameId';

const localStorageEffect = <T>(key: string): AtomEffect<T> => ({ setSelf, onSet }) => {
  const gameId = getGameId()

  const savedValue = localStorageUtil.getGameValue(key)
  if (savedValue != null) {
    setSelf(savedValue)
  }

  onSet((newValue, _, isReset) => {
    const currentValue = localStorageUtil.get(gameId)

    if (isReset) {
      delete currentValue[key]
      return localStorageUtil.set(gameId, currentValue)
    }

    return localStorageUtil.set(gameId, {
      ...currentValue,
      [key]: newValue,
    })
  })
}

export default localStorageEffect
