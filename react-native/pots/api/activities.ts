import { useAppStore } from '@/store/app-store'
import { Activity } from './types'

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.example.com'

export async function getActivitiesForUser(userAddress: string): Promise<Activity[]> {
  const response = await fetch(`${API_BASE_URL}/api/activities?userAddress=${userAddress}`)

  if (!response.ok) {
    return []
  }

  const activities = await response.json()

  activities.forEach((activity: Activity) => {
    const store = useAppStore.getState()
    const existingActivity = store.activities.find((a) => a.id === activity.id)
    if (!existingActivity) {
      useAppStore.getState().addActivity({
        type: activity.type,
        userId: activity.userId,
        userName: activity.userName,
        potId: activity.potId,
        potName: activity.potName,
        friendId: activity.friendId,
        friendAddress: activity.friendAddress,
        amount: activity.amount,
        currency: activity.currency,
      })
    }
  })

  return activities
}

export async function getAllActivities(): Promise<Activity[]> {
  const response = await fetch(`${API_BASE_URL}/api/activities`)

  if (!response.ok) {
    return []
  }

  const activities = await response.json()

  activities.forEach((activity: Activity) => {
    const store = useAppStore.getState()
    const existingActivity = store.activities.find((a) => a.id === activity.id)
    if (!existingActivity) {
      useAppStore.getState().addActivity({
        type: activity.type,
        userId: activity.userId,
        userName: activity.userName,
        potId: activity.potId,
        potName: activity.potName,
        friendId: activity.friendId,
        friendAddress: activity.friendAddress,
        amount: activity.amount,
        currency: activity.currency,
      })
    }
  })

  return activities
}

export async function getActivitiesForPot(potId: string): Promise<Activity[]> {
  const response = await fetch(`${API_BASE_URL}/api/activities?potId=${potId}`)

  if (!response.ok) {
    return []
  }

  const activities = await response.json()

  activities.forEach((activity: Activity) => {
    const store = useAppStore.getState()
    const existingActivity = store.activities.find((a) => a.id === activity.id)
    if (!existingActivity) {
      useAppStore.getState().addActivity({
        type: activity.type,
        userId: activity.userId,
        userName: activity.userName,
        potId: activity.potId,
        potName: activity.potName,
        friendId: activity.friendId,
        friendAddress: activity.friendAddress,
        amount: activity.amount,
        currency: activity.currency,
      })
    }
  })

  return activities
}

export async function markActivityAsRead(activityId: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/activities/${activityId}/read`, {
    method: 'POST',
  })

  if (!response.ok) {
    throw new Error('Failed to mark activity as read')
  }
}
