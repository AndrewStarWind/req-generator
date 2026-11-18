import { toDigits } from '../validators/common'
import { glnChecksum } from '../validators/other'
import { randomDigits } from './random'

/** GLN (GS1): 12 цифр + контрольная. */
export const generateGln = (): string => {
  const body = randomDigits(12)
  return body + glnChecksum(toDigits(body))
}

/** UUID версии 4. */
export const generateUuid = (): string => crypto.randomUUID()
