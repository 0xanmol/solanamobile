import { AppPage } from '@/components/app-page'
import { AppText } from '@/components/app-text'
import { AppView } from '@/components/app-view'
import { AddContributorModal } from '@/components/pots/AddContributorModal'
import { ContributeModal } from '@/components/pots/ContributeModal'
import { ContributionList } from '@/components/pots/ContributionList'
import { ContributorList } from '@/components/pots/ContributorList'
import { EditPotModal } from '@/components/pots/EditPotModal'
import { PotActions } from '@/components/pots/PotActions'
import { PotHeader } from '@/components/pots/PotHeader'
import { PotInfoCard } from '@/components/pots/PotInfoCard'
import { PotProgressCard } from '@/components/pots/PotProgressCard'
import { PotTabs } from '@/components/pots/PotTabs'
import { useWalletUi } from '@/components/solana/use-wallet-ui'
import { useToast } from '@/components/toast/toast-provider'
import { Colors } from '@/constants/colors'
import { PotCategory, useAppStore } from '@/store/app-store'
import { ellipsify } from '@/utils/ellipsify'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useCallback, useState } from 'react'
import { Alert, ScrollView, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native'

export default function PotDetailsScreen() {
  const router = useRouter()
  const { id } = useLocalSearchParams<{ id: string }>()
  const colorScheme = useColorScheme()
  const isDark = colorScheme === 'dark'
  const colors = Colors[isDark ? 'dark' : 'light']
  const { account } = useWalletUi()
  const { getPotById, addContribution, releasePot, updatePot, addContributorToPot, friends } = useAppStore()
  const { showToast } = useToast()
  const pot = id ? getPotById(id) : null

  const [showContributeModal, setShowContributeModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showAddContributorModal, setShowAddContributorModal] = useState(false)
  const [contributionAmount, setContributionAmount] = useState('')
  const [contributionCurrency, setContributionCurrency] = useState<'SOL' | 'USDC'>('SOL')
  const [editName, setEditName] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [activeTab, setActiveTab] = useState<'contributions' | 'contributors'>('contributions')

  if (!pot) {
    return (
      <AppPage>
        <AppView style={styles.emptyContainer}>
          <AppText>Pot not found</AppText>
          <TouchableOpacity onPress={() => router.back()}>
            <AppText style={[styles.backButton, { color: colors.accentGreen }]}>Go Back</AppText>
          </TouchableOpacity>
        </AppView>
      </AppPage>
    )
  }

  if (!account) {
    return (
      <AppPage>
        <AppView style={styles.emptyContainer}>
          <AppText>Please connect your wallet</AppText>
        </AppView>
      </AppPage>
    )
  }

  const totalContributed = pot.contributions.reduce((sum, c) => sum + c.amount, 0)
  const progress = Math.min((totalContributed / pot.targetAmount) * 100, 100)
  const isTargetReached = progress >= 100
  const isReleaseable = isTargetReached && !pot.isReleased
  const isContributor = pot.contributors.includes(account.address) || pot.creatorAddress === account.address

  const handleContribute = () => {
    const amount = parseFloat(contributionAmount)
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount greater than 0')
      return
    }

    const currency = pot.currency

    addContribution({
      potId: pot.id,
      contributorAddress: account.address,
      amount,
      currency,
    })

    setContributionAmount('')
    setShowContributeModal(false)
    showToast({
      title: 'Contribution sent',
      message: `+${amount.toFixed(2)} ${currency} into ${pot.name}`,
      type: 'success',
    })
  }

  const handleRelease = () => {
    Alert.alert('Release Pot', 'Are you sure you want to release this pot?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Release',
        onPress: () => {
          releasePot(pot.id, account.address)
          showToast({
            title: 'Pot released',
            message: `${pot.name} funds are now available`,
            type: 'success',
          })
        },
      },
    ])
  }

  const handleEdit = (name: string, description: string) => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a pot name')
      return
    }

    updatePot(pot.id, {
      name: name.trim(),
      description: description.trim() || undefined,
    })

    setShowEditModal(false)
    setEditName('')
    setEditDescription('')
    showToast({
      title: 'Pot updated',
      message: 'Details saved for everyone',
      type: 'info',
    })
  }

  const handleAddContributor = (friendAddress: string) => {
    if (pot.contributors.includes(friendAddress)) {
      showToast({
        title: 'Already in the pot',
        message: 'This contributor is already part of the group',
        type: 'warning',
      })
      return
    }

    addContributorToPot(pot.id, friendAddress)
    setShowAddContributorModal(false)
    const friendName =
      friends.find((f) => f.address === friendAddress)?.displayName || ellipsify(friendAddress, 6)
    showToast({
      title: 'Contributor added',
      message: `${friendName} can now pitch in`,
      type: 'success',
    })
  }

  const getContributorName = useCallback(
    (address: string) => {
      if (address === pot.creatorAddress) return 'Creator'
      const friend = friends.find((f) => f.address === address)
      return friend?.displayName || ellipsify(address, 8)
    },
    [pot.creatorAddress, friends]
  )

  const getCategoryIcon = useCallback((category: PotCategory) => {
    switch (category) {
      case 'Goal': return 'flag'
      case 'Emergency': return 'emergency'
      case 'Bills': return 'receipt'
      case 'Events': return 'event'
      case 'Others': return 'category'
      default: return 'savings'
    }
  }, [])

  const getCategoryColor = useCallback((category: PotCategory) => {
    switch (category) {
      case 'Goal': return '#22E1A2'
      case 'Emergency': return '#FF6B6B'
      case 'Bills': return '#4ECDC4'
      case 'Events': return '#FFD93D'
      case 'Others': return '#95A5A6'
      default: return colors.accentGreen
    }
  }, [colors.accentGreen])

  return (
    <AppPage>
      <PotHeader
        potName={pot.name}
        colors={colors}
        onBack={() => router.back()}
        onEdit={() => {
          setEditName(pot.name)
          setEditDescription(pot.description || '')
          setShowEditModal(true)
        }}
      />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {pot.description && (
          <AppText style={[styles.description, { color: colors.textSecondary }]}>{pot.description}</AppText>
        )}

        <PotProgressCard
          progress={progress}
          totalContributed={totalContributed}
          targetAmount={pot.targetAmount}
          currency={pot.currency}
          colors={colors}
        />

        <PotInfoCard pot={pot} colors={colors} getCategoryIcon={getCategoryIcon} getCategoryColor={getCategoryColor} />

        <PotActions
          isContributor={isContributor}
          isReleased={pot.isReleased}
          isReleaseable={isReleaseable}
          isTargetReached={isTargetReached}
          progress={progress}
          colors={colors}
          onContribute={() => {
            setContributionCurrency(pot.currency)
            setShowContributeModal(true)
          }}
          onRelease={handleRelease}
          onAddContributor={() => setShowAddContributorModal(true)}
        />

        <PotTabs
          activeTab={activeTab}
          contributionsCount={pot.contributions.length}
          contributorsCount={pot.contributors.length}
          colors={colors}
          onTabChange={setActiveTab}
        />

        {activeTab === 'contributions' && (
          <ContributionList
            contributions={pot.contributions}
            getContributorName={getContributorName}
            colors={colors}
          />
        )}

        {activeTab === 'contributors' && (
          <ContributorList
            contributors={pot.contributors}
            creatorAddress={pot.creatorAddress}
            getContributorName={getContributorName}
            colors={colors}
          />
        )}
      </ScrollView>

      <ContributeModal
        visible={showContributeModal}
        amount={contributionAmount}
        currency={pot.currency}
        potName={pot.name}
        colors={colors}
        onClose={() => {
          setShowContributeModal(false)
          setContributionAmount('')
        }}
        onAmountChange={setContributionAmount}
        onSubmit={handleContribute}
      />

      <EditPotModal
        visible={showEditModal}
        name={editName || pot.name}
        description={editDescription || pot.description || ''}
        colors={colors}
        onClose={() => {
          setShowEditModal(false)
          setEditName('')
          setEditDescription('')
        }}
        onNameChange={setEditName}
        onDescriptionChange={setEditDescription}
        onSubmit={() => handleEdit(editName || pot.name, editDescription || pot.description || '')}
      />

      <AddContributorModal
        visible={showAddContributorModal}
        friends={friends}
        existingContributors={pot.contributors}
        colors={colors}
        onClose={() => setShowAddContributorModal(false)}
        onSelectFriend={handleAddContributor}
      />
    </AppPage>
  )
}

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  backButton: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 10,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 12,
  },
  description: {
    fontSize: 13,
    marginBottom: 12,
    lineHeight: 18,
  },
})
