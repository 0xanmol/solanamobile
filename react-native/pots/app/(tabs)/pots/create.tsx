import React, { useMemo, useState } from 'react'
import { Alert, Platform, ScrollView, StyleSheet, TouchableOpacity, useColorScheme, View, Text } from 'react-native'
import { useRouter } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import { AppPage } from '@/components/app-page'
import { Colors } from '@/constants/colors'
import { useToast } from '@/components/toast/toast-provider'
import { useWalletUi } from '@/components/solana/use-wallet-ui'
import { useAppStore, PotCategory } from '@/store/app-store'
import { CreatePotHeader } from '@/components/pots/create/CreatePotHeader'
import { OverviewSection } from '@/components/pots/create/OverviewSection'
import { GoalSection } from '@/components/pots/create/GoalSection'
import { CategorySelector } from '@/components/pots/create/CategorySelector'
import { ContributorSelector } from '@/components/pots/create/ContributorSelector'
import { DatePickerModal } from '@/components/pots/create/DatePickerModal'

const getDefaultTargetDateString = () =>
  new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)

const dayMs = 24 * 60 * 60 * 1000
const formatDate = (d: Date) => d.toISOString().slice(0, 10)

const tomorrow = () => {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  d.setHours(0, 0, 0, 0)
  return d
}

