import React, { Fragment } from 'react'
import { StyleSheet } from 'react-native'
import { useThemeColor } from '@/hooks/use-theme-color'
import { AppText } from '@/components/app-text'
import * as Dropdown from '@rn-primitives/dropdown-menu'

export function AppDropdown({
  items,
  selectedItem,
  selectItem,
}: {
  items: readonly string[]
  selectedItem: string
  selectItem: (item: string) => void
}) {
  const backgroundColor = useThemeColor({ light: '#f0f0f0', dark: '#333333' }, 'background')
  const borderColor = useThemeColor({ light: '#cccccc', dark: '#555555' }, 'border')
  const textColor = useThemeColor({ light: '#000000', dark: '#ffffff' }, 'text')

  const dropdownItems = items.map((item) => ({
    label: item,
    onPress: () => selectItem(item),
  }))

  return (
    <Dropdown.Root>
      <Dropdown.Trigger style={[styles.trigger, { backgroundColor: backgroundColor as string, borderColor: borderColor as string }]}>
        <AppText>{selectedItem}</AppText>
      </Dropdown.Trigger>
      <Dropdown.Portal>
        <Dropdown.Overlay style={StyleSheet.absoluteFill}>
          <Dropdown.Content style={{ ...styles.content, backgroundColor: backgroundColor as string, borderColor: borderColor as string }}>
            {dropdownItems.map((item, index) => (
              <Fragment key={item.label}>
                <Dropdown.Item onPress={item.onPress} style={[styles.item, { borderColor: borderColor as string }]}>
                  <AppText>{item.label}</AppText>
                </Dropdown.Item>
                {index < dropdownItems.length - 1 && <Dropdown.Separator style={{ backgroundColor: borderColor as string, height: 1 }} />}
              </Fragment>
            ))}
          </Dropdown.Content>
        </Dropdown.Overlay>
      </Dropdown.Portal>
    </Dropdown.Root>
  )
}

const styles = StyleSheet.create({
  trigger: {
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  content: {
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 8,
  },
  item: {
    padding: 12,
    flexWrap: 'nowrap',
  },
})
