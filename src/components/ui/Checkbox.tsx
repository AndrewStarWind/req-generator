import { Checkbox as ChakraCheckbox } from '@chakra-ui/react'

interface CheckboxProps {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}

export default function Checkbox ({ label, checked, onChange }: CheckboxProps) {
  return (
    <ChakraCheckbox.Root
      size='sm'
      colorPalette='green'
      checked={checked}
      onCheckedChange={(e) => onChange(e.checked === true)}
      flexShrink={0}
      cursor='pointer'
    >
      <ChakraCheckbox.HiddenInput />
      <ChakraCheckbox.Control cursor='pointer' />
      <ChakraCheckbox.Label fontSize='sm' fontWeight='normal'>{label}</ChakraCheckbox.Label>
    </ChakraCheckbox.Root>
  )
}
