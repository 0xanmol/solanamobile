import { Pot, CreatePotRequest, UpdatePotRequest, AddContributionRequest } from './types'
import { useAppStore } from '@/store/app-store'

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.example.com'

export async function createPot(request: CreatePotRequest): Promise<Pot> {
  const response = await fetch(`${API_BASE_URL}/api/pots`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    throw new Error('Failed to create pot')
  }

  const pot = await response.json()

  useAppStore.getState().createPot({
    name: pot.name,
    description: pot.description,
    creatorAddress: pot.creatorAddress,
    targetAmount: pot.targetAmount,
    targetDate: new Date(pot.targetDate),
    currency: pot.currency,
    category: pot.category,
    contributors: pot.contributors,
  })

  return pot
}

export async function getPotById(potId: string): Promise<Pot | null> {
  const response = await fetch(`${API_BASE_URL}/api/pots/${potId}`)

  if (!response.ok) {
    return null
  }

  const pot = await response.json()

  const existingPot = useAppStore.getState().getPotById(potId)
  if (!existingPot) {
    useAppStore.getState().createPot({
      name: pot.name,
      description: pot.description,
      creatorAddress: pot.creatorAddress,
      targetAmount: pot.targetAmount,
      targetDate: new Date(pot.targetDate),
      currency: pot.currency,
      category: pot.category,
      contributors: pot.contributors,
    })
  } else {
    useAppStore.getState().updatePot(potId, {
      name: pot.name,
      description: pot.description,
      targetAmount: pot.targetAmount,
      targetDate: new Date(pot.targetDate),
      currency: pot.currency,
      category: pot.category,
      contributors: pot.contributors,
      contributions: pot.contributions.map((c: any) => ({
        ...c,
        timestamp: new Date(c.timestamp),
      })),
      isReleased: pot.isReleased,
      releasedAt: pot.releasedAt ? new Date(pot.releasedAt) : undefined,
      releasedBy: pot.releasedBy,
    })
  }

  return pot
}

export async function getAllPots(): Promise<Pot[]> {
  const response = await fetch(`${API_BASE_URL}/api/pots`)

  if (!response.ok) {
    return []
  }

  const pots = await response.json()

  pots.forEach((pot: Pot) => {
    const existingPot = useAppStore.getState().getPotById(pot.id)
    if (!existingPot) {
      useAppStore.getState().createPot({
        name: pot.name,
        description: pot.description,
        creatorAddress: pot.creatorAddress,
        targetAmount: pot.targetAmount,
        targetDate: new Date(pot.targetDate),
        currency: pot.currency,
        category: pot.category,
        contributors: pot.contributors,
      })
    }
  })

  return pots
}

export async function getUserPots(userAddress: string): Promise<Pot[]> {
  const response = await fetch(`${API_BASE_URL}/api/pots?userAddress=${userAddress}`)

  if (!response.ok) {
    return []
  }

  const pots = await response.json()

  pots.forEach((pot: Pot) => {
    const existingPot = useAppStore.getState().getPotById(pot.id)
    if (!existingPot) {
      useAppStore.getState().createPot({
        name: pot.name,
        description: pot.description,
        creatorAddress: pot.creatorAddress,
        targetAmount: pot.targetAmount,
        targetDate: new Date(pot.targetDate),
        currency: pot.currency,
        category: pot.category,
        contributors: pot.contributors,
      })
    }
  })

  return pots
}

export async function updatePot(potId: string, updates: UpdatePotRequest): Promise<Pot> {
  const response = await fetch(`${API_BASE_URL}/api/pots/${potId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  })

  if (!response.ok) {
    throw new Error('Failed to update pot')
  }

  const pot = await response.json()

  useAppStore.getState().updatePot(potId, {
    name: pot.name,
    description: pot.description,
    targetAmount: pot.targetAmount,
    targetDate: new Date(pot.targetDate),
    currency: pot.currency,
    category: pot.category,
  })

  return pot
}

export async function deletePot(potId: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/pots/${potId}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error('Failed to delete pot')
  }

  const store = useAppStore.getState()
  const updatedPots = store.pots.filter((p) => p.id !== potId)
  useAppStore.setState({ pots: updatedPots })
}

export async function addContributorToPot(potId: string, contributorAddress: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/pots/${potId}/contributors`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ contributorAddress }),
  })

  if (!response.ok) {
    throw new Error('Failed to add contributor')
  }

  useAppStore.getState().addContributorToPot(potId, contributorAddress)
}

export async function removeContributorFromPot(potId: string, contributorAddress: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/pots/${potId}/contributors/${contributorAddress}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error('Failed to remove contributor')
  }

  const store = useAppStore.getState()
  const pot = store.getPotById(potId)
  if (pot) {
    const updatedContributors = pot.contributors.filter((addr) => addr !== contributorAddress)
    useAppStore.getState().updatePot(potId, {
      contributors: updatedContributors,
    })
  }
}

export async function addContribution(request: AddContributionRequest): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/pots/${request.potId}/contributions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contributorAddress: request.contributorAddress,
      amount: request.amount,
      currency: request.currency,
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to add contribution')
  }

  const contribution = await response.json()

  useAppStore.getState().addContribution({
    potId: request.potId,
    contributorAddress: request.contributorAddress,
    amount: contribution.amount,
    currency: contribution.currency,
  })
}

export async function removeContribution(potId: string, contributionId: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/pots/${potId}/contributions/${contributionId}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error('Failed to remove contribution')
  }

  const store = useAppStore.getState()
  const pot = store.getPotById(potId)
  if (pot) {
    const updatedContributions = pot.contributions.filter((c) => c.id !== contributionId)
    useAppStore.getState().updatePot(potId, {
      contributions: updatedContributions,
    })
  }
}

export async function releasePot(potId: string, releasedBy: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/pots/${potId}/release`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ releasedBy }),
  })

  if (!response.ok) {
    throw new Error('Failed to release pot')
  }

  useAppStore.getState().releasePot(potId, releasedBy)
}
