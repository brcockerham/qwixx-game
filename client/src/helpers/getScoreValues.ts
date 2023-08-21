const getScoreValues = () => {
  const values: number[] = []

  for (let i = 0; i <= 12; i++) {
    values.push(i + (values[i - 1] || 0))
  }

  return values
}

export default getScoreValues
