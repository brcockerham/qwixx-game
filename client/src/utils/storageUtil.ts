import { JsonValue } from 'react-use-websocket/dist/lib/types'
import getGameId from './getGameId'

const getCurrentValue = (key: string, storage: Storage) => {
  const currentValue = storage.getItem(key)

  try {
    return currentValue && JSON.parse(currentValue)
  } catch (e) {
    return currentValue
  }
}

const set = (storage: Storage) => (key: string, value: JsonValue | string) => {
  storage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value))
}

const get = (storage: Storage) => (key: string, defaultValue?: JsonValue | string) => {
  const currentValue = getCurrentValue(key, storage)

  if (currentValue == null && defaultValue) {
    set(storage)(key, defaultValue)
  }

  return currentValue || defaultValue
}

const storageUtil = {
  localStorage: {
    set: set(localStorage),
    get: get(localStorage),
  },
  sessionStorage: {
    set: (value: JsonValue | string) => set(sessionStorage)(getGameId(), value),
    get: (key?: string) => {
      const game = get(sessionStorage)(getGameId()) || {}
      return key ? game[key] : game
    },
  },
}


export default storageUtil
