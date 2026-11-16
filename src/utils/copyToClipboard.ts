/**
 * Копирует текст в буфер обмена. Возвращает false, если браузер отказал
 * (нет фокуса, нет разрешения) - без необработанной ошибки в консоли.
 */
export async function copyTextToClipboard (text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}
