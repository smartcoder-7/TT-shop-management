export const generateNumericCode = (length = 6) => {
  const generateNumber = () => Math.floor(Math.random() * 10)
  const chars = new Array(length).fill('')
  return chars.map(generateNumber).join('')
}
