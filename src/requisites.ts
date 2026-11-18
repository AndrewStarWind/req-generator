import {
  generateBin, generateGln, generateIin, generateInnOrg, generateInnPerson, generateInnUz, generateKpp,
  generateOgrn, generateOgrnip, generateOkpo, generatePinfl, generateSfr, generateSnils, generateUnp,
  generateUnpIe, generateUuid, type IinCenturySex, KPP_TYPES, type KppType
} from './generators'
import {
  validateBin, validateGln, validateIin, validateInnOrg, validateInnPerson, validateInnUz,
  validateKpp, validateOgrn, validateOgrnip, validateOkpoIe, validateOkpoOrg, validatePinfl,
  validateSfr, validateSnils, validateUnp, validateUnpIe, validateUuid, type Validator
} from './validators'

/** Значение доп. контрола генератора: чекбокс - boolean, селект - string. */
export type OptionValue = boolean | string

export interface CheckboxOption {
  type: 'checkbox'
  label: string
  defaultValue: boolean
}

export interface SelectOption {
  type: 'select'
  label: string
  defaultValue: string
  items: ReadonlyArray<{ value: string, label: string }>
}

export type RequisiteOption = CheckboxOption | SelectOption

interface RequisiteDefinition {
  /** Подпись поля и заголовок истории */
  label: string
  validate: Validator
  /** option - текущее значение доп. контрола, если он есть */
  generate: (option?: OptionValue) => string
  /** Необязательный доп. контрол генератора */
  option?: RequisiteOption
}

const KPP_TYPE_VALUES: readonly string[] = Object.values(KPP_TYPES)
const isKppType = (value: unknown): value is KppType => typeof value === 'string' && KPP_TYPE_VALUES.includes(value)

const IIN_CENTURY_SEX: readonly number[] = [3, 4, 5, 6]
const toIinCenturySex = (value: unknown): IinCenturySex | undefined =>
  IIN_CENTURY_SEX.includes(Number(value)) ? Number(value) as IinCenturySex : undefined

/**
 * Единый реестр реквизитов: всё о реквизите описано в одном месте,
 * и по этому описанию его рисует универсальная строка RequisiteField.
 * Ключ - id реквизита и ключ в хранилище (совпадает с прежней версией: история сохраняется).
 */
const DEFINITIONS = {
  INN: {
    label: 'ИНН ЮЛ',
    validate: validateInnOrg,
    generate: (isForeign) => generateInnOrg(isForeign === true),
    option: { type: 'checkbox', label: 'иностранец', defaultValue: false }
  },
  INNIE: { label: 'ИНН ИП/КФХ', validate: validateInnPerson, generate: generateInnPerson },
  KPP: {
    label: 'КПП',
    validate: validateKpp,
    generate: (type) => generateKpp(isKppType(type) ? type : undefined),
    option: {
      type: 'select',
      label: 'Тип',
      defaultValue: KPP_TYPES.registration,
      items: [
        { value: KPP_TYPES.registration, label: 'По месту регистрации' },
        { value: KPP_TYPES.bigTaxPayer, label: 'Крупнейший налогоплательщик' },
        { value: KPP_TYPES.envd, label: 'ЕНВД' },
        { value: KPP_TYPES.branch, label: 'КПП филиала' }
      ]
    }
  },
  OKPO: { label: 'ОКПО', validate: validateOkpoOrg, generate: () => generateOkpo(false) },
  OKPOIE: { label: 'ОКПО ИП', validate: validateOkpoIe, generate: () => generateOkpo(true) },
  OGRN: { label: 'ОГРН', validate: validateOgrn, generate: generateOgrn },
  OGRNIP: { label: 'ОГРНИП', validate: validateOgrnip, generate: generateOgrnip },
  SNILS: { label: 'СНИЛС', validate: validateSnils, generate: generateSnils },
  SFR: { label: 'Рег. номер СФР', validate: validateSfr, generate: generateSfr },
  UNP: { label: 'УНП', validate: validateUnp, generate: generateUnp },
  UNPIE: { label: 'УНП ИП', validate: validateUnpIe, generate: generateUnpIe },
  BIN: { label: 'БИН', validate: validateBin, generate: generateBin },
  IIN: {
    label: 'ИИН',
    validate: validateIin,
    generate: (centurySex) => generateIin(toIinCenturySex(centurySex)),
    option: {
      type: 'select',
      label: 'Пол',
      defaultValue: '3',
      items: [
        { value: '3', label: 'male XX' },
        { value: '4', label: 'female XX' },
        { value: '5', label: 'male XXI' },
        { value: '6', label: 'female XXI' }
      ]
    }
  },
  INNUZ: { label: 'ИНН', validate: validateInnUz, generate: generateInnUz },
  INNUZIE: { label: 'ПИНФЛ', validate: validatePinfl, generate: generatePinfl },
  GLN: { label: 'GLN', validate: validateGln, generate: generateGln },
  UUID: { label: 'UUID', validate: validateUuid, generate: generateUuid }
} satisfies Record<string, RequisiteDefinition>

export type RequisiteId = keyof typeof DEFINITIONS

export interface Requisite extends RequisiteDefinition {
  id: RequisiteId
}

const ids = Object.keys(DEFINITIONS) as RequisiteId[]

export const REQUISITES = Object.fromEntries(
  ids.map((id) => [id, { id, ...DEFINITIONS[id] } satisfies Requisite])
) as Record<RequisiteId, Requisite>

export interface Tab {
  id: string
  label: string
  fields: Requisite[]
}

const tab = (id: string, label: string, fieldIds: RequisiteId[]): Tab =>
  ({ id, label, fields: fieldIds.map((fieldId) => REQUISITES[fieldId]) })

export const TABS: readonly Tab[] = [
  tab('ru-org', 'RU ЮЛ', ['INN', 'KPP', 'OKPO', 'OGRN', 'GLN', 'SFR']),
  tab('ru-ie', 'RU ИП', ['INNIE', 'SNILS', 'OKPOIE', 'OGRNIP', 'GLN', 'SFR']),
  tab('by', 'BY', ['UNP', 'UNPIE', 'GLN']),
  tab('kz', 'KZ', ['BIN', 'IIN', 'GLN']),
  tab('uz', 'UZ', ['INNUZ', 'INNUZIE', 'GLN']),
  tab('other', 'Другое', ['UUID', 'GLN'])
]
