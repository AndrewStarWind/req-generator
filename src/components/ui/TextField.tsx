import { CloseButton, Field, Input, InputGroup, type InputProps } from '@chakra-ui/react'
import { useRef } from 'react'

interface TextFieldProps extends Omit<InputProps, 'onChange' | 'value'> {
  label: string
  value: string
  onChange: (value: string) => void
  /** Если задан - при наведении на непустое поле показывается крестик «Очистить» */
  onClear?: () => void
  /** Подсветить поле как ошибочное (и выставить aria-invalid) */
  invalid?: boolean
  /** Ширина колонки подписи слева от поля */
  labelWidth?: string
}

/** Компактное поле: подпись слева, поле ввода справа, крестик очистки при наведении. */
export default function TextField ({
  label, value, onChange, onClear, invalid = false, labelWidth = '7.5rem', ...inputProps
}: TextFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const clearButton = onClear && value
    ? (
      <CloseButton
        className='clear-button'
        size='2xs'
        rounded='full'
        aria-label={`Очистить поле ${label}`}
        title='Очистить'
        color='fg.muted'
        // нейтральный фон при наведении: на светло-сером поле зелёный хайлайт сливался
        _hover={{ bg: { base: 'gray.300', _dark: 'gray.600' }, color: 'fg' }}
        onClick={() => {
          onClear()
          inputRef.current?.focus()
        }}
      />
      )
    : undefined

  return (
    <Field.Root
      invalid={invalid}
      orientation='horizontal'
      gap='2'
      flex='1'
      // в горизонтальном Field ширину подписи задаёт эта переменная (по умолчанию 80px)
      css={{ '--field-label-width': labelWidth }}
    >
      <Field.Label m='0' fontSize='sm' fontWeight='normal' color='fg.muted' whiteSpace='nowrap'>
        {label}
      </Field.Label>
      <InputGroup
        // номер должен оставаться читаемым - сжимается в первую очередь селект рядом
        minW='9rem'
        endElement={clearButton}
        endElementProps={{ pe: '1' }}
        // крестик виден при наведении на поле и когда фокус внутри (для клавиатуры)
        css={{
          '& .clear-button': { opacity: 0, transition: 'opacity 0.15s' },
          '&:hover .clear-button, &:focus-within .clear-button': { opacity: 1 }
        }}
      >
        <Input
          ref={inputRef}
          size='sm'
          h='8'
          value={value}
          onChange={(e) => onChange(e.target.value)}
          spellCheck={false}
          autoComplete='off'
          fontFamily='mono'
          fontSize='13px'
          bg='bg.muted'
          borderColor='transparent'
          _hover={{ borderColor: 'border' }}
          {...inputProps}
        />
      </InputGroup>
    </Field.Root>
  )
}
