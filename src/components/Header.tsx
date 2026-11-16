import { useState } from 'react'
import { useRequisitesStore } from '../store'
import AppBar from './ui/AppBar'
import Button from './ui/Button'
import Dialog from './ui/Dialog'
import IconButton from './ui/IconButton'

// Отдельное окно не ограничено размером popup (макс. 800×600) - даём место под статусы проверки
const POPUP_WINDOW: chrome.windows.CreateData = { url: 'index.html?window', type: 'popup', width: 616, height: 860 }

const canOpenWindow = () => typeof chrome !== 'undefined' && Boolean(chrome.windows)

interface HeaderProps {
  onGenerateAll: () => void
}

export default function Header ({ onGenerateAll }: HeaderProps) {
  const [aboutOpen, setAboutOpen] = useState(false)
  const isDark = useRequisitesStore((state) => state.theme === 'dark')
  const toggleTheme = useRequisitesStore((state) => state.toggleTheme)

  return (
    <>
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
        <IconButton onColor icon='info' label='О приложении' onClick={() => setAboutOpen(true)} />
        {/* как в документации Chakra: солнце в светлой теме, луна - в тёмной */}
        <IconButton
          onColor
          icon={isDark ? 'moon' : 'sun'}
          label={isDark ? 'Включить светлую тему' : 'Включить тёмную тему'}
          onClick={toggleTheme}
        />
      </AppBar>

      <Dialog
        open={aboutOpen}
        onClose={() => setAboutOpen(false)}
        title='О приложении'
        actions={<Button onClick={() => setAboutOpen(false)}>OK</Button>}
      >
        <div className='space-y-3 [&_a]:text-primary [&_a]:underline'>
          <p>Приложение генерирует основные реквизиты компаний.</p>
          <p>
            Contact me on <a target='_blank' rel='noreferrer' href='https://t.me/sevasdreas'>Telegram</a>
          </p>
          <p>
            <a target='_blank' rel='noreferrer' href='https://github.com/AndrewStarWind/req-generator'>GitHub</a>
          </p>
          <p>ЮMoney (RUR): 410011464431934</p>
        </div>
      </Dialog>
    </>
  )
}
