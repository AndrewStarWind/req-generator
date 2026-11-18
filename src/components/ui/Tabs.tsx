import { Tabs as ChakraTabs } from '@chakra-ui/react'

interface TabItem {
  id: string
  label: string
}

interface TabsProps {
  tabs: readonly TabItem[]
  active: string
  onChange: (id: string) => void
}

/**
 * Вкладки: активная подсвечивается зелёной «пилюлей» (Tabs.Indicator, плавно переезжает
 * между вкладками), стрелки на клавиатуре - через Ark UI.
 */
export default function Tabs ({ tabs, active, onChange }: TabsProps) {
  return (
    <ChakraTabs.Root
      value={active}
      onValueChange={(e) => onChange(e.value)}
      variant='plain'
      size='sm'
      flexShrink={0}
      css={{
        '--tabs-indicator-bg': 'colors.green.solid',
        '--tabs-indicator-shadow': 'none',
        '--tabs-trigger-radius': 'radii.full'
      }}
    >
      <ChakraTabs.List w='full' px='3' py='2' gap='1' borderBottomWidth='1px' borderColor='border.muted'>
        {tabs.map((tab) => (
          <ChakraTabs.Trigger
            key={tab.id}
            value={tab.id}
            px='3'
            fontWeight='medium'
            color='fg.muted'
            _hover={{ color: 'fg' }}
            _selected={{ color: 'green.contrast', _hover: { color: 'green.contrast' } }}
          >
            {tab.label}
          </ChakraTabs.Trigger>
        ))}
        <ChakraTabs.Indicator rounded='full' />
      </ChakraTabs.List>
    </ChakraTabs.Root>
  )
}
