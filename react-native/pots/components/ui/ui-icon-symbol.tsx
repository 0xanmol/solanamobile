// Fallback for using MaterialIcons on Android and web.
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { SymbolViewProps } from 'expo-symbols'
import { ComponentProps } from 'react'
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native'

type UiIconMapping = Record<SymbolViewProps['name'], ComponentProps<typeof MaterialIcons>['name']>
export type UiIconSymbolName = keyof typeof MAPPING

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  'gearshape.fill': 'settings',
  'wallet.pass.fill': 'wallet',
  'ladybug.fill': 'bug-report',
  'tray.fill': 'inbox',
  'cauldron.fill': 'savings',
  'cauldron': 'savings-outline',
  'person.2.fill': 'people',
  'person.2': 'people-outline',
  'bell.fill': 'notifications',
  'bell': 'notifications-none',
  'person.fill': 'person',
  'person': 'person-outline',
  magnifyingglass: 'search',
  'text.bubble.fill': 'chat-bubble-outline',
} as UiIconMapping

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function UiIconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: UiIconSymbolName
  size?: number
  color: string | OpaqueColorValue
  style?: StyleProp<TextStyle>
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />
}
