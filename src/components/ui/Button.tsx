import { Button as ChakraButton, type ButtonProps } from '@chakra-ui/react'

export default function Button (props: ButtonProps) {
  return <ChakraButton variant='ghost' colorPalette='green' size='sm' {...props} />
}
