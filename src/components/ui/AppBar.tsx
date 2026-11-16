import { Flex, Heading } from '@chakra-ui/react'
import type { ReactNode } from 'react'

interface AppBarProps {
  title: string
  /** Кнопки справа */
  children?: ReactNode
}

export default function AppBar ({ title, children }: AppBarProps) {
  return (
    <Flex
      as='header'
      h='12'
      flexShrink={0}
      align='center'
      ps='5'
      pe='3'
      bg='var(--app-appbar)'
      color='var(--app-on-appbar)'
      // линия снизу - тенью, а не рамкой: рамка съедала 1px высоты, и иконки вставали на полупиксель
      boxShadow='inset 0 -1px 0 var(--app-line)'
    >
      <Heading as='h1' size='md' fontWeight='medium' truncate>{title}</Heading>
      <Flex ms='auto' align='center' gap='1'>{children}</Flex>
    </Flex>
  )
}
