import type { PersistStorage, StorageValue } from 'zustand/middleware'

/**
 * Хранилище для zustand persist: chrome.storage.local в расширении, localStorage на сайте.
 * Любые сбои чтения (нет API, битый JSON, исключение) дают «данных нет», а не зависание.
 */

const hasChromeStorage = (): boolean =>
  typeof chrome !== 'undefined' && Boolean(chrome.storage?.local)

async function readRaw (key: string): Promise<unknown> {
  try {
    if (hasChromeStorage()) {
      const data = await chrome.storage.local.get(key)
      return data[key] ?? null
    }
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

async function writeRaw (key: string, value: string): Promise<void> {
  try {
    if (hasChromeStorage()) {
      await chrome.storage.local.set({ [key]: value })
    } else {
      localStorage.setItem(key, value)
    }
  } catch {
    // квота или запрет записи: состояние останется в памяти до закрытия окна
  }
}

/** Значение могло быть сохранено и строкой JSON, и объектом - принимаем оба варианта. */
export function parseStored (raw: unknown): unknown {
  if (typeof raw !== 'string') return raw ?? null
  try {
    return JSON.parse(raw) as unknown
  } catch {
    return null
  }
}

/**
 * @param readLegacy чтение данных старого формата, если по основному ключу ничего нет
 */
export function createPersistStorage<S> (
  readLegacy: (read: (legacyKey: string) => Promise<unknown>) => Promise<StorageValue<S> | null>
): PersistStorage<S> {
  return {
    async getItem (name) {
      const stored = parseStored(await readRaw(name))
      if (stored && typeof stored === 'object' && 'state' in stored) return stored as StorageValue<S>
      return readLegacy(async (legacyKey) => parseStored(await readRaw(legacyKey)))
    },
    async setItem (name, value) {
      await writeRaw(name, JSON.stringify(value))
    },
    async removeItem (name) {
      try {
        if (hasChromeStorage()) await chrome.storage.local.remove(name)
        else localStorage.removeItem(name)
      } catch {
        // нечего удалять
      }
    }
  }
}
