import { Dialog as ChakraDialog, Portal } from '@chakra-ui/react'
import type { ReactNode } from 'react'

interface DialogProps {
  open: boolean
  onClose: () => void
  title: string
  children?: ReactNode
  /** Кнопки внизу окна */
  actions?: ReactNode
}

/** Модальное окно: фокус-ловушка, Esc и клик по фону закрывают. */
export default function Dialog ({ open, onClose, title, children, actions }: DialogProps) {
  return (
    <ChakraDialog.Root
      open={open}
      onOpenChange={(e) => { if (!e.open) onClose() }}
      placement='center'
      size='sm'
      scrollBehavior='inside'
    >
      <Portal>
        <ChakraDialog.Backdrop />
        <ChakraDialog.Positioner px='4'>
          <ChakraDialog.Content bg='bg.panel' color='fg'>
            <ChakraDialog.Header pb='2'>
              <ChakraDialog.Title fontSize='lg' fontWeight='medium'>{title}</ChakraDialog.Title>
            </ChakraDialog.Header>
            <ChakraDialog.Body fontSize='sm' color='fg.muted' py='0'>{children}</ChakraDialog.Body>
            <ChakraDialog.Footer py='3' gap='1'>{actions}</ChakraDialog.Footer>
          </ChakraDialog.Content>
        </ChakraDialog.Positioner>
      </Portal>
    </ChakraDialog.Root>
  )
}
