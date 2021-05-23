import { generateValue } from './helpers'

const IE_INN_LENGTH = 10
const ORG_INN_LENGTH = 9
const WEIGHTS = [3, 7, 2, 4, 10, 3, 5, 9, 4, 6, 8]
const FOREIGHT_START_DIGS = '9909'
const ORG_CHECKSUM_INDEX = 9
const CONTROL_SUM_FIRST_DIVIDER = 11
const CONTROL_SUM_SECOND_DIVIDER = 10
const IE_FIRST_CHECKSUM_INDEX = 10
const IE_SECOND_CHECKSUM_INDEX = 11

const generateIEInn = () => {
  let value = generateValue(IE_INN_LENGTH)
  let sum = 0

  for (let i = 0, j = 1; i < IE_FIRST_CHECKSUM_INDEX; i++, j++) {
    sum += +value.charAt(i) * WEIGHTS[j]
  }
  sum = (sum % CONTROL_SUM_FIRST_DIVIDER) % CONTROL_SUM_SECOND_DIVIDER
  value += sum
  sum = 0
  for (let i = 0, j = 0; i < IE_SECOND_CHECKSUM_INDEX; i++, j++) {
    sum += +value.charAt(i) * WEIGHTS[j]
  }
  sum = (sum % CONTROL_SUM_FIRST_DIVIDER) % CONTROL_SUM_SECOND_DIVIDER
  return value + sum
}

const generateOrgInn = (isForeign) => {
  const value = isForeign
    ? FOREIGHT_START_DIGS + generateValue(ORG_INN_LENGTH - FOREIGHT_START_DIGS.length)
    : generateValue(ORG_INN_LENGTH)
  let sum = 0

  for (let i = 0, j = 2; i < ORG_CHECKSUM_INDEX; i++, j++) {
    sum += +value.charAt(i) * WEIGHTS[j]
  }
  sum = (sum % CONTROL_SUM_FIRST_DIVIDER) % CONTROL_SUM_SECOND_DIVIDER
  return value + sum
}

const generate = (isIE, isForeign) => isIE ? generateIEInn() : generateOrgInn(isForeign)

export { generate }
