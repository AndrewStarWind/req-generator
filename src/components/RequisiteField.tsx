import { useId, useState } from 'react'
import type { Requisite } from '../requisites'
import { useRequisitesStore } from '../store'
import { useCopyFeedback } from '../utils/useCopyFeedback'
import { STATUS, type ValidationResult } from '../validators'
import HistoryButton from './HistoryButton'
import Checkbox from './ui/Checkbox'
import IconButton from './ui/IconButton'
import Select from './ui/Select'
import TextField from './ui/TextField'
import ValidationStatus from './ValidationStatus'

/** Ширина колонки подписей - одинаковая у всех строк, чтобы поля стояли ровно */
const LABEL_WIDTH = '7.5rem'

interface RequisiteFieldProps {
  requisite: Requisite
}

/**
 * Универсальная строка реквизита: рисует любой реквизит из реестра (src/requisites.ts) -
 * поле, доп. опцию генератора, кнопки «Сгенерировать», «Копировать», «История»
 * и результат его валидатора для значения, введённого вручную.
 */
export default function RequisiteField ({ requisite }: RequisiteFieldProps) {
  const { id, option: optionSpec } = requisite
  const generated = useRequisitesStore((state) => state.records[id]?.value ?? '')
  const draft = useRequisitesStore((state) => state.drafts[id])
  const option = useRequisitesStore((state) => state.options[id] ?? optionSpec?.defaultValue)
  const { generate, setDraft, setOption, clearValue } = useRequisitesStore.getState()

  const { copied: copiedKey, copy: copyText } = useCopyFeedback()
  const copied = copiedKey !== null
  const [focused, setFocused] = useState(false)
  const statusId = useId()

  // Ручной ввод показывается вместо сгенерированного и проверяется валидатором
  const isManual = draft !== undefined
  const value = draft ?? generated

  const copy = (text: string) => void copyText(text, true)

  let validation: ValidationResult | null = isManual ? requisite.validate(value) : null
  // Пока пользователь печатает, неполное значение - не ошибка. После ухода с поля - ошибка.
  if (validation?.status === STATUS.INCOMPLETE && !focused) {
    validation = { ...validation, status: STATUS.INVALID, message: `Неполный номер: ${validation.message.toLowerCase()}` }
  }
  const isInvalid = validation?.status === STATUS.INVALID

  // Ручной ввод копируем нормализованным: «112-233-445 95» → «11223344595»
  const copyValue = isManual ? requisite.validate.normalize(value) : value

  return (
    <div className='space-y-1'>
      <div className='flex items-center gap-2'>
        <TextField
          label={requisite.label}
          labelWidth={LABEL_WIDTH}
          value={value}
          onChange={(next) => setDraft(id, next)}
          onClear={() => clearValue(id)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          invalid={isInvalid}
          aria-describedby={validation ? statusId : undefined}
        />

        {optionSpec?.type === 'checkbox' && (
          <Checkbox label={optionSpec.label} checked={option === true} onChange={(checked) => setOption(id, checked)} />
        )}
        {optionSpec?.type === 'select' && (
          <Select
            label={optionSpec.label}
            value={String(option)}
            onChange={(next) => setOption(id, next)}
            options={optionSpec.items}
          />
        )}

        <div className='flex shrink-0 text-fg-muted'>
          <IconButton icon='play' label='Сгенерировать и скопировать' onClick={() => copy(generate(id))} />
          <IconButton
            icon={copied ? 'check' : 'copy'}
            label={copied ? 'Скопировано' : 'Копировать'}
            onClick={() => copy(copyValue)}
            color={copied ? 'var(--app-success)' : 'currentColor'}
          />
          <HistoryButton requisiteId={id} label={requisite.label} />
        </div>
      </div>
      {validation && (
        // статус - под полем ввода, а не под подписью
        <div style={{ paddingInlineStart: `calc(${LABEL_WIDTH} + 0.5rem)` }}>
          <ValidationStatus id={statusId} result={validation} />
        </div>
      )}
    </div>
  )
}
