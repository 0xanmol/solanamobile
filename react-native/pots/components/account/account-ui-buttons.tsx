import { useRouter } from 'expo-router'
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native'
import { Colors } from '@/constants/colors'
import { Fonts } from '@/constants/fonts'
import { useColorScheme } from 'react-native'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'

const ACTIONS = [
  {
    label: 'Airdrop',
    description: 'Request devnet SOL',
    route: '/(tabs)/account/airdrop',
    icon: 'cloud-download',
    accent: 'rgba(101, 242, 201, 0.15)',
    iconColor: '#0B1F17',
  },
  {
    label: 'Send',
    description: 'Transfer to a wallet',
    route: '/(tabs)/account/send',
    icon: 'north-east',
    accent: 'rgba(178, 140, 255, 0.14)',
    iconColor: '#1A0B29',
  },
  {
    label: 'Receive',
    description: 'Share your address',
    route: '/(tabs)/account/receive',
    icon: 'south-west',
    accent: 'rgba(245, 201, 123, 0.18)',
    iconColor: '#2E1B04',
  },
] as const

export function AccountUiButtons() {
  const router = useRouter()
  const colorScheme = useColorScheme()
  const isDark = colorScheme === 'dark'
  const colors = Colors[isDark ? 'dark' : 'light']

  return (
    <View style={styles.container}>
      {ACTIONS.map((action) => (
        <TouchableOpacity
          key={action.label}
          style={[styles.button, { borderColor: colors.borderMuted, backgroundColor: colors.surfaceMuted }]}
          onPress={() => router.navigate(action.route as any)}
          activeOpacity={0.85}
        >
          <View style={[styles.iconWrap, { backgroundColor: action.accent }]}>
            <MaterialIcons name={action.icon as any} size={18} color={action.iconColor} />
          </View>
          <View style={styles.textBlock}>
            <Text style={[styles.label, { color: colors.text }]}>{action.label}</Text>
            <Text style={[styles.description, { color: colors.textSecondary }]} numberOfLines={1}>
              {action.description}
            </Text>
          </View>
          <MaterialIcons name="arrow-forward-ios" size={14} color={colors.textSecondary} />
        </TouchableOpacity>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    gap: 12,
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textBlock: {
    flex: 1,
    minWidth: 0,
  },
  label: {
    fontSize: 14,
    fontFamily: 'IBMPlexSans-SemiBold',
    letterSpacing: -0.1,
  },
  description: {
    fontSize: 12,
    marginTop: 2,
  },
})
