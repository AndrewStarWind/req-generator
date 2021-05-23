import { generateValue } from './helpers'

const IE_LENGTH = 15
const ORG_LENGTH = 13

const generate = (isIE) => {
  const value = generateValue((isIE ? IE_LENGTH : ORG_LENGTH) - 1)
  const ctrlSum = parseInt(value, 10) % (value.length - 1) % 10

  return value + ctrlSum
}

export {
  generate
}
