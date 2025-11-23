export type PotCategory = 'Goal' | 'Emergency' | 'Bills' | 'Events' | 'Others'

export type Friend = {
  id: string
  publicKey: string
  address: string
  displayName?: string
  addedAt: string
}

export type Contribution = {
  id: string
  potId: string
  contributorAddress: string
  amount: number
  currency: 'SOL' | 'USDC'
  timestamp: string
}

export type Pot = {
  id: string
  name: string
  description?: string
  creatorAddress: string
  targetAmount: number
  targetDate: string
  currency: 'SOL' | 'USDC'
  category: PotCategory
  contributors: string[]
  contributions: Contribution[]
  createdAt: string
  isReleased: boolean
  releasedAt?: string
  releasedBy?: string
}

export type ActivityType = 'pot_created' | 'contribution' | 'release' | 'friend_added'

export type Activity = {
  id: string
  type: ActivityType
  timestamp: string
  userId: string
  userName?: string
  potId?: string
  potName?: string
  friendId?: string
  friendAddress?: string
  amount?: number
  currency?: 'SOL' | 'USDC'
}

export type CreatePotRequest = {
  name: string
  description?: string
  creatorAddress: string
  targetAmount: number
  targetDate: string
  currency: 'SOL' | 'USDC'
  category: PotCategory
  contributors: string[]
}

export type UpdatePotRequest = {
  name?: string
  description?: string
  targetAmount?: number
  targetDate?: string
  currency?: 'SOL' | 'USDC'
  category?: PotCategory
}

export type AddContributionRequest = {
  potId: string
  contributorAddress: string
  amount: number
  currency: 'SOL' | 'USDC'
}

export type AddFriendRequest = {
  address: string
  displayName?: string
}

export type UpdateFriendRequest = {
  displayName?: string
}
