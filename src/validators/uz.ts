import {
  CENTURY_BY_DIGIT as CENTURY, formatDate, invalid, makeDate, toDigits, warning, weightedSum
} from './common'
import { defineValidator } from './define'

/** ИНН (СТИР) Узбекистана: 9 цифр. Публичного алгоритма контроля нет. */
export const validateInnUz = defineValidator({
  length: 9,
  checks: [(value) => value.startsWith('0') ? warning('ИНН не может начинаться с 0') : null],
  validMessage: 'Корректный формат (контрольная сумма не проверяется)'
})

const PINFL_WEIGHTS = [7, 3, 1, 7, 3, 1, 7, 3, 1, 7, 3, 1, 7]

export const pinflChecksum = (digits: readonly number[]): number => weightedSum(digits, PINFL_WEIGHTS) % 10

const birthYear = (value: string) => (CENTURY[value.charAt(0)] ?? 0) + Number(value.slice(5, 7))
const birthDate = (value: string) =>
  makeDate(birthYear(value), Number(value.slice(3, 5)), Number(value.slice(1, 3)))

/** ПИНФЛ (Узбекистан): век/пол + ДДММГГ + 3 цифры района + 3 цифры + контрольная (веса 7-3-1). */
export const validatePinfl = defineValidator({
  length: 14,
  checksums: [{ expected: (value) => pinflChecksum(toDigits(value)) }],
  checks: [
    (value) => CENTURY[value.charAt(0)]
      ? null
      : invalid(`1-я цифра (век и пол) должна быть от 1 до 6, а не ${value.charAt(0)}`),
    (value) => birthDate(value)
      ? null
      : invalid(`Несуществующая дата рождения: ${value.slice(1, 3)}.${value.slice(3, 5)}.${birthYear(value)}`),
    (value) => (birthDate(value) ?? 0) > new Date() ? warning('Дата рождения в будущем') : null
  ],
  details: (value) => {
    const date = birthDate(value)
    return [
      ...(date ? [['Дата рождения', formatDate(date)] as const] : []),
      ['Пол', Number(value.charAt(0)) % 2 ? 'мужской' : 'женский'],
      ['Код района', value.slice(7, 10)]
    ]
  },
  validMessage: 'Корректный ПИНФЛ'
})
