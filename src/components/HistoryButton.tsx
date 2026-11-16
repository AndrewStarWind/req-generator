import { useMemo, useState } from 'react'
import type { RequisiteId } from '../requisites'
import { useRequisitesStore } from '../store'
import HistoryList from './HistoryList'
import Button from './ui/Button'
import Dialog from './ui/Dialog'
import IconButton from './ui/IconButton'

const EMPTY: readonly string[] = []

interface HistoryButtonProps {
  requisiteId: RequisiteId
  label: string
}

export default function HistoryButton ({ requisiteId, label }: HistoryButtonProps) {
  const [open, setOpen] = useState(false)
  const history = useRequisitesStore((state) => state.records[requisiteId]?.history ?? EMPTY)
  const clearHistory = useRequisitesStore((state) => state.clearHistory)
  // Свежие значения - сверху
  const items = useMemo(() => [...history].reverse(), [history])

  return (
    <>
      <IconButton icon='history' label='История' onClick={() => setOpen(true)} />
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title={`История генерации ${label}`}
        actions={
          <>
            {items.length > 0 && (
              <span className='mr-auto self-center text-xs text-fg-subtle'>Всего: {items.length}</span>
            )}
            <Button onClick={() => setOpen(false)}>OK</Button>
            {items.length > 0 && (
              <Button onClick={() => clearHistory(requisiteId)}>Очистить историю</Button>
            )}
          </>
        }
      >
        {open && (items.length ? <HistoryList items={items} /> : 'История пуста')}
      </Dialog>
    </>
  )
}
