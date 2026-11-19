import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useRequisitesStore, waitForHydration } from './index'
import { KPP_TYPES } from '../kpp'
import { TABS } from '../requisites'

beforeEach(async () => {
  await waitForHydration()
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('сохранённые настройки КПП', () => {
  it.each([
    ['01', '01'], ['50', '50'], ['35/77', '35/77'], ['branch', 'branch'],
    ['unknown', '01'], [true, '01'], [null, '01']
  ])('восстанавливает %s как %s, сохраняя историю', async (saved, expected) => {
    vi.stubGlobal('localStorage', {
      getItem: () => JSON.stringify({
        version: 1,
        state: {
          records: { KPP: { value: '773601001', history: ['773601001'] } },
          options: { KPP: saved, INN: true },
          theme: 'dark'
        }
      }),
      setItem: vi.fn()
    })
    await useRequisitesStore.persist.rehydrate()
    const state = useRequisitesStore.getState()
    expect(state.options.KPP).toBe(expected)
    expect(state.options.INN).toBe(true)
    expect(state.records.KPP?.history).toEqual(['773601001'])
    expect(state.theme).toBe('dark')
    const generated = state.generate('KPP')
    expect(generated.slice(4, 6)).toMatch(expected === 'branch' ? /^(02|03|43)$/ : expected === '35/77' ? /^(35|77)$/ : new RegExp(`^${String(expected)}$`))
    expect(useRequisitesStore.getState().records.KPP?.history).toEqual(['773601001', generated])
  })

  it('общая генерация использует выбранный буквенный тип КПП', () => {
    const state = useRequisitesStore.getState()
    state.setOption('KPP', KPP_TYPES.realEstateFund)
    state.generateMany(TABS[0]!.fields.map((field) => field.id))
    const records = useRequisitesStore.getState().records
    expect(records.KPP?.value).toMatch(/^\d{4}4[A-F]\d{3}$/)
    for (const field of TABS[0]!.fields) expect(records[field.id]?.value).toBeTruthy()
  })
})
