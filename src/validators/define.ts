import {
  type Detail, invalid, normalize as defaultNormalize, result, STATUS, symbolsWord, valid,
  type ValidationResult
} from './common'

/** Допустимые символы реквизита. */
export interface Charset {
  regex: RegExp
  /** Для сообщения «Допустимы только …» */
  label: string
}

export const DIGITS: Charset = { regex: /^\d+$/, label: 'цифры' }
export const ALPHANUMERIC: Charset = { regex: /^[\dA-Z]+$/, label: 'цифры и латинские буквы' }

/** Контрольная цифра (или число) реквизита. */
export interface ChecksumSpec {
  /** Ожидаемое значение; null - для такой основы номер невозможен */
  expected: (value: string) => number | string | null
  /** Позиция контрольной цифры или диапазон [start, end); по умолчанию последний символ */
  at?: number | readonly [start: number, end: number]
  /** Начало сообщения об ошибке; по умолчанию «Контрольная цифра» */
  label?: string
  /** Проверять ли для этого значения; по умолчанию всегда */
  when?: (value: string) => boolean
}

/** Смысловая проверка: invalid(…) / warning(…) или null, если всё в порядке. */
export type Check = (value: string) => ValidationResult | null

/** Декларативное описание реквизита для defineValidator. */
export interface ValidatorSpec {
  /** Длина нормализованного значения */
  length: number
  /** Допустимые символы, по умолчанию цифры */
  charset?: Charset
  /** Нормализация ввода; по умолчанию убирает пробелы, дефисы, точки и поднимает регистр */
  normalize?: (raw: string) => string
  /** Структура полного значения */
  pattern?: { regex: RegExp, message: string }
  checksums?: ChecksumSpec[]
  checks?: Check[]
  /** Расшифровка корректного значения (и значения с предупреждением) */
  details?: (value: string) => Detail[]
  /** Сообщение для корректного значения */
  validMessage: string | ((value: string) => string)
}

export interface Validator {
  (raw: string): ValidationResult
  /** Нормализованное значение - его и копируем в буфер */
  normalize: (raw: string) => string
}

/**
 * Собирает валидатор реквизита из декларативного описания.
 * Все реквизиты проверяются одной цепочкой, тексты ошибок общие:
 *
 *   нормализация → пусто → допустимые символы → длина → формат
 *   → контрольные цифры → смысловые проверки → «корректно» + расшифровка
 */
export function defineValidator ({
  length,
  charset = DIGITS,
  normalize = defaultNormalize,
  pattern,
  checksums = [],
  checks = [],
  details = () => [],
  validMessage
}: ValidatorSpec): Validator {
  function validate (raw: string): ValidationResult {
    const value = normalize(raw)
    if (!value) return result(STATUS.EMPTY)
    if (!charset.regex.test(value)) return invalid(`Допустимы только ${charset.label}`)
    if (value.length < length) return result(STATUS.INCOMPLETE, `Введено ${value.length} из ${length}`)
    if (value.length > length) return invalid(`Слишком длинный: ${symbolsWord(value.length)} вместо ${length}`)
    if (pattern && !pattern.regex.test(value)) return invalid(pattern.message)

    for (const { expected, at = length - 1, label = 'Контрольная цифра', when } of checksums) {
      if (when && !when(value)) continue
      const expectedValue = expected(value)
      if (expectedValue === null) return invalid('Такой номер не может существовать: остаток контрольной суммы 10')
      const actual = typeof at === 'number' ? value[at] : value.slice(...at)
      if (String(expectedValue) !== actual) return invalid(`${label} не совпадает: ожидается ${expectedValue}`)
    }

    for (const check of checks) {
      const outcome = check(value)
      if (!outcome) continue
      // предупреждение не отменяет расшифровку; ошибка - отменяет
      return outcome.status === STATUS.INVALID ? outcome : { ...outcome, details: details(value) }
    }

    return valid(typeof validMessage === 'function' ? validMessage(value) : validMessage, details(value))
  }

  return Object.assign(validate, { normalize })
}
