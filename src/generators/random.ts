/** Случайное целое из [0, max) - равномерно. */
export const randomInt = (max: number): number => Math.floor(Math.random() * max)

/** Случайный элемент массива или символ строки - равномерно. */
export function randomItem<T> (items: readonly T[]): T
export function randomItem (items: string): string
export function randomItem<T> (items: readonly T[] | string): T | string {
  return items[randomInt(items.length)] as T | string
}

/** Строка из length случайных цифр (ведущие нули возможны). */
export const randomDigits = (length: number): string =>
  Array.from({ length }, () => randomInt(10)).join('')

/** Случайная дата в диапазоне [start, end). */
export const randomDate = (start: Date, end: Date): Date =>
  new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))

/** Повторяет генерацию, пока результат не станет не-null (основа без допустимой контрольной цифры). */
export function retry (generate: () => string | null): string {
  for (;;) {
    const value = generate()
    if (value !== null) return value
  }
}

/** Дата, до которой человеку уже исполнилось 18 лет. */
export const adultBirthLimit = (): Date => new Date(new Date().getFullYear() - 18, 0, 1)
