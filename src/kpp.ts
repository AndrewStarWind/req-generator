/** Идентификаторы прежних вариантов сохранены для совместимости настроек. */
export const KPP_TYPES = {
  registration: '01',
  bigTaxPayer: '50',
  realEstateFund: 'real-estate-fund',
  artFund: 'art-fund',
  envd: '35/77',
  foreignShared: 'foreign-shared',
  foreignReserveShared: 'foreign-reserve-shared',
  branch: 'branch',
  representation: 'representation',
  subdivision: 'subdivision',
  realEstate: 'real-estate',
  transport: 'transport',
  foreign: 'foreign',
  foreignReserve: 'foreign-reserve'
} as const

export type KppType = typeof KPP_TYPES[keyof typeof KPP_TYPES]

export const KPP_GROUPS = {
  head: 'Только ГО',
  shared: 'ГО и филиал',
  branch: 'Только филиалы и подразделения'
} as const

interface KppReason {
  id: KppType
  label: string
  description: string
  group: keyof typeof KPP_GROUPS
  codes: readonly string[]
  codeLabel: string
}

const numericRange = (first: number, last: number): string[] =>
  Array.from({ length: last - first + 1 }, (_, index) => String(first + index).padStart(2, '0'))

const foreignDescription = 'постановка на учет обособленного подразделения, представительства или филиала иностранной организации'
const foreignReserveDescription = 'резервное значение для обособленного подразделения, представительства или филиала иностранной организации'

/** Порядок записей задаёт порядок групп и пунктов в списке. */
export const KPP_REASONS: readonly KppReason[] = [
  {
    id: KPP_TYPES.registration, label: 'Регистрация', group: 'head', codes: ['01'], codeLabel: '01',
    description: 'постановка на учет российской организации по месту нахождения'
  },
  {
    id: KPP_TYPES.bigTaxPayer, label: 'Крупнейший НП', group: 'head', codes: ['50'], codeLabel: '50',
    description: 'постановка на учет российской организации как крупнейшего налогоплательщика'
  },
  {
    id: KPP_TYPES.realEstateFund, label: 'ЗПИФ недвижимости', group: 'head',
    codes: ['4A', '4B', '4C', '4D', '4E', '4F'], codeLabel: '4A–4F',
    description: 'постановка на учет в налоговом органе управляющей компании по месту нахождения недвижимого имущества, входящего в состав ЗПИФа, переданного в доверительное управление'
  },
  {
    id: KPP_TYPES.artFund, label: 'ЗПИФ художественных ценностей', group: 'head',
    codes: ['5A', '5B', '5C', '5D', '5E', '5F'], codeLabel: '5A–5F',
    description: 'постановка на учет управляющей компании ЗПИФа художественных ценностей'
  },
  {
    id: KPP_TYPES.envd, label: 'ЕНВД', group: 'shared', codes: ['35', '77'], codeLabel: '35,77',
    description: 'постановка на учет плательщиков ЕНВД'
  },
  {
    id: KPP_TYPES.foreignShared, label: 'Иностранное подразделение', group: 'shared',
    codes: ['77'], codeLabel: '77', description: foreignDescription
  },
  {
    id: KPP_TYPES.foreignReserveShared, label: 'Иностранное подразделение (резерв)', group: 'shared',
    codes: ['91'], codeLabel: '91', description: foreignReserveDescription
  },
  {
    id: KPP_TYPES.branch, label: 'Филиал', group: 'branch', codes: ['02', '03', '43'], codeLabel: '02,03,43',
    description: 'постановка на учет российской организации по месту нахождения ее филиала'
  },
  {
    id: KPP_TYPES.representation, label: 'Представительство', group: 'branch', codes: ['04', '05', '44'], codeLabel: '04,05,44',
    description: 'постановка на учет российской организации по месту нахождения ее представительства'
  },
  {
    id: KPP_TYPES.subdivision, label: 'Обособленное подразделение', group: 'branch', codes: ['31', '32', '45'], codeLabel: '31,32,45',
    description: 'постановка на учет российской организации по месту нахождения ее обособленного подразделения'
  },
  {
    id: KPP_TYPES.realEstate, label: 'Недвижимость', group: 'branch', codes: ['06', '07', '08'], codeLabel: '06,07,08',
    description: 'постановка на учет российской организации по месту нахождения ее недвижимого имущества'
  },
  {
    id: KPP_TYPES.transport, label: 'Транспорт', group: 'branch', codes: numericRange(10, 29), codeLabel: '10–29',
    description: 'постановка на учет российской организации по месту нахождения транспортных средств'
  },
  {
    id: KPP_TYPES.foreign, label: 'Иностранное подразделение', group: 'branch',
    codes: [...numericRange(51, 76), ...numericRange(78, 87)], codeLabel: '51–76,78–87', description: foreignDescription
  },
  {
    id: KPP_TYPES.foreignReserve, label: 'Иностранное подразделение (резерв)', group: 'branch',
    codes: [...numericRange(88, 90), ...numericRange(92, 99)], codeLabel: '88–90,92–99', description: foreignReserveDescription
  }
]

/** Неизвестный сохранённый выбор сбрасывается на регистрацию. */
export const normalizeKppType = (value: unknown): KppType =>
  KPP_REASONS.find((reason) => reason.id === value)?.id ?? KPP_TYPES.registration

export const getKppReason = (type: KppType): KppReason =>
  KPP_REASONS.find((reason) => reason.id === type) ?? KPP_REASONS[0]!

/** У кода 77 две причины; одинаковые описания разделённых диапазонов не дублируем. */
export const describeKppCode = (code: string): string =>
  [...new Set(KPP_REASONS.filter((reason) => reason.codes.includes(code)).map((reason) => reason.description))].join('; ')
