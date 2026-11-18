import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react'

/**
 * Тема Chakra UI.
 *
 * Цвета не дублируются: семантические токены Chakra ссылаются на CSS-переменные
 * зелёной схемы из index.css (--app-*), которые сами переключаются под тёмную тему.
 * Тёмный режим - стандартный для Chakra класс .dark на <html> (переключатель в шапке).
 * preflight выключен: сброс стилей уже делает Tailwind.
 */
const config = defineConfig({
  preflight: false,
  theme: {
    semanticTokens: {
      colors: {
        bg: {
          DEFAULT: { value: 'var(--app-surface)' },
          panel: { value: 'var(--app-surface-raised)' },
          muted: { value: 'var(--app-field)' },
          subtle: { value: 'var(--app-surface-muted)' }
        },
        fg: {
          DEFAULT: { value: 'var(--app-fg)' },
          muted: { value: 'var(--app-fg-muted)' },
          subtle: { value: 'var(--app-fg-subtle)' },
          error: { value: 'var(--app-danger)' }
        },
        border: {
          DEFAULT: { value: 'var(--app-line-strong)' },
          muted: { value: 'var(--app-line)' },
          error: { value: 'var(--app-danger)' }
        },
        green: {
          solid: { value: 'var(--app-primary)' },
          contrast: { value: 'var(--app-on-primary)' },
          fg: { value: 'var(--app-primary)' },
          focusRing: { value: 'var(--app-primary)' }
        }
      }
    }
  },
  globalCss: {
    html: { colorPalette: 'green' }
  }
})

export const system = createSystem(defaultConfig, config)
