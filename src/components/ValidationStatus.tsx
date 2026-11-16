import { STATUS, type Status, type ValidationResult } from '../validators'
import Icon, { type IconName } from './ui/Icon'

// Material Icons рисуются чётко только на рекомендованных размерах (18, 24, 36, 48px):
// на 16px глифы не ложатся на пиксельную сетку
const STATUS_ICON_SIZE = 18

const VIEW: Partial<Record<Status, { icon: IconName, color: string }>> = {
  [STATUS.VALID]: { icon: 'checkCircle', color: 'text-success' },
  [STATUS.WARNING]: { icon: 'warning', color: 'text-warning' },
  [STATUS.INVALID]: { icon: 'error', color: 'text-danger' },
  [STATUS.INCOMPLETE]: { icon: 'pending', color: 'text-fg-subtle' }
}

/** Результат любого валидатора: иконка статуса, сообщение и расшифровка. */
interface ValidationStatusProps {
  result: ValidationResult
  /** id для aria-describedby поля */
  id?: string
}

export default function ValidationStatus ({ result, id }: ValidationStatusProps) {
  const view = VIEW[result.status]
  if (!view) return null

  return (
    <div id={id} role='status' className='flex min-w-0 items-start gap-1.5 text-[13px] leading-[18px]'>
      <Icon name={view.icon} size={STATUS_ICON_SIZE} className={view.color} />
      <div className='min-w-0'>
        <p className={view.color}>{result.message}</p>
        {/* Расшифровка - в столбик: каждая строка «название: значение» отдельно */}
        {result.details.length > 0 && (
          <dl className='mt-0.5 space-y-px'>
            {result.details.map(([name, value]) => (
              <div key={name} className='flex gap-1'>
                <dt className='text-fg-subtle'>{name}:</dt>
                <dd className='text-fg'>{value}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </div>
  )
}