export default function CreatePotScreen() {
  const router = useRouter()
  const colorScheme = useColorScheme()
  const isDark = colorScheme === 'dark'
  const colors = Colors[isDark ? 'dark' : 'light']

  const { account } = useWalletUi()
  const { friends, createPot } = useAppStore()
  const { showToast } = useToast()

  const palette = useMemo(
    () => ({
      gradient: isDark ? ['#05070E', '#04060A', '#030407'] : ['#EEF1FF', '#F8FAFF', '#FFFFFF'],
      surface: isDark ? 'rgba(12,14,21,0.94)' : '#FFFFFF',
      surfaceMuted: isDark ? 'rgba(255,255,255,0.05)' : '#F3F6FF',
      border: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.08)',
      label: isDark ? 'rgba(255,255,255,0.65)' : '#76809A',
      text: colors.text,
      textSecondary: colors.textSecondary,
      accent: colors.accentGreen ?? '#22E1A2',
      accentSecondary: '#6DF8CD',
      accentMuted: isDark ? 'rgba(34,225,162,0.18)' : 'rgba(34,225,162,0.12)',
      chipAvatarBg: isDark ? '#0C1525' : '#E2E7FF',
      chipAvatarText: isDark ? '#66F5C6' : '#1A1F2C',
    }),
    [isDark, colors],
  )

  const cardStyle = useMemo(
    () => ({
      backgroundColor: palette.surface,
      borderColor: palette.border,
      shadowColor: isDark ? '#000000' : '#9FB4FF',
      shadowOpacity: isDark ? 0.35 : 0.12,
      shadowRadius: 24,
      shadowOffset: { width: 0, height: 12 },
      elevation: isDark ? 2 : 6,
    }),
    [palette, isDark],
  )

  const inputBaseStyle = useMemo(
    () => ({
      backgroundColor: palette.surfaceMuted,
      borderColor: palette.border,
      color: palette.text,
    }),
    [palette],
  )

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [currency, setCurrency] = useState<'SOL' | 'USDC'>('SOL')
  const [category, setCategory] = useState<PotCategory>('Goal')
  const [contributors, setContributors] = useState<Set<string>>(new Set())

  const [targetDate, setTargetDate] = useState(getDefaultTargetDateString)
  const [showPicker, setShowPicker] = useState(false)
  const [showCustomPicker, setShowCustomPicker] = useState(false)
  const [customDate, setCustomDate] = useState(() => {
    const parsed = new Date(getDefaultTargetDateString())
    return isNaN(parsed.getTime()) ? tomorrow() : parsed
  })
  const isIOS = Platform.OS === 'ios'

  const ensureFuture = (date: Date) => {
    const min = tomorrow()
    return date.getTime() < min.getTime() ? min : date
  }

  const numAmount = parseFloat(amount)
  const dateObj = new Date(targetDate)

  const valid =
    name.trim().length > 0 &&
    !isNaN(numAmount) &&
    numAmount > 0 &&
    !isNaN(dateObj.getTime()) &&
    dateObj > new Date() &&
    contributors.size > 0 &&
    category !== undefined

  const applyDate = (d: Date) => {
    const n = ensureFuture(d)
    setCustomDate(n)
    setTargetDate(formatDate(n))
    setShowPicker(false)
    setShowCustomPicker(false)
  }

  const pickQuick = (days: number) => applyDate(new Date(Date.now() + days * dayMs))

  const openDateOverlay = () => {
    setCustomDate(ensureFuture(new Date(targetDate)))
    setShowPicker(true)
    setShowCustomPicker(false)
  }

  const toggleContributor = (addr: string) =>
    setContributors((prev) => {
      const next = new Set(prev)
      next.has(addr) ? next.delete(addr) : next.add(addr)
      return next
    })

  const create = () => {
    if (!account) return Alert.alert('Connect wallet', 'Please connect wallet.')
    if (!valid) return Alert.alert('Invalid', 'Fill required fields properly.')

    const uniqueContributors = new Set([account.address, ...Array.from(contributors)])
    const allContributors = Array.from(uniqueContributors)

    createPot({
      name: name.trim(),
      description: description.trim() || undefined,
      creatorAddress: account.address,
      targetAmount: numAmount,
      targetDate: new Date(targetDate),
      currency,
      category,
      contributors: allContributors,
    })

    showToast({
      title: 'Pot created',
      message: `${name.trim()} is ready to fund`,
      type: 'success',
    })

    router.back()
  }

  if (!account) {
    return (
      <AppPage>
        <View style={styles.disconnected}>
          <Text style={[styles.disconnectedText, { color: palette.textSecondary }]}>
            Please connect your wallet
          </Text>
        </View>
      </AppPage>
    )
  }

  return (
    <AppPage>
      <LinearGradient
        colors={palette.gradient}
        locations={isDark ? [0, 0.55, 1] : [0, 0.5, 1]}
        style={styles.gradient}
      >
        <View style={styles.screen}>
          <CreatePotHeader
            palette={palette}
            isValid={valid}
            onCancel={() => router.back()}
            onCreate={create}
          />

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              styles.scrollContent,
              { paddingBottom: Platform.OS === 'ios' ? 48 : 32 },
            ]}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
          >
            <OverviewSection
              name={name}
              description={description}
              targetDate={targetDate}
              palette={palette}
              inputBaseStyle={inputBaseStyle}
              isDark={isDark}
              onNameChange={setName}
              onDescriptionChange={setDescription}
              onDatePress={openDateOverlay}
            />

            <GoalSection
              amount={amount}
              currency={currency}
              palette={palette}
              inputBaseStyle={inputBaseStyle}
              isDark={isDark}
              onAmountChange={setAmount}
              onCurrencyChange={setCurrency}
            />

            <CategorySelector
              category={category}
              palette={palette}
              cardStyle={cardStyle}
              onCategoryChange={setCategory}
            />

            <ContributorSelector
              friends={friends}
              selectedContributors={contributors}
              palette={palette}
              cardStyle={cardStyle}
              onToggleContributor={toggleContributor}
            />

            <TouchableOpacity
              style={[styles.primaryButtonWrapper, { shadowColor: palette.accent }]}
              onPress={create}
              activeOpacity={0.9}
              disabled={!valid}
            >
              <LinearGradient
                colors={[palette.accent, palette.accentSecondary]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={[styles.primaryButton, { opacity: valid ? 1 : 0.5 }]}
              >
                <Text style={styles.primaryButtonText}>Create pot</Text>
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>
        </View>

        <DatePickerModal
          visible={showPicker}
          customDate={customDate}
          showCustomPicker={showCustomPicker}
          palette={palette}
          cardStyle={cardStyle}
          isDark={isDark}
          isIOS={isIOS}
          onClose={() => {
            setShowPicker(false)
            setShowCustomPicker(false)
          }}
          onQuickSelect={pickQuick}
          onCustomDateChange={setCustomDate}
          onShowCustomPicker={() => setShowCustomPicker((s) => !s)}
          onApplyDate={applyDate}
        />
      </LinearGradient>
    </AppPage>
  )
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  screen: {
    flex: 1,
  },
  disconnected: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  disconnectedText: {
    fontSize: 16,
  },
  scrollContent: {
    paddingHorizontal: 18,
    gap: 16,
  },
  primaryButtonWrapper: {
    marginTop: 8,
    marginBottom: 20,
    borderRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  primaryButton: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#041015',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
})
