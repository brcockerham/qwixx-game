const getRandomInt = (min: number, max: number) => {
  max = Math.ceil(max)
  return Math.floor(Math.random() * max) + min
}

export default getRandomInt
