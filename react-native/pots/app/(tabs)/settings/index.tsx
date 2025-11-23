import { SettingsUiCluster } from '@/components/settings/settings-ui-cluster'
import { AppText } from '@/components/app-text'
import { SettingsAppConfig } from '@/components/settings/settings-app-config'
import { SettingsUiAccount } from '@/components/settings/settings-ui-account'
import { AppPage } from '@/components/app-page'
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { useRouter } from 'expo-router'
import { Colors } from '@/constants/colors'
import { useColorScheme } from 'react-native'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'

export default function TabSettingsScreen() {
  const router = useRouter()
  const colorScheme = useColorScheme()
  const isDark = colorScheme === 'dark'
  const colors = Colors[isDark ? 'dark' : 'light']

  return (
    <AppPage>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <View style={styles.headerRow}>
            <TouchableOpacity
              style={[
                styles.navButton,
                { backgroundColor: isDark ? colors.surfaceMuted : '#FFFFFF' },
              ]}
              onPress={() => router.back()}
            >
              <MaterialIcons name="chevron-left" size={20} color={colors.text} />
            </TouchableOpacity>
            <AppText style={[styles.heroTitle, { color: colors.text }]}>Settings</AppText>
            <TouchableOpacity
              style={[
                styles.navButton,
                { backgroundColor: isDark ? colors.surfaceMuted : '#FFFFFF' },
              ]}
            >
              <MaterialIcons name="settings" size={18} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>
        <SettingsUiAccount />
        <SettingsAppConfig />
        <SettingsUiCluster />
        <AppText type="default" style={{ opacity: 0.5, fontSize: 14 }}>
          Configure app info and clusters in{' '}
          <AppText type="defaultSemiBold" style={{ fontSize: 14 }}>
            constants/app-config.tsx
          </AppText>
          .
        </AppText>
      </ScrollView>
    </AppPage>
  )
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 14,
    paddingTop: 8,
    paddingBottom: 32,
    gap: 16,
  },
  hero: {
    gap: 14,
    marginBottom: 22,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  navButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
})
