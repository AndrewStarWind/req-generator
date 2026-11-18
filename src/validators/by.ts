import { ALPHANUMERIC, type ChecksumSpec, defineValidator } from './define'

const ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
export const SECOND_LETTERS = 'ABCEHKMOPT'
const WEIGHTS = [29, 23, 19, 17, 13, 7, 5, 3]

/**
 * Контрольная цифра УНП по первым 8 символам. null - для такого номера контрольная цифра
 * невозможна (остаток 10: такие номера не выдаются).
 */
export function unpChecksum (body: string): number | null {
  const sum = [...body].reduce((acc, char, i) => {
    const code = i === 1 && /[A-Z]/.test(char) ? SECOND_LETTERS.indexOf(char) : ALPHABET.indexOf(char)
    return acc + code * (WEIGHTS[i] ?? 0)
  }, 0) % 11
  return sum === 10 ? null : sum
}

const unpChecksums: ChecksumSpec[] = [{ expected: (value) => unpChecksum(value.slice(0, 8)) }]

/** УНП юрлица (Беларусь): 9 цифр. */
export const validateUnp = defineValidator({
  length: 9,
  checksums: unpChecksums,
  validMessage: 'Корректный УНП'
})

/** УНП с буквами (физлица / ИП, Беларусь): буква, буква из ABCEHKMOPT или цифра, 7 цифр. */
export const validateUnpIe = defineValidator({
  length: 9,
  charset: ALPHANUMERIC,
  pattern: {
    regex: new RegExp(`^[A-Z][\\d${SECOND_LETTERS}]\\d{7}$`),
    message: `Формат: буква, затем буква из ${SECOND_LETTERS} или цифра, затем 7 цифр`
  },
  checksums: unpChecksums,
  validMessage: 'Корректный УНП ИП'
})
