import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { type OptionValue, REQUISITES, type RequisiteId } from '../requisites'
import { createPersistStorage } from './persistStorage'

/** Сколько последних значений хранить в истории каждого реквизита; более старые удаляются */
export const HISTORY_LIMIT = 100
/** Сколько раз пробовать получить значение, которого ещё нет в истории */
const MAX_UNIQUE_ATTEMPTS = 50

const STORAGE_KEY = 'req-generator'
/** Ключ версии на Svelte: { [id]: { value, history } } строкой JSON */
const LEGACY_STORAGE_KEY = 'req-gen-data'

export interface RequisiteRecord {
  /** Последнее сгенерированное значение */
  value: string
  /** Сгенерированные значения, от старых к новым; не длиннее HISTORY_LIMIT */
  history: string[]
}

type ById<T> = Partial<Record<RequisiteId, T>>

export type Theme = 'light' | 'dark'

interface PersistedState {
  records: ById<RequisiteRecord>
  /** Значения доп. контролов генераторов (чекбокс «иностранец», тип КПП, пол) */
  options: ById<OptionValue>
  /** Тема оформления; по умолчанию светлая */
  theme: Theme
}

export interface RequisitesState extends PersistedState {
  /** Значения, введённые вручную: показываются вместо сгенерированного и проверяются. Не сохраняются. */
  drafts: ById<string>

  /** Генерирует новое значение реквизита (не из истории), сохраняет и возвращает его */
  generate: (id: RequisiteId) => string
  /** Генерирует значения сразу для нескольких реквизитов («Сгенерировать всё») */
  generateMany: (ids: readonly RequisiteId[]) => void
  setDraft: (id: RequisiteId, value: string) => void
  /** Очищает поле: и ручной ввод, и сохранённое значение. История генерации остаётся. */
  clearValue: (id: RequisiteId) => void
  setOption: (id: RequisiteId, value: OptionValue) => void
  clearHistory: (id: RequisiteId) => void
  toggleTheme: () => void
}

const isRequisiteId = (id: string): id is RequisiteId => id in REQUISITES

const trimHistory = (history: readonly string[]): string[] => history.slice(-HISTORY_LIMIT)

/** Приводит сохранённые записи к ожидаемому виду: только известные реквизиты, история в пределах лимита. */
function sanitizeRecords (records: unknown): ById<RequisiteRecord> {
  const result: ById<RequisiteRecord> = {}
  if (!records || typeof records !== 'object') return result
  for (const [id, record] of Object.entries(records)) {
    if (!isRequisiteId(id) || !record || typeof record !== 'object') continue
    const { value, history } = record as Partial<RequisiteRecord>
    result[id] = {
      value: typeof value === 'string' ? value : '',
      history: Array.isArray(history) ? trimHistory(history.filter((v) => typeof v === 'string')) : []
    }
  }
  return result
}

const storage = createPersistStorage<PersistedState>(async (read) => {
  const legacy = await read(LEGACY_STORAGE_KEY)
  return legacy ? { state: { records: sanitizeRecords(legacy), options: {}, theme: 'light' }, version: 0 } : null
})

export const useRequisitesStore = create<RequisitesState>()(
  persist(
    (set, get) => {
      const nextValue = (id: RequisiteId): string => {
        const requisite = REQUISITES[id]
        const option = get().options[id] ?? requisite.option?.defaultValue
        const history = get().records[id]?.history ?? []
        let value = requisite.generate(option)
        for (let attempt = 1; attempt < MAX_UNIQUE_ATTEMPTS && history.includes(value); attempt++) {
          value = requisite.generate(option)
        }
        return value
      }

      const withValue = (state: RequisitesState, id: RequisiteId, value: string) => {
        // сгенерированное значение заменяет ручной ввод
        const drafts = { ...state.drafts }
        delete drafts[id]
        return {
          records: {
            ...state.records,
            [id]: { value, history: trimHistory([...(state.records[id]?.history ?? []), value]) }
          },
          drafts
        }
      }

      return {
        records: {},
        options: {},
        theme: 'light',
        drafts: {},

        generate: (id) => {
          const value = nextValue(id)
          set((state) => withValue(state, id, value))
          return value
        },

        generateMany: (ids) => {
          set((state) => ids.reduce(
            (acc, id) => ({ ...acc, ...withValue({ ...state, ...acc }, id, nextValue(id)) }),
            {}
          ))
        },

        setDraft: (id, value) => set((state) => ({ drafts: { ...state.drafts, [id]: value } })),

        clearValue: (id) => set((state) => {
          const drafts = { ...state.drafts }
          delete drafts[id]
          const record = state.records[id]
          return { drafts, records: record ? { ...state.records, [id]: { ...record, value: '' } } : state.records }
        }),

        setOption: (id, value) => set((state) => ({ options: { ...state.options, [id]: value } })),

        toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),

        clearHistory: (id) => set((state) => {
          const record = state.records[id]
          return record ? { records: { ...state.records, [id]: { ...record, history: [] } } } : {}
        })
      }
    },
    {
      name: STORAGE_KEY,
      version: 1,
      storage,
      // черновики ручного ввода не сохраняем
      partialize: ({ records, options, theme }) => ({ records, options, theme }),
      // старые данные (версия 0) - формат прежнего Store; их приводим к актуальному виду
      migrate: (persisted) => persisted as PersistedState,
      merge: (persisted, current) => {
        const state = (persisted ?? {}) as Partial<PersistedState>
        return {
          ...current,
          records: sanitizeRecords(state.records),
          options: state.options && typeof state.options === 'object' ? state.options : {},
          theme: state.theme === 'dark' ? 'dark' : 'light'
        }
      }
    }
  )
)

/** Дождаться загрузки сохранённого состояния (chrome.storage асинхронный). */
export const waitForHydration = (): Promise<void> => new Promise((resolve) => {
  if (useRequisitesStore.persist.hasHydrated()) resolve()
  else useRequisitesStore.persist.onFinishHydration(() => resolve())
})

/** Ставит класс темы на <html>: от него зависят и CSS-переменные --app-*, и тёмный режим Chakra. */
const applyTheme = (theme: Theme) => {
  const root = document.documentElement
  root.classList.toggle('dark', theme === 'dark')
  root.classList.toggle('light', theme === 'light')
}

/** Применить сохранённую тему и дальше следить за её сменой. Вызывать после загрузки состояния. */
export function syncThemeWithDocument (): void {
  applyTheme(useRequisitesStore.getState().theme)
  useRequisitesStore.subscribe((state, prev) => {
    if (state.theme !== prev.theme) applyTheme(state.theme)
  })
}
