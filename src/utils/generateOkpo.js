import { generateValue, generateWithHistory } from './helpers'

const WEIGHT_DIVIDER = 11
const weightsStartValues = {
  FIRST: 1,
  SECOND: 3
}
const CHECKSUM_DIVIDER = 11
const BAD_CHECKSUM = 10

const okpoCheckSum = (value, start) => {
  let sum = 0
  let weight = start
  const len = value.length

  for (let i = 0; i < len; i++, weight++) {
    weight %= WEIGHT_DIVIDER
    if (weight === 0) {
      weight++
    }
    sum += parseInt(value.charAt(i), 10) * weight
  }
  return sum % CHECKSUM_DIVIDER
}

const _generate = (isIE) => {
  const value = generateValue(isIE ? 9 : 7)

  let checksum = okpoCheckSum(value, weightsStartValues.FIRST)

  if (checksum === BAD_CHECKSUM) {
    checksum = okpoCheckSum(value, weightsStartValues.SECOND) % 10
  }
  return value + checksum
}

const generate = (isIE) => generateWithHistory(isIE ? 'OKPOIE' : 'OKPO', _generate.bind(null, isIE))

export { generate }
