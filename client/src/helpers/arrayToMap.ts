import { PointBox } from '../types'

const arrayToMap = (arr: PointBox[]) => {
  const result = new Map<PointBox['key'], number[]>(arr.map(c => [c.key, []]))

  arr.forEach(({ key, value }) => {
    result.get(key)?.push(value)
  })

  return result
}

export default arrayToMap
