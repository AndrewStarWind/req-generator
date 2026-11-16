import {
  CENTURY_BY_DIGIT as CENTURY, type Detail, formatDate, fullYearFromTwoDigits, invalid, makeDate, toDigits,
  warning, weightedSum
} from './common'
import { type ChecksumSpec, defineValidator } from './define'

const WEIGHTS_1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
const WEIGHTS_2 = [3, 4, 5, 6, 7, 8, 9, 10, 11, 1, 2]

/** Контрольная цифра ИИН/БИН; null - номер с такой основой невозможен. */
export function iinBinChecksum (digits: readonly number[]): number | null {
  let sum = weightedSum(digits, WEIGHTS_1) % 11
  if (sum === 10) sum = weightedSum(digits, WEIGHTS_2) % 11
  return sum === 10 ? null : sum
}

const checksums: ChecksumSpec[] = [{ expected: (value) => iinBinChecksum(toDigits(value)) }]

// 7-я цифра ИИН: век рождения и пол
const birthYear = (value: string) => (CENTURY[value.charAt(6)] ?? 0) + Number(value.slice(0, 2))
const birthDate = (value: string) =>
  makeDate(birthYear(value), Number(value.slice(2, 4)), Number(value.slice(4, 6)))

/** ИИН (Казахстан): ГГММДД + век/пол + 4 цифры + контрольная. */
export const validateIin = defineValidator({
  length: 12,
  checksums,
  checks: [
    (value) => CENTURY[value.charAt(6)]
      ? null
      : invalid(`7-я цифра (век и пол) должна быть от 1 до 6, а не ${value.charAt(6)}`),
    (value) => birthDate(value)
      ? null
      : invalid(`Несуществующая дата рождения: ${value.slice(4, 6)}.${value.slice(2, 4)}.${birthYear(value)}`),
    (value) => (birthDate(value) ?? 0) > new Date() ? warning('Дата рождения в будущем') : null
  ],
  details: (value) => {
    const date = birthDate(value)
    return [
      ...(date ? [['Дата рождения', formatDate(date)] as const] : []),
      ['Пол', Number(value.charAt(6)) % 2 ? 'мужской' : 'женский']
    ]
  },
  validMessage: 'Корректный ИИН'
})

const BIN_TYPES: Record<string, string> = {
  4: 'юрлицо-резидент',
  5: 'юрлицо-нерезидент',
  6: 'ИП (совместное предпринимательство)'
}
const BIN_ATTRS: Record<string, string> = {
  0: 'головное подразделение',
  1: 'филиал',
  2: 'представительство',
  3: 'крестьянское хозяйство'
}

/** БИН (Казахстан): ГГММ + тип + признак + 5 цифр + контрольная. */
export const validateBin = defineValidator({
  length: 12,
  checksums,
  checks: [
    (value) => {
      const month = Number(value.slice(2, 4))
      return month >= 1 && month <= 12 ? null : invalid(`Несуществующий месяц регистрации: ${value.slice(2, 4)}`)
    },
    (value) => BIN_TYPES[value.charAt(4)]
      ? null
      : invalid(`5-я цифра (тип) должна быть 4, 5 или 6, а не ${value.charAt(4)}`),
    (value) => BIN_ATTRS[value.charAt(5)] ? null : warning(`Неизвестный признак подразделения: ${value.charAt(5)}`)
  ],
  details: (value) => {
    // век в БИН не указан: 98 → 1998, 05 → 2005
    const year = fullYearFromTwoDigits(Number(value.slice(0, 2)))
    const details: Detail[] = [['Регистрация', `${value.slice(2, 4)}.${year}`]]
    const type = BIN_TYPES[value.charAt(4)]
    const attr = BIN_ATTRS[value.charAt(5)]
    if (type) details.push(['Тип', type])
    if (attr) details.push(['Признак', attr])
    return details
  },
  validMessage: 'Корректный БИН'
})
