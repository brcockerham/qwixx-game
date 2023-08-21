import { selector } from 'recoil'
import diceUsedAtom from './diceUsedAtom'
import diceMapAtom from './diceMapAtom'

const currentAnswersAtom = selector<Map<string, Set<number>>>({
  key: 'currentAnswersAtom',
  get: ({ get }) => {
    const result = new Map()
    const dice = get(diceMapAtom)
    const { wild, color } = get(diceUsedAtom)

    const wildValue = dice.get('w')
    const wildTotal = wildValue?.reduce((p, c) => p + c, 0)

    dice.forEach(([total], key) => {
      const value = new Set()
      if (!wild) {
        value.add(wildTotal)
      }

      if (!color) {
        wildValue?.forEach(wild => value.add(wild + total))
      }

      result.set(key, value)
    })

    return result
  },
})

export default currentAnswersAtom
