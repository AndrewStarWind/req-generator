import { type Detail, toDigits, warning, weightedSum } from './common'
import { ALPHANUMERIC, defineValidator } from './define'
import { describeKppCode } from '../kpp'

export const INN_ORG_WEIGHTS = [2, 4, 10, 3, 5, 9, 4, 6, 8]
export const INN_PERSON_WEIGHTS_11 = [7, 2, 4, 10, 3, 5, 9, 4, 6, 8]
export const INN_PERSON_WEIGHTS_12 = [3, 7, 2, 4, 10, 3, 5, 9, 4, 6, 8]
export const FOREIGN_ORG_PREFIX = '9909'

/** Контрольная цифра ИНН по первым weights.length цифрам value. */
export const innChecksum = (weights: readonly number[]) => (value: string): number =>
  weightedSum(toDigits(value), weights) % 11 % 10

const innDetails = (value: string): Detail[] => [
  ['Код региона', value.slice(0, 2)],
  ['Код инспекции', value.slice(0, 4)]
]

const noRegion00 = (value: string) => (value.startsWith('00') ? warning('Код региона 00 не существует') : null)

/** ИНН юридического лица: 10 цифр, одна контрольная цифра. */
export const validateInnOrg = defineValidator({
  length: 10,
  checksums: [{ expected: innChecksum(INN_ORG_WEIGHTS) }],
  checks: [noRegion00],
  details: innDetails,
  validMessage: (value) => value.startsWith(FOREIGN_ORG_PREFIX)
    ? 'Корректный ИНН иностранной организации'
    : 'Корректный ИНН юрлица'
})

/** ИНН физлица / ИП: 12 цифр, две контрольные цифры. */
export const validateInnPerson = defineValidator({
  length: 12,
  checksums: [
    { expected: innChecksum(INN_PERSON_WEIGHTS_11), at: 10, label: '11-я цифра' },
    { expected: innChecksum(INN_PERSON_WEIGHTS_12), at: 11, label: '12-я цифра' }
  ],
  checks: [noRegion00],
  details: innDetails,
  validMessage: 'Корректный ИНН физлица / ИП'
})

/** КПП: NNNN PP XXX. Контрольной суммы нет - проверяется только структура. */
export const validateKpp = defineValidator({
  length: 9,
  charset: ALPHANUMERIC,
  pattern: { regex: /^\d{4}[\dA-Z]{2}\d{3}$/, message: 'Формат: 4 цифры, 2 цифры или буквы, 3 цифры' },
  details: (value) => {
    const reason = value.slice(4, 6)
    const reasonText = describeKppCode(reason)
    return [
      ['Налоговый орган', value.slice(0, 4)],
      ['Причина постановки', reasonText ? `${reason} — ${reasonText}` : reason]
    ]
  },
  validMessage: 'Корректный формат (у КПП нет контрольной суммы)'
})

const okpoWeightedSum = (digits: readonly number[], startWeight: number): number =>
  digits.reduce((sum, digit, i) => sum + digit * (((i + startWeight - 1) % 10) + 1), 0) % 11

/** Контрольная цифра ОКПО: веса 1..10 по кругу, при остатке 10 - веса с 3, затем остаток 10 → 0. */
export const okpoChecksum = (value: string): number => {
  const body = toDigits(value.slice(0, -1))
  const sum = okpoWeightedSum(body, 1)
  return sum === 10 ? okpoWeightedSum(body, 3) % 10 : sum
}

/** ОКПО юрлица: 8 цифр. */
export const validateOkpoOrg = defineValidator({
  length: 8,
  checksums: [{ expected: okpoChecksum }],
  validMessage: 'Корректный ОКПО юрлица'
})

/** ОКПО ИП: 10 цифр. */
export const validateOkpoIe = defineValidator({
  length: 10,
  checksums: [{ expected: okpoChecksum }],
  validMessage: 'Корректный ОКПО ИП'
})

/** Контроль ОГРН/ОГРНИП - остаток от деления номера без последней цифры на 11 (13) по модулю 10. */
export const ogrnChecksum = (value: string): number =>
  Number(BigInt(value.slice(0, -1)) % BigInt(value.length - 2)) % 10

const ogrnDetails = (value: string): Detail[] => [
  ['Год присвоения', `20${value.slice(1, 3)}`],
  ['Код региона', value.slice(3, 5)]
]

/** ОГРН: 13 цифр, первая - 1 или 5. */
export const validateOgrn = defineValidator({
  length: 13,
  checksums: [{ expected: ogrnChecksum }],
  checks: [(value) => {
    const first = value.charAt(0)
    if (first === '1' || first === '5') return null
    if (first === '3' || first === '4') return warning(`Первая цифра ${first} — признак ОГРНИП, а у ОГРНИП 15 цифр`)
    if (first === '0') return warning('Первая цифра 0 не используется')
    return warning(`Первая цифра ${first} — это ГРН записи в ЕГРЮЛ, а не ОГРН`)
  }],
  details: ogrnDetails,
  validMessage: 'Корректный ОГРН'
})

/** ОГРНИП: 15 цифр, первая - 3. */
export const validateOgrnip = defineValidator({
  length: 15,
  checksums: [{ expected: ogrnChecksum }],
  checks: [(value) => {
    const first = value.charAt(0)
    if (first === '3') return null
    if (first === '4') return warning('Первая цифра 4 — это ГРН записи в ЕГРИП, а не ОГРНИП')
    return warning(`Первая цифра ОГРНИП должна быть 3, а не ${first}`)
  }],
  details: ogrnDetails,
  validMessage: 'Корректный ОГРНИП'
})

// Номера до 001-001-998 выдавались до введения контрольного числа
const SNILS_UNCHECKED_MAX = 1001998
const isSnilsChecked = (value: string) => Number(value.slice(0, 9)) > SNILS_UNCHECKED_MAX

/** Контрольное число СНИЛС по первым 9 цифрам: две цифры, 100 и 101 → 00. */
export const snilsChecksum = (value: string): string =>
  String(weightedSum(toDigits(value), [9, 8, 7, 6, 5, 4, 3, 2, 1]) % 101 % 100).padStart(2, '0')

/** СНИЛС: 11 цифр, две последние - контрольное число. */
export const validateSnils = defineValidator({
  length: 11,
  checksums: [{
    expected: snilsChecksum,
    at: [9, 11],
    label: 'Контрольное число',
    when: isSnilsChecked
  }],
  details: (value) => [
    ['Формат', `${value.slice(0, 3)}-${value.slice(3, 6)}-${value.slice(6, 9)} ${value.slice(9)}`]
  ],
  validMessage: (value) => isSnilsChecked(value)
    ? 'Корректный СНИЛС'
    : 'Корректный СНИЛС (номер выдан до введения контрольного числа)'
})

/** Рег. номер страхователя в СФР: 10 цифр. Публичного алгоритма контроля нет. */
export const validateSfr = defineValidator({
  length: 10,
  validMessage: 'Корректный формат (контрольная сумма не проверяется)'
})
