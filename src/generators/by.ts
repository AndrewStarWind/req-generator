import { SECOND_LETTERS, unpChecksum } from '../validators/by'
import { randomDigits, randomInt, randomItem, retry } from './random'

const withUnpChecksum = (body: string): string | null => {
  const checksum = unpChecksum(body)
  return checksum === null ? null : body + checksum
}

/** УНП юрлица: первая цифра - код области (1-7), всего 9 цифр. */
export const generateUnp = (): string =>
  retry(() => withUnpChecksum(`${randomInt(7) + 1}${randomDigits(7)}`))

/** УНП с буквами: буква + буква из ABCEHKMOPT + 6 цифр + контрольная. */
export const generateUnpIe = (): string =>
  retry(() => withUnpChecksum(`${randomItem('ABCEHK')}${randomItem(SECOND_LETTERS)}${randomDigits(6)}`))
