import { pad2, toDigits } from '../validators/common'
import { innUzChecksum, pinflChecksum } from '../validators/uz'
import { adultBirthLimit, randomDate, randomDigits, randomItem } from './random'

/** ИНН (СТИР) организации: начинается с 2 или 3, 8 цифр + контрольная. */
export const generateInnUz = (): string => {
  const body = `${randomItem('23')}${randomDigits(7)}`
  return body + innUzChecksum(toDigits(body))
}

// 1-я цифра ПИНФЛ - век рождения и пол: 3/4 - XX век, 5/6 - XXI век (нечётные - мужской)
const PINFL_BIRTH_RANGE: Record<string, () => [Date, Date]> = {
  3: () => [new Date(1930, 0, 1), new Date(1999, 11, 31)],
  4: () => [new Date(1930, 0, 1), new Date(1999, 11, 31)],
  5: () => [new Date(2000, 0, 1), adultBirthLimit()],
  6: () => [new Date(2000, 0, 1), adultBirthLimit()]
}

/** ПИНФЛ: век/пол + ДДММГГ + 3 цифры района + 3 цифры + контрольная (веса 7-3-1). */
export const generatePinfl = (): string => {
  const centuryDigit = randomItem('3456')
  const range = PINFL_BIRTH_RANGE[centuryDigit]!()
  const date = randomDate(...range)
  const birth = `${pad2(date.getDate())}${pad2(date.getMonth() + 1)}${String(date.getFullYear()).slice(2)}`
  const body = `${centuryDigit}${birth}${randomDigits(6)}`
  return body + pinflChecksum(toDigits(body))
}
