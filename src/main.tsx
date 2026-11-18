import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import Provider from './components/ui/Provider'
import { syncThemeWithDocument, waitForHydration } from './store'
import './index.css'

const root = document.getElementById('root')
if (!root) throw new Error('#root не найден в index.html')

// Рендерим после загрузки сохранённого состояния, чтобы поля не мигали пустыми,
// а тёмная тема не мелькала светлой
void waitForHydration().then(() => {
  syncThemeWithDocument()
  createRoot(root).render(
    <StrictMode>
      <Provider>
        <App />
      </Provider>
    </StrictMode>
  )
})
