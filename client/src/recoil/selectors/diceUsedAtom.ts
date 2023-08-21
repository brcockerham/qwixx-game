import { selector } from 'recoil'
import currentTurnAtom from '../atoms/currentTurnAtom'
import diceMapAtom from './diceMapAtom'
import isActivePlayerAtom from './isActivePlayerAtom'

const diceUsedAtom = selector({
  key: 'diceUsedAtom',
  get: ({ get }) => {
    const diceValue = get(diceMapAtom)
    const currentTurnValue = get(currentTurnAtom)
    const wildValue = diceValue.get('w')
    const wildTotal = wildValue?.reduce((p, c) => p + c, 0) || 0

    return {
      wild: currentTurnValue.some(({ key, value }) => {
        return value === wildTotal &&
          !wildValue?.some(v => diceValue.get(key)?.includes(v))
      }),
      color: !get(isActivePlayerAtom) || currentTurnValue.some(({ value }) => value !== wildTotal),
    }
  }
})

export default diceUsedAtom
