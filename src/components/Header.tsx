import { useRequisitesStore } from '../store'
import AppBar from './ui/AppBar'
import IconButton from './ui/IconButton'

// Отдельное окно не ограничено размером popup (макс. 800×600) - даём место под статусы проверки
const POPUP_WINDOW: chrome.windows.CreateData = { url: 'index.html?window', type: 'popup', width: 616, height: 860 }

const canOpenWindow = () => typeof chrome !== 'undefined' && Boolean(chrome.windows)

interface HeaderProps {
  onGenerateAll: () => void
}

export default function Header ({ onGenerateAll }: HeaderProps) {
  const isDark = useRequisitesStore((state) => state.theme === 'dark')
  const toggleTheme = useRequisitesStore((state) => state.toggleTheme)

  return (
    <AppBar title='Requisites Generator'>
      <IconButton onColor icon='play' label='Сгенерировать всё' onClick={onGenerateAll} />
      {canOpenWindow() && (
        <IconButton
          onColor
          icon='openInNew'
          label='Открыть в отдельном окне'
          onClick={() => void chrome.windows.create(POPUP_WINDOW)}
        />
      )}
      {/* как в документации Chakra: солнце в светлой теме, луна - в тёмной */}
      <IconButton
        onColor
        icon={isDark ? 'moon' : 'sun'}
        label={isDark ? 'Включить светлую тему' : 'Включить тёмную тему'}
        onClick={toggleTheme}
      />
    </AppBar>
  )
}
