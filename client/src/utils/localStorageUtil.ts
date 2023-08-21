import { JsonValue } from 'react-use-websocket/dist/lib/types'
import getGameId from './getGameId'

const getCurrentValue = (key: string) => {
  const currentValue = localStorage.getItem(key)

  try {
    return currentValue && JSON.parse(currentValue)
  } catch (e) {
    return currentValue
  }
}

const set = (key: string, value: JsonValue | string) => {
  localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value))
}

const get = (key: string, defaultValue?: JsonValue | string) => {
  const currentValue = getCurrentValue(key)

  if (currentValue == null && defaultValue) {
    set(key, defaultValue)
  }

  return currentValue || defaultValue
}

const getGameValue = (key: string) => {
  const game = get(getGameId()) || {}

  return game[key]
}



const localStorageUtil = {
  set,
  get,
  getGameValue,
}


export default localStorageUtil
