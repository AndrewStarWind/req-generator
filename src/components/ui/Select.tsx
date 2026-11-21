import { createListCollection, Portal, Select as ChakraSelect } from '@chakra-ui/react'
import { useMemo } from 'react'

export interface SelectItem {
  value: string
  label: string
  group?: string
  codeLabel?: string
  description?: string
}

interface SelectProps {
  /** Доступное имя (видимой подписи у компактного селекта нет) */
  label: string
  value: string
  onChange: (value: string) => void
  options: readonly SelectItem[]
  width?: string
  descriptionId?: string
}

// Одинаковый внутренний отступ у поля и у пунктов списка - текст стоит на одной вертикали
const PADDING_X = '3'

/**
 * Выпадающий список Chakra UI фиксированной ширины: строка не «прыгает» при смене значения.
 * Длинное значение обрезается многоточием (полное - в подсказке).
 */
export default function Select ({ label, value, onChange, options, width = '11rem', descriptionId }: SelectProps) {
  const collection = useMemo(() => createListCollection({ items: [...options] }), [options])
  const selected = options.find((o) => o.value === value)
  const selectedLabel = selected?.codeLabel ? `${selected.codeLabel} — ${selected.label} (${selected.group})` : selected?.label
  const groups = [...new Set(options.map((item) => item.group))]

  const renderItem = (item: SelectItem) => (
    <ChakraSelect.Item
      key={item.value}
      item={item}
      px={PADDING_X}
      py='1.5'
      rounded='sm'
      fontSize='sm'
      cursor='pointer'
      alignItems='start'
      _highlighted={{ bg: { base: 'gray.200', _dark: 'gray.700' } }}
    >
      <span className='min-w-0 flex-1 whitespace-normal'>
        {item.label}
        {item.codeLabel && (
          <span className='ms-2 inline-block whitespace-nowrap rounded-full bg-chip px-2 py-0.5 align-middle text-xs font-semibold tabular-nums text-primary'>
            {item.codeLabel}
          </span>
        )}
      </span>
      <ChakraSelect.ItemIndicator />
    </ChakraSelect.Item>
  )

  return (
    <ChakraSelect.Root
      collection={collection}
      value={[value]}
      onValueChange={(e) => { if (e.value[0]) onChange(e.value[0]) }}
      size='sm'
      w={width}
      flexShrink={0}
      positioning={{ sameWidth: false, placement: 'bottom-end' }}
    >
      <ChakraSelect.HiddenSelect aria-label={label} aria-describedby={descriptionId} />
      <ChakraSelect.Control>
        <ChakraSelect.Trigger
          aria-label={label}
          aria-describedby={descriptionId}
          title={selectedLabel}
          cursor='pointer'
          h='8'
          minH='8'
          ps={PADDING_X}
          pe='2'
          gap='1.5'
          bg='bg.muted'
          borderColor='transparent'
          _hover={{ borderColor: 'border' }}
        >
          {/* Стрелка - обычный элемент строки внутри кнопки, а не слой поверх неё (как в теме Chakra):
              текст обрезается многоточием раньше, чем дойдёт до стрелки, при любых шрифтах и масштабе */}
          <ChakraSelect.ValueText truncate maxW='none' flex='1' minW='0' fontSize='sm' />
          <ChakraSelect.Indicator flexShrink={0} />
        </ChakraSelect.Trigger>
      </ChakraSelect.Control>
      <Portal>
        <ChakraSelect.Positioner>
          <ChakraSelect.Content
            p='1'
            minW='var(--reference-width)'
            maxW='calc(100vw - 1rem)'
            maxH='min(22rem, var(--available-height, 60vh))'
            overflowY='auto'
            bg='bg.panel'
          >
            {groups.map((group) => {
              const items = collection.items.filter((item) => item.group === group).map(renderItem)
              return group
                ? (
                  <ChakraSelect.ItemGroup key={group}>
                    <ChakraSelect.ItemGroupLabel px={PADDING_X} py='2' fontSize='xs' color='fg.muted'>
                      {group}
                    </ChakraSelect.ItemGroupLabel>
                    {items}
                  </ChakraSelect.ItemGroup>
                  )
                : items
            })}
          </ChakraSelect.Content>
        </ChakraSelect.Positioner>
      </Portal>
    </ChakraSelect.Root>
  )
}
