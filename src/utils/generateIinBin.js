import { generateDate, generateValue } from './helpers'

const WEIGHTS_1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
const WEIGHTS_2 = [3, 4, 5, 6, 7, 8, 9, 10, 11, 1, 2]
const CHECKSUM_DIVIDER = 11
const BAD_CHECKSUM = 10

const getBINOrIINCheckSum = (value, weights) => {
  return weights.reduce((checksum, currentWeight, index) =>
    checksum + currentWeight * parseInt(value[index], 10), 0) % CHECKSUM_DIVIDER
}

const getCheckSum = (value) => {
  let checksum = getBINOrIINCheckSum(value, WEIGHTS_1)

  // при остатке от деления 10 - считаем по второму набору весов
  if (checksum === BAD_CHECKSUM) {
    checksum = getBINOrIINCheckSum(value, WEIGHTS_2)
  }
  return checksum === BAD_CHECKSUM ? false : checksum
}

const addZero = (number) => number < 10 ? ('0' + number) : +number

/**
 * Generates IIN
 *
 * @return {*}
 */
const generateIin = () => {
  // date of birth between 1900 and current date - 18 years
  const date = generateDate(new Date(1900, 1, 1), new Date(new Date().getYear() - 18), 1, 1)

  // date  YY.MM.DD
  let value = `${date.getFullYear().toString().slice(2, 4)}${addZero(date.getMonth())}${addZero(date.getDate())}`

  // century and sex
  // XX/male - 3, xx/female - 4, XXI/male - 5, XXI/female - 6
  value += Math.floor(Math.random() * 10 % 2) + (date.getFullYear() < 2000 ? 4 : 2)

  // 8 - 11 symbols are numbers by govs
  value += generateValue(4)

  const checksum = getCheckSum(value)

  return checksum === false ? generateIin() : value + checksum
}

/**
 * Genrates BIN
 *
 * @return {*}
 */
const generateBin = () => {
  const date = generateDate(new Date(1995, 1, 1), new Date())

  // registration date YY.MM
  let value = `${date.getFullYear().toString().slice(2, 4)}${addZero(date.getMonth())}`

  // legal entity type from 4 to 6
  value += Math.floor(Math.random() * 10 % 3) + 4

  // additional tag from 1 to 3
  value += Math.floor(Math.random() * 10 % 3) + 1

  value += generateValue(5)

  const checksum = getCheckSum(value)

  return checksum === false ? generateBin() : value + checksum
}

export {
  generateIin,
  generateBin
}
