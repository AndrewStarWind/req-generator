import {
  CENTURY_BY_DIGIT as CENTURY, formatDate, makeDate, toDigits, warning, weightedSum
} from './common'
import { defineValidator } from './define'

/*
 * Логика повторяет бэкенд-валидаторы (INNValidatorUzbekistan / INNValidatorUzbekistanIP):
 * ошибкой считается только неверная длина и контрольная сумма.
 */

const INN_WEIGHTS = [37, 29, 23, 19, 17, 13, 7, 3]

/**
 * Контрольная цифра ИНН (СТИР): floor((1 - frac(S / 11)) · 9), где S - взвешенная сумма первых 8 цифр.
 * В целых числах: floor(9 · (11 - S mod 11) / 11).
 */
export const innUzChecksum = (digits: readonly number[]): number =>
  Math.floor(9 * (11 - weightedSum(digits, INN_WEIGHTS) % 11) / 11)

/** ИНН (СТИР) юрлица Узбекистана: 8 цифр + контрольная. */
export const validateInnUz = defineValidator({
  length: 9,
  checksums: [{ expected: (value) => innUzChecksum(toDigits(value)) }],
  validMessage: 'Корректный ИНН'
})

const PINFL_WEIGHTS = [7, 3, 1, 7, 3, 1, 7, 3, 1, 7, 3, 1, 7]

export const pinflChecksum = (digits: readonly number[]): number => weightedSum(digits, PINFL_WEIGHTS) % 10

const birthYear = (value: string) => (CENTURY[value.charAt(0)] ?? 0) + Number(value.slice(5, 7))
const birthDate = (value: string) =>
  makeDate(birthYear(value), Number(value.slice(3, 5)), Number(value.slice(1, 3)))

/** Расхождение, которое бэкенд для ПИНФЛ не проверяет. */
const unchecked = (message: string) => warning(`${message} (бэкенд это не проверяет)`)

/**
 * ПИНФЛ / ИНН ИП (Узбекистан): век/пол + ДДММГГ + 3 цифры района + 3 цифры + контрольная (веса 7-3-1).
 * Бэкенд проверяет только контрольную сумму; век и дата - предупреждения.
 */
export const validatePinfl = defineValidator({
  length: 14,
  checksums: [{ expected: (value) => pinflChecksum(toDigits(value)) }],
  checks: [
    (value) => CENTURY[value.charAt(0)]
      ? null
      : unchecked(`1-я цифра (век и пол) должна быть от 1 до 6, а не ${value.charAt(0)}`),
    (value) => birthDate(value)
      ? null
      : unchecked(`Несуществующая дата рождения: ${value.slice(1, 3)}.${value.slice(3, 5)}.${birthYear(value)}`),
    (value) => (birthDate(value) ?? 0) > new Date() ? warning('Дата рождения в будущем') : null
  ],
  details: (value) => {
    const date = CENTURY[value.charAt(0)] ? birthDate(value) : null
    return [
      ...(date ? [['Дата рождения', formatDate(date)] as const] : []),
      ...(CENTURY[value.charAt(0)] ? [['Пол', Number(value.charAt(0)) % 2 ? 'мужской' : 'женский'] as const] : []),
      ['Код района', value.slice(7, 10)]
    ]
  },
  validMessage: 'Корректный ПИНФЛ'
})
