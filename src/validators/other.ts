import { toDigits } from './common'
import { defineValidator } from './define'

/** Контрольная цифра GS1 по первым 12 цифрам (веса 1-3). */
export const glnChecksum = (digits: readonly number[]): number =>
  (10 - digits.slice(0, 12).reduce((sum, d, i) => sum + d * (i % 2 ? 3 : 1), 0) % 10) % 10

/** GLN (GS1): 13 цифр. */
export const validateGln = defineValidator({
  length: 13,
  checksums: [{ expected: (value) => glnChecksum(toDigits(value)) }],
  details: (value) => [['Префикс GS1', value.slice(0, 3)]],
  validMessage: 'Корректный GLN'
})

/** UUID: регистр не важен, фигурные скобки допускаются. Дефисы - часть формата, их не убираем. */
export const normalizeUuid = (raw: string): string =>
  String(raw ?? '').trim().replace(/^\{|\}$/g, '').toLowerCase()

/** UUID: 8-4-4-4-12 шестнадцатеричных символов. */
export const validateUuid = defineValidator({
  length: 36,
  normalize: normalizeUuid,
  charset: { regex: /^[0-9a-f-]+$/, label: '0–9, a–f и дефисы' },
  pattern: {
    regex: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
    message: 'Формат: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
  },
  details: (value) => [['Версия', value.charAt(14)]],
  validMessage: 'Корректный UUID'
})
