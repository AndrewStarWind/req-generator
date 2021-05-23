import { generateValue } from './helpers'

const IE_LENGTH = 15
const ORG_LENGTH = 13

const LEGAL_ENTITY_ID_1 = 1
const LEGAL_ENTITY_ID_2 = 5
const IE_ID = 3
const NUMBER_ID = 2
const allowsFirstDig = [LEGAL_ENTITY_ID_1, IE_ID, NUMBER_ID, LEGAL_ENTITY_ID_2]

const generate = (isIE) => {
  const firstDigit = allowsFirstDig[Math.round(Math.random() * 10) % allowsFirstDig.length]
  const value = firstDigit.toString() + generateValue((isIE ? IE_LENGTH : ORG_LENGTH) - 2)
  const ctrlSum = (parseInt(value, 10) % (value.length - 1)) % 10

  return value + ctrlSum
}

export {
  generate
}
