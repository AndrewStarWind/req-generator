import { describe, expect, it } from 'vitest'
import { KPP_REASONS, KPP_TYPES, normalizeKppType } from './kpp'

describe('применимость КПП', () => {
  it('сортирует причины: только ГО, ГО и филиал, только подразделения', () => {
    expect(KPP_REASONS.map((reason) => reason.group)).toEqual([
      'head', 'head', 'head', 'head', 'shared', 'shared', 'shared',
      'branch', 'branch', 'branch', 'branch', 'branch', 'branch', 'branch'
    ])
  })

  it('разрешает для ГО только установленные коды', () => {
    const codes = KPP_REASONS.filter((reason) => reason.group !== 'branch').flatMap((reason) => reason.codes)
    expect([...new Set(codes)].sort()).toEqual([
      '01', '35', '4A', '4B', '4C', '4D', '4E', '4F', '50', '5A', '5B', '5C', '5D', '5E', '5F', '77', '91'
    ])
  })

  it('разделяет иностранные диапазоны без потерь и пересечений', () => {
    const foreignTypes = new Set<string>([
      KPP_TYPES.foreignShared, KPP_TYPES.foreignReserveShared, KPP_TYPES.foreign, KPP_TYPES.foreignReserve
    ])
    const foreignCodes = KPP_REASONS.filter((reason) => foreignTypes.has(reason.id)).flatMap((reason) => reason.codes)
    expect(foreignCodes.length).toBe(49)
    expect(new Set(foreignCodes).size).toBe(49)
    expect(foreignCodes.map(Number).sort((a, b) => a - b)).toEqual(Array.from({ length: 49 }, (_, i) => 51 + i))
  })

  it('сохраняет обе причины для 77 с разными идентификаторами', () => {
    expect(KPP_REASONS.filter((reason) => reason.codes.includes('77')).map((reason) => reason.id))
      .toEqual([KPP_TYPES.envd, KPP_TYPES.foreignShared])
  })

  it.each(['01', '50', '35/77', 'branch'])('сохраняет прежний выбор %s', (type) => {
    expect(normalizeKppType(type)).toBe(type)
  })

  it.each(['unknown', '__proto__', '', null, true, undefined])('сбрасывает неизвестный выбор %s', (type) => {
    expect(normalizeKppType(type)).toBe(KPP_TYPES.registration)
  })
})
