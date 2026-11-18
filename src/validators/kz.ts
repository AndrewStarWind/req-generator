import {
  CENTURY_BY_DIGIT as CENTURY, type Detail, formatDate, fullYearFromTwoDigits, invalid, makeDate, toDigits,
  type ValidationResult, warning, weightedSum
} from './common'
import { type Check, defineValidator } from './define'

/*
 * Логика повторяет бэкенд-валидаторы (INNValidatorKazakhstan / INNValidatorKazakhstanPerson).
 * Тип номера определяется по 5-й цифре:
 *   4–6 → БИН: месяц 01–12, признак (6-я цифра) 0–4; контрольная сумма НЕ проверяется;
 *   0–3 → ИИН: месяц 01–12, день 01–31, век/пол (7-я цифра) 0–6; контрольная сумма НЕ проверяется;
 *   7–9 → только контрольная сумма.
 * Ошибкой считается только то, что отклонит бэкенд. Остальные несоответствия
 * (контрольная сумма, несуществующая дата и т. п.) показываются как предупреждения.
 */

const WEIGHTS_1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
const WEIGHTS_2 = [3, 4, 5, 6, 7, 8, 9, 10, 11, 1, 2]

/** Контрольная цифра ИИН/БИН; null - номер с такой основой невозможен. */
export function iinBinChecksum (digits: readonly number[]): number | null {
  let sum = weightedSum(digits, WEIGHTS_1) % 11
  if (sum === 10) sum = weightedSum(digits, WEIGHTS_2) % 11
  return sum === 10 ? null : sum
}

type Kind = 'bin' | 'iin' | 'other'

const typeDigit = (value: string) => Number(value.charAt(4))
const kindOf = (value: string): Kind => {
  const digit = typeDigit(value)
  return digit >= 4 && digit <= 6 ? 'bin' : digit <= 3 ? 'iin' : 'other'
}

const checksumProblem = (value: string): string | null => {
  const expected = iinBinChecksum(toDigits(value))
  if (expected === null) return 'Такой номер не может существовать: остаток контрольной суммы 10'
  return String(expected) === value.charAt(11) ? null : `Контрольная цифра не совпадает: ожидается ${expected}`
}

/** Расхождение, которое бэкенд для ИИН и БИН не проверяет. */
const unchecked = (message: string) => warning(`${message} (бэкенд это не проверяет)`)

/** Для 5-й цифры 7–9 бэкенд проверяет только контрольную сумму. */
const otherChecks: Check[] = [
  (value) => {
    const problem = checksumProblem(value)
    return problem ? invalid(problem) : null
  },
  (value) => warning(`Ни ИИН, ни БИН (5-я цифра ${value.charAt(4)}), проверена только контрольная сумма`)
]

// ---------- БИН ----------

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

const binChecks: Check[] = [
  (value) => {
    const month = Number(value.slice(2, 4))
    return month >= 1 && month <= 12 ? null : invalid(`Несуществующий месяц регистрации: ${value.slice(2, 4)}`)
  },
  (value) => Number(value.charAt(5)) <= 4
    ? null
    : invalid(`6-я цифра (признак) должна быть от 0 до 4, а не ${value.charAt(5)}`),
  (value) => {
    const problem = checksumProblem(value)
    return problem ? unchecked(problem) : null
  }
]

const binDetails = (value: string): Detail[] => {
  // век в БИН не указан: 98 → 1998, 05 → 2005
  const year = fullYearFromTwoDigits(Number(value.slice(0, 2)))
  const details: Detail[] = [['Регистрация', `${value.slice(2, 4)}.${year}`]]
  const type = BIN_TYPES[value.charAt(4)]
  if (type) details.push(['Тип', type])
  details.push(['Признак', BIN_ATTRS[value.charAt(5)] ?? value.charAt(5)])
  return details
}

// ---------- ИИН ----------

// 7-я цифра ИИН: век рождения и пол
const birthYear = (value: string) => (CENTURY[value.charAt(6)] ?? 0) + Number(value.slice(0, 2))
const birthDate = (value: string) =>
  makeDate(birthYear(value), Number(value.slice(2, 4)), Number(value.slice(4, 6)))

const iinChecks: Check[] = [
  (value) => {
    const month = Number(value.slice(2, 4))
    return month >= 1 && month <= 12 ? null : invalid(`Несуществующий месяц рождения: ${value.slice(2, 4)}`)
  },
  (value) => {
    const day = Number(value.slice(4, 6))
    return day >= 1 && day <= 31 ? null : invalid(`Несуществующий день рождения: ${value.slice(4, 6)}`)
  },
  (value) => Number(value.charAt(6)) <= 6
    ? null
    : invalid(`7-я цифра (век и пол) должна быть от 0 до 6, а не ${value.charAt(6)}`),
  (value) => CENTURY[value.charAt(6)] ? null : unchecked('7-я цифра (век и пол) 0 - век рождения не определён'),
  (value) => birthDate(value)
    ? null
    : unchecked(`Несуществующая дата рождения: ${value.slice(4, 6)}.${value.slice(2, 4)}.${birthYear(value)}`),
  (value) => {
    const problem = checksumProblem(value)
    return problem ? unchecked(problem) : null
  },
  (value) => (birthDate(value) ?? 0) > new Date() ? warning('Дата рождения в будущем') : null
]

const iinDetails = (value: string): Detail[] => {
  const date = CENTURY[value.charAt(6)] ? birthDate(value) : null
  return [
    ...(date ? [['Дата рождения', formatDate(date)] as const] : []),
    ...(CENTURY[value.charAt(6)] ? [['Пол', Number(value.charAt(6)) % 2 ? 'мужской' : 'женский'] as const] : [])
  ]
}

// ---------- Сборка ----------

const KIND_NAMES: Record<Kind, string> = { bin: 'БИН', iin: 'ИИН', other: 'номер' }

const byKind = (checks: Record<Kind, Check[]>): Check => (value) => {
  for (const check of checks[kindOf(value)]) {
    const outcome: ValidationResult | null = check(value)
    if (outcome) return outcome
  }
  return null
}

const detailsByKind = (value: string): Detail[] => {
  switch (kindOf(value)) {
    case 'bin': return binDetails(value)
    case 'iin': return iinDetails(value)
    default: return []
  }
}

/**
 * БИН (поле «ИИН/БИН» организации, INNValidatorKazakhstan).
 * Принимает и ИИН: так бэкенд пропускает регистрацию ИП по ИИН.
 */
export const validateBin = defineValidator({
  length: 12,
  checks: [byKind({ bin: binChecks, iin: iinChecks, other: otherChecks })],
  details: detailsByKind,
  validMessage: (value) => kindOf(value) === 'iin' ? 'Корректный ИИН (принимается как ИИН/БИН)' : 'Корректный БИН'
})

/**
 * ИИН (поле частного лица, INNValidatorKazakhstanPerson).
 * БИН юрлица (тип 4, 5) - ошибка; БИН ИП(С) (тип 6) принимается.
 */
export const validateIin = defineValidator({
  length: 12,
  checks: [byKind({
    bin: [
      (value) => typeDigit(value) === 6 ? null : invalid('Перепутан ИИН и БИН: это БИН юрлица'),
      ...binChecks
    ],
    iin: iinChecks,
    other: otherChecks
  })],
  details: detailsByKind,
  validMessage: (value) => `Корректный ${KIND_NAMES[kindOf(value)]}`
})
