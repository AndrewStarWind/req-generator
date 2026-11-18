import { useVirtualizer } from '@tanstack/react-virtual'
import { useRef } from 'react'
import { useCopyFeedback } from '../utils/useCopyFeedback'
import Icon from './ui/Icon'

const ROW_HEIGHT = 36
const MAX_HEIGHT = 320

/**
 * Список истории генерации с виртуальным скроллом: в DOM только видимые строки,
 * поэтому история может быть сколь угодно длинной.
 * initialRect нужен для первого рендера до измерения контейнера (и для тестов в jsdom).
 */
interface HistoryListProps {
  /** Значения в порядке показа (свежие - первыми) */
  items: readonly string[]
}

export default function HistoryList ({ items }: HistoryListProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const { copied: copiedIndex, copy: copyText } = useCopyFeedback<number>()
  const height = Math.min(items.length * ROW_HEIGHT, MAX_HEIGHT)
  // Номера выровнены влево по линии заголовка; колонка - по ширине самого длинного номера,
  // чтобы значения стояли ровной колонкой
  const numberWidth = `${String(items.length).length}ch`

  // useVirtualizer возвращает мутабельный объект - React Compiler пропускает этот компонент, это ожидаемо
  // eslint-disable-next-line react-hooks/incompatible-library
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 8,
    initialRect: { width: 0, height }
  })

  const copy = (index: number) => void copyText(items[index] ?? '', index)

  // Подсветка строки выходит за левую линию текста на ps-4 - столько же, сколько справа
  // от иконки копирования (9px + внутренний отступ кнопки 7px); номера остаются на линии заголовка
  return (
    <div ref={scrollRef} style={{ height }} className='-ms-4 -me-[9px] overflow-auto'>
      <ul
        aria-label='История генерации'
        style={{ height: virtualizer.getTotalSize() }}
        className='relative'
      >
        {virtualizer.getVirtualItems().map((row) => {
          const copied = copiedIndex === row.index
          return (
            <li
              key={row.key}
              aria-setsize={items.length}
              aria-posinset={row.index + 1}
              style={{ height: ROW_HEIGHT, transform: `translateY(${row.start}px)` }}
              className='group absolute inset-x-0 top-0 flex items-center gap-2 rounded ps-4 pe-[9px] hover:bg-current/5'
            >
              <span style={{ width: numberWidth }} className='shrink-0 text-xs text-fg-subtle tabular-nums'>
                {row.index + 1}
              </span>
              <span className='flex-1 truncate font-mono text-[13px] text-fg select-text'>{items[row.index]}</span>
              <button
                type='button'
                aria-label={copied ? `Скопировано: ${items[row.index]}` : `Копировать ${items[row.index]}`}
                title={copied ? 'Скопировано' : 'Копировать'}
                onClick={() => copy(row.index)}
                className={
                  'inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full ' +
                  'transition hover:bg-current/10 focus-visible:bg-current/15 focus-visible:outline-none ' +
                  (copied ? 'text-success' : 'text-fg-muted')
                }
              >
                <Icon name={copied ? 'check' : 'copy'} />
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
