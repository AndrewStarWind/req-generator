import { createListCollection, Portal, Select as ChakraSelect } from '@chakra-ui/react'
import { useMemo } from 'react'

export interface SelectItem {
  value: string
  label: string
}

interface SelectProps {
  /** Доступное имя (видимой подписи у компактного селекта нет) */
  label: string
  value: string
  onChange: (value: string) => void
  options: readonly SelectItem[]
  width?: string
}

// Одинаковый внутренний отступ у поля и у пунктов списка - текст стоит на одной вертикали
const PADDING_X = '3'

/**
 * Выпадающий список Chakra UI фиксированной ширины: строка не «прыгает» при смене значения.
 * Длинное значение обрезается многоточием (полное - в подсказке).
 */
export default function Select ({ label, value, onChange, options, width = '11rem' }: SelectProps) {
  const collection = useMemo(() => createListCollection({ items: [...options] }), [options])
  const selectedLabel = options.find((o) => o.value === value)?.label

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
      <ChakraSelect.HiddenSelect aria-label={label} />
      <ChakraSelect.Control>
        <ChakraSelect.Trigger
          aria-label={label}
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
          <ChakraSelect.Content p='1' minW='var(--reference-width)' bg='bg.panel'>
            {collection.items.map((item) => (
              <ChakraSelect.Item
                key={item.value}
                item={item}
                px={PADDING_X}
                py='1.5'
                rounded='sm'
                fontSize='sm'
                cursor='pointer'
                // явная подсветка: штатный bg.muted в тёмной теме совпадал с фоном меню
                _highlighted={{ bg: { base: 'gray.200', _dark: 'gray.700' } }}
              >
                {item.label}
                <ChakraSelect.ItemIndicator />
              </ChakraSelect.Item>
            ))}
          </ChakraSelect.Content>
        </ChakraSelect.Positioner>
      </Portal>
    </ChakraSelect.Root>
  )
}
