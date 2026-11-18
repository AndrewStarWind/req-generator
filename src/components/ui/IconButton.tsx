import { IconButton as ChakraIconButton, type IconButtonProps as ChakraIconButtonProps } from '@chakra-ui/react'
import Icon, { type IconName } from './Icon'

interface IconButtonProps extends Omit<ChakraIconButtonProps, 'children' | 'aria-label'> {
  icon: IconName
  /** Подсказка и доступное имя кнопки */
  label: string
  /** Кнопка на цветном фоне (шапка): хайлайт - полупрозрачный белый, а не серый */
  onColor?: boolean
}

export default function IconButton ({ icon, label, onColor = false, ...props }: IconButtonProps) {
  return (
    <ChakraIconButton
      variant='ghost'
      size='xs'
      rounded='full'
      color='currentColor'
      title={label}
      aria-label={label}
      {...(onColor && {
        _hover: { bg: 'whiteAlpha.300' },
        _active: { bg: 'whiteAlpha.400' },
        _expanded: { bg: 'whiteAlpha.300' }
      })}
      {...props}
    >
      <Icon name={icon} />
    </ChakraIconButton>
  )
}
