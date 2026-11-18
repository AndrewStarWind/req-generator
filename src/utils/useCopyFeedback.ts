import { useCallback, useEffect, useRef, useState } from 'react'
import { copyTextToClipboard } from './copyToClipboard'

const COPIED_TIMEOUT = 1200

/**
 * Копирование в буфер с подтверждением «Скопировано» на COPIED_TIMEOUT мс.
 * copied - ключ последнего успешно скопированного элемента (например, индекс строки) или null.
 * Подтверждение показывается только если браузер действительно скопировал текст;
 * повторный клик продлевает его, а не обрывает предыдущим таймером.
 */
export function useCopyFeedback<K = true> () {
  const [copied, setCopied] = useState<K | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => () => clearTimeout(timer.current), [])

  const copy = useCallback(async (text: string, key: K) => {
    const ok = await copyTextToClipboard(text)
    clearTimeout(timer.current)
    if (!ok) {
      setCopied(null)
      return
    }
    setCopied(key)
    timer.current = setTimeout(() => setCopied(null), COPIED_TIMEOUT)
  }, [])

  return { copied, copy }
}
