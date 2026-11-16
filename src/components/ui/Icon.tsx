import 'material-icons/iconfont/filled.css'

/**
 * Иконки Material Icons веб-шрифтом (как в исходной версии расширения), но из npm-пакета,
 * а не с Google Fonts: шрифт лежит в сборке и работает без сети.
 * Шрифтовые глифы браузер рисует с хинтингом - они чёткие на любом масштабе экрана,
 * в отличие от SVG, которые при масштабе Windows 125-150% размываются.
 */
const LIGATURES = {
  play: 'play_circle_outline',
  copy: 'content_copy',
  history: 'history',
  openInNew: 'open_in_new',
  info: 'info',
  check: 'check',
  checkCircle: 'check_circle',
  error: 'error',
  warning: 'warning',
  pending: 'pending',
  sun: 'light_mode',
  moon: 'dark_mode'
} as const

export type IconName = keyof typeof LIGATURES

interface IconProps {
  name: IconName
  /** Размер в px; по умолчанию 24 - родной размер Material Icons */
  size?: number
  className?: string
}

export default function Icon ({ name, size = 24, className = '' }: IconProps) {
  return (
    <span
      aria-hidden='true'
      className={'material-icons shrink-0 select-none ' + className}
      style={{ fontSize: size, width: size, height: size }}
    >
      {LIGATURES[name]}
    </span>
  )
}
