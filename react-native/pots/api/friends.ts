import { Friend, AddFriendRequest, UpdateFriendRequest } from './types'
import { useAppStore } from '@/store/app-store'
import { PublicKey } from '@solana/web3.js'

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.example.com'

export async function addFriend(request: AddFriendRequest): Promise<Friend> {
  const response = await fetch(`${API_BASE_URL}/api/friends`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    throw new Error('Failed to add friend')
  }

  const friend = await response.json()

  useAppStore.getState().addFriend(
    new PublicKey(friend.address),
    friend.address,
    friend.displayName
  )

  return friend
}

export async function removeFriend(friendId: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/friends/${friendId}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error('Failed to remove friend')
  }

  useAppStore.getState().removeFriend(friendId)
}

export async function updateFriend(friendId: string, updates: UpdateFriendRequest): Promise<Friend> {
  const response = await fetch(`${API_BASE_URL}/api/friends/${friendId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  })

  if (!response.ok) {
    throw new Error('Failed to update friend')
  }

  const friend = await response.json()

  const store = useAppStore.getState()
  const existingFriend = store.friends.find((f) => f.id === friendId)
  if (existingFriend) {
    const updatedFriends = store.friends.map((f) =>
      f.id === friendId
        ? {
            ...f,
            displayName: friend.displayName,
          }
        : f
    )
    useAppStore.setState({ friends: updatedFriends })
  }

  return friend
}

export async function getFriendById(friendId: string): Promise<Friend | null> {
  const response = await fetch(`${API_BASE_URL}/api/friends/${friendId}`)

  if (!response.ok) {
    return null
  }

  return await response.json()
}

export async function getFriendByAddress(address: string): Promise<Friend | null> {
  const response = await fetch(`${API_BASE_URL}/api/friends?address=${address}`)

  if (!response.ok) {
    return null
  }

  const friend = await response.json()

  const store = useAppStore.getState()
  const existingFriend = store.getFriendByAddress(address)
  if (!existingFriend && friend) {
    useAppStore.getState().addFriend(
      new PublicKey(friend.address),
      friend.address,
      friend.displayName
    )
  }

  return friend
}

export async function getFriends(): Promise<Friend[]> {
  const response = await fetch(`${API_BASE_URL}/api/friends`)

  if (!response.ok) {
    return []
  }

  const friends = await response.json()

  friends.forEach((friend: Friend) => {
    const store = useAppStore.getState()
    const existingFriend = store.getFriendByAddress(friend.address)
    if (!existingFriend) {
      useAppStore.getState().addFriend(
        new PublicKey(friend.address),
        friend.address,
        friend.displayName
      )
    }
  })

  return friends
}
