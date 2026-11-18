import { describe, expect, it } from 'vitest'
import {
  generateBin, generateGln, generateIin, generateInnOrg, generateInnPerson, generateInnUz, generateKpp,
  generateOgrn, generateOgrnip, generateOkpo, generatePinfl, generateSfr, generateSnils, generateUnp,
  generateUnpIe, generateUuid, type IinCenturySex, KPP_TYPES
} from './index'
import {
  STATUS, validateBin, validateGln, validateIin, validateInnOrg, validateInnPerson, validateInnUz,
  validateKpp, validateOgrn, validateOgrnip, validateOkpoIe, validateOkpoOrg, validatePinfl,
  validateSfr, validateSnils, validateUnp, validateUnpIe, validateUuid, type Validator
} from '../validators'

const RUNS = 2000

// Каждый генератор много раз подряд; каждое значение обязано пройти свой валидатор
// без ошибок и предупреждений.
const CASES: Array<[name: string, generate: () => string, validate: Validator]> = [
  ['ИНН юрлица', () => generateInnOrg(), validateInnOrg],
  ['ИНН иностранной организации', () => generateInnOrg(true), validateInnOrg],
  ['ИНН ИП', generateInnPerson, validateInnPerson],
  ['КПП по месту регистрации', () => generateKpp(KPP_TYPES.registration), validateKpp],
  ['КПП крупнейшего налогоплательщика', () => generateKpp(KPP_TYPES.bigTaxPayer), validateKpp],
  ['КПП ЕНВД', () => generateKpp(KPP_TYPES.envd), validateKpp],
  ['КПП филиала', () => generateKpp(KPP_TYPES.branch), validateKpp],
  ['ОКПО юрлица', () => generateOkpo(false), validateOkpoOrg],
  ['ОКПО ИП', () => generateOkpo(true), validateOkpoIe],
  ['ОГРН', generateOgrn, validateOgrn],
  ['ОГРНИП', generateOgrnip, validateOgrnip],
  ['СНИЛС', generateSnils, validateSnils],
  ['СФР', generateSfr, validateSfr],
  ['GLN', generateGln, validateGln],
  ['УНП', generateUnp, validateUnp],
  ['УНП ИП', generateUnpIe, validateUnpIe],
  ['БИН', generateBin, validateBin],
  ['ИИН male XX', () => generateIin(3), validateIin],
  ['ИИН female XX', () => generateIin(4), validateIin],
  ['ИИН male XXI', () => generateIin(5), validateIin],
  ['ИИН female XXI', () => generateIin(6), validateIin],
  ['ИНН UZ', generateInnUz, validateInnUz],
  ['ПИНФЛ', generatePinfl, validatePinfl],
  ['UUID', generateUuid, validateUuid]
]

describe.each(CASES)('генератор: %s', (_, generate, validate) => {
  it(`${RUNS} сгенерированных значений проходят валидацию`, () => {
    const failures: string[] = []
    for (let i = 0; i < RUNS; i++) {
      const value = generate()
      const result = validate(value)
      if (result.status !== STATUS.VALID) failures.push(`${value}: ${result.message}`)
    }
    expect(failures.slice(0, 5)).toEqual([])
  })
})

describe('ИИН учитывает выбранный пол и век', () => {
  it.each<[IinCenturySex, string, string]>([
    [3, 'мужской', '19'], [4, 'женский', '19'], [5, 'мужской', '20'], [6, 'женский', '20']
  ])('%i → %s, год %s..', (centurySex, sex, yearPrefix) => {
    const details = Object.fromEntries(validateIin(generateIin(centurySex)).details)
    expect(details['Пол']).toBe(sex)
    expect(details['Дата рождения']?.slice(6, 8)).toBe(yearPrefix)
  })
})

describe('КПП: причина постановки соответствует типу', () => {
  it.each([
    [KPP_TYPES.registration, /^01$/],
    [KPP_TYPES.bigTaxPayer, /^50$/],
    [KPP_TYPES.envd, /^(35|77)$/],
    [KPP_TYPES.branch, /^(?!01|50)\d\d$/]
  ])('%s', (type, reason) => {
    for (let i = 0; i < 200; i++) expect(generateKpp(type).slice(4, 6)).toMatch(reason)
  })
})

describe('равномерность', () => {
  it('ОГРН начинается с 1 и 5 примерно поровну', () => {
    const ones = Array.from({ length: 4000 }, generateOgrn).filter((v) => v.startsWith('1')).length
    expect(ones).toBeGreaterThan(1700)
    expect(ones).toBeLessThan(2300)
  })
})
