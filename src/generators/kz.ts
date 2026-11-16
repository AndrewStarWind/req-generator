import { pad2, toDigits } from '../validators/common'
import { iinBinChecksum } from '../validators/kz'
import { adultBirthLimit, randomDate, randomDigits, randomItem, retry } from './random'

const withKzChecksum = (body: string): string | null => {
  const checksum = iinBinChecksum(toDigits(body))
  return checksum === null ? null : body + checksum
}

/** 7-я цифра ИИН: век и пол. Нечётные - мужской. */
export type IinCenturySex = 3 | 4 | 5 | 6

const BIRTH_RANGE: Record<IinCenturySex, () => [Date, Date]> = {
  3: () => [new Date(1900, 0, 1), new Date(1999, 11, 31)],
  4: () => [new Date(1900, 0, 1), new Date(1999, 11, 31)],
  5: () => [new Date(2000, 0, 1), adultBirthLimit()],
  6: () => [new Date(2000, 0, 1), adultBirthLimit()]
}

/** ИИН: ГГММДД + век/пол + 4 цифры + контрольная. */
export const generateIin = (centurySex: IinCenturySex = 3): string => retry(() => {
  const date = randomDate(...BIRTH_RANGE[centurySex]())
  const birth = `${String(date.getFullYear()).slice(2)}${pad2(date.getMonth() + 1)}${pad2(date.getDate())}`
  return withKzChecksum(`${birth}${centurySex}${randomDigits(4)}`)
})

/** БИН: ГГММ регистрации + тип (4-6) + признак (1-3) + 5 цифр + контрольная. */
export const generateBin = (): string => retry(() => {
  const date = randomDate(new Date(1995, 0, 1), new Date())
  const registration = `${String(date.getFullYear()).slice(2)}${pad2(date.getMonth() + 1)}`
  return withKzChecksum(`${registration}${randomItem('456')}${randomItem('123')}${randomDigits(5)}`)
})
