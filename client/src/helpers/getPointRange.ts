const getPointRange = (min: number, max: number, reverse = false) => {
  const result = []

  if (!reverse) {
    for (let i = min; i <= max; i++) {
      result.push(i)
    }
  } else {
    for (let i = max; i >= min; i--) {
      result.push(i)
    }
  }

  return result
}

export default getPointRange
