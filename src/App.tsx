import { useState } from 'react'
import Header from './components/Header'
import RequisiteField from './components/RequisiteField'
import Tabs from './components/ui/Tabs'
import { TABS } from './requisites'
import { useRequisitesStore } from './store'

/**
 * Popup расширения подстраивается под естественный размер содержимого. Поэтому ширина у него
 * жёсткая - 600px: иначе вкладки с селектом (естественная ширина 638px) и без него (600px)
 * меняли бы ширину popup при переключении. Высота - не меньше 600px.
 * Отдельное окно («Открыть в отдельном окне», ?window) растягивается на всё окно.
 */
const IS_DETACHED_WINDOW = new URLSearchParams(window.location.search).has('window')

export default function App () {
  const [activeTab, setActiveTab] = useState(TABS[0]!.id)
  const generateMany = useRequisitesStore((state) => state.generateMany)
  const tab = TABS.find((t) => t.id === activeTab) ?? TABS[0]!

  return (
    <div className={'flex h-screen flex-col ' + (IS_DETACHED_WINDOW ? 'w-full min-w-[560px]' : 'min-h-[600px] w-[600px]')}>
      <Header onGenerateAll={() => generateMany(tab.fields.map((field) => field.id))} />
      <Tabs tabs={TABS} active={activeTab} onChange={setActiveTab} />
      <main key={tab.id} role='tabpanel' className='flex-1 space-y-2 overflow-auto py-3 ps-5 pe-3'>
        {tab.fields.map((field) => (
          <RequisiteField key={field.id} requisite={field} />
        ))}
      </main>
    </div>
  )
}
