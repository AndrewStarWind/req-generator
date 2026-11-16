export const STATUS = {
  EMPTY: 'empty',
  INCOMPLETE: 'incomplete',
  VALID: 'valid',
  WARNING: 'warning',
  INVALID: 'invalid'
} as const

export type Status = typeof STATUS[keyof typeof STATUS]

/** Строка расшифровки: «название - значение», например ['Код региона', '77']. */
export type Detail = readonly [name: string, value: string]

/** Результат проверки реквизита. */
export interface ValidationResult {
  status: Status
  /** Короткое пояснение для пользователя */
  message: string
  /** Расшифровка реквизита: регион, дата рождения и т. п. */
  details: Detail[]
}

export const result = (status: Status, message = '', details: Detail[] = []): ValidationResult =>
  ({ status, message, details })

export const valid = (message: string, details?: Detail[]) => result(STATUS.VALID, message, details)
export const warning = (message: string, details?: Detail[]) => result(STATUS.WARNING, message, details)
export const invalid = (message: string, details?: Detail[]) => result(STATUS.INVALID, message, details)

/** Убирает разделители, которыми обычно форматируют реквизиты: пробелы, дефисы, точки. */
export const normalize = (raw: string | null | undefined): string =>
  String(raw ?? '').replace(/[\s\-–—./_]/g, '').toUpperCase()

export const toDigits = (value: string): number[] => [...value].map(Number)

/** Σ weights[i] · digits[i]; цифр должно быть не меньше, чем весов. */
export const weightedSum = (digits: readonly number[], weights: readonly number[]): number =>
  weights.reduce((sum, weight, i) => sum + weight * (digits[i] ?? 0), 0)

const plural = (n: number, [one, few, many]: readonly [string, string, string]): string => {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return one
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few
  return many
}

export const symbolsWord = (n: number): string => `${n} ${plural(n, ['символ', 'символа', 'символов'])}`

/** Дата из частей; null, если такой даты не существует (31.02 и т. п.). */
export function makeDate (year: number, month: number, day: number): Date | null {
  const date = new Date(year, month - 1, day)
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day
    ? date
    : null
}

export const pad2 = (n: number): string => String(n).padStart(2, '0')

/** Цифра века и пола в ИИН (KZ) и ПИНФЛ (UZ) → начало века; нечётные - мужской пол. */
export const CENTURY_BY_DIGIT: Readonly<Record<string, number>> = { 1: 1800, 2: 1800, 3: 1900, 4: 1900, 5: 2000, 6: 2000 }

/**
 * Год по двум последним цифрам, когда век в номере не указан: годы, которые ещё не наступили
 * в текущем веке, относятся к прошлому (98 → 1998, 05 → 2005).
 */
export function fullYearFromTwoDigits (yy: number, now: Date = new Date()): number {
  const currentYear = now.getFullYear()
  const century = currentYear - (currentYear % 100)
  return century + yy > currentYear ? century - 100 + yy : century + yy
}

export const formatDate = (date: Date): string =>
  `${pad2(date.getDate())}.${pad2(date.getMonth() + 1)}.${date.getFullYear()}`
