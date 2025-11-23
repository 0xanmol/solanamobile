import { StyleSheet, Text, type TextProps } from 'react-native'
import { useThemeColor } from '@/hooks/use-theme-color'
import { Fonts } from '@/constants/fonts'

export type AppTextProps = TextProps & {
  lightColor?: string
  darkColor?: string
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link'
}

export function AppText({ style, lightColor, darkColor, type = 'default', ...rest }: AppTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text')

  return (
    <Text
      style={[
        { color, fontFamily: Fonts.body },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  )
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: Fonts.body,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: Fonts.body,
    fontWeight: '600',
  },
  title: {
    fontSize: 32,
    lineHeight: 32,
    fontFamily: Fonts.heading,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 20,
    fontFamily: Fonts.heading,
    fontWeight: '700',
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: '#0a7ea4',
    fontFamily: Fonts.body,
  },
})
