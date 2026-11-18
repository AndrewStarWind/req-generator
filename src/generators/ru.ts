import {
  FOREIGN_ORG_PREFIX, INN_ORG_WEIGHTS, INN_PERSON_WEIGHTS_11, INN_PERSON_WEIGHTS_12, innChecksum,
  ogrnChecksum, okpoChecksum, snilsChecksum
} from '../validators/ru'
import { randomDigits, randomInt, randomItem } from './random'

/** Первые две цифры ИНН - код региона; региона 00 не существует. */
const digitsWithRegion = (length: number): string => {
  let value = randomDigits(length)
  while (value.startsWith('00')) value = randomDigits(length)
  return value
}

/** ИНН юрлица: 9 цифр + контрольная; у иностранной организации префикс 9909. */
export const generateInnOrg = (isForeign = false): string => {
  const body = isForeign
    ? FOREIGN_ORG_PREFIX + randomDigits(9 - FOREIGN_ORG_PREFIX.length)
    : digitsWithRegion(9)
  return body + innChecksum(INN_ORG_WEIGHTS)(body)
}

/** ИНН физлица / ИП: 10 цифр + две контрольные. */
export const generateInnPerson = (): string => {
  const body = digitsWithRegion(10)
  const withFirst = body + innChecksum(INN_PERSON_WEIGHTS_11)(body)
  return withFirst + innChecksum(INN_PERSON_WEIGHTS_12)(withFirst)
}

export const KPP_TYPES = {
  registration: '01',
  bigTaxPayer: '50',
  envd: '35/77',
  branch: 'branch'
} as const

export type KppType = typeof KPP_TYPES[keyof typeof KPP_TYPES]

const KPP_REASON: Record<KppType, () => string> = {
  [KPP_TYPES.registration]: () => '01',
  [KPP_TYPES.bigTaxPayer]: () => '50',
  [KPP_TYPES.envd]: () => randomItem(['35', '77']),
  // любой код, кроме кодов головной организации
  [KPP_TYPES.branch]: () => {
    let reason = randomDigits(2)
    while (reason === '01' || reason === '50') reason = randomDigits(2)
    return reason
  }
}

/** КПП: код налогового органа (4) + причина постановки (2) + номер (3). */
export const generateKpp = (type: KppType = KPP_TYPES.registration): string =>
  `${randomDigits(4)}${KPP_REASON[type]()}${randomDigits(3)}`

/** ОКПО: 8 цифр у юрлица, 10 - у ИП. */
export const generateOkpo = (isIE: boolean): string => {
  const body = randomDigits(isIE ? 9 : 7)
  return body + okpoChecksum(body + '0')
}

/** ОГРН: первая цифра 1 или 5, всего 13 цифр. */
export const generateOgrn = (): string => {
  const body = randomItem(['1', '5']) + randomDigits(11)
  return body + ogrnChecksum(body + '0')
}

/** ОГРНИП: первая цифра 3, всего 15 цифр. */
export const generateOgrnip = (): string => {
  const body = '3' + randomDigits(13)
  return body + ogrnChecksum(body + '0')
}

/** СНИЛС: 9 цифр + контрольное число (2 цифры). */
export const generateSnils = (): string => {
  const body = randomDigits(9)
  return body + snilsChecksum(body)
}

/**
 * Рег. номер страхователя в СФР: 10 цифр, последняя считается по алгоритму Луна.
 * Официальный алгоритм контроля не опубликован; валидатор проверяет только формат.
 */
export const generateSfr = (): string => {
  const digits = Array.from({ length: 9 }, () => randomInt(10))
  const sum = digits.reduce((acc, digit, i) => {
    const doubled = digit * (i % 2 === 0 ? 2 : 1)
    return acc + (doubled > 9 ? doubled - 9 : doubled)
  }, 0)
  return digits.join('') + ((10 - sum % 10) % 10)
}
