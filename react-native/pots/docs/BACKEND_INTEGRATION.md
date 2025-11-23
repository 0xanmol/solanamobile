# Backend Integration Guide

This document explains how the frontend state management works and what your backend API needs to implement.

## Overview

The entire application uses a **central state store** (`store/app-store.ts`) powered by Zustand. All data flows through this store, making it easy to replace mock data with real API calls.

## Architecture

```
┌─────────────────────────────────────────┐
│         React Components                 │
│  (PotsScreen, FriendsScreen, etc.)      │
└──────────────┬──────────────────────────┘
               │
               │ Uses store hooks
               ▼
┌─────────────────────────────────────────┐
│         Central State Store              │
│         (store/app-store.ts)            │
│                                         │
│  - friends: Friend[]                   │
│  - pots: Pot[]                         │
│  - activities: Activity[]              │
│                                         │
│  + Methods (addFriend, createPot, etc.)│
└──────────────┬──────────────────────────┘
               │
               │ Currently: Mock data
               │ Future: API calls
               ▼
┌─────────────────────────────────────────┐
│         Your Backend API                │
│                                         │
│  - REST endpoints                       │
│  - WebSocket/SSE (optional)             │
└─────────────────────────────────────────┘
```

## Data Structures

All data types are defined in `store/app-store.ts`. Here's what your API should return:

### Friend
```typescript
{
  id: string
  publicKey: string  // Solana public key (base58)
  address: string    // Same as publicKey
  displayName?: string
  addedAt: string    // ISO 8601 date
}
```

### Pot
```typescript
{
  id: string
  name: string
  description?: string
  creatorAddress: string  // Solana public key
  targetAmount: number
  targetDate: string      // ISO 8601 date
  currency: 'SOL' | 'USDC'
  category: 'Goal' | 'Emergency' | 'Bills' | 'Events' | 'Others'
  contributors: string[]  // Array of Solana addresses
  contributions: Contribution[]
  createdAt: string      // ISO 8601 date
  isReleased: boolean
  releasedAt?: string   // ISO 8601 date
  releasedBy?: string   // Solana address
}
```

### Contribution
```typescript
{
  id: string
  potId: string
  contributorAddress: string  // Solana public key
  amount: number
  currency: 'SOL' | 'USDC'
  timestamp: string  // ISO 8601 date
}
```

### Activity
```typescript
{
  id: string
  type: 'pot_created' | 'contribution' | 'release' | 'friend_added'
  timestamp: string  // ISO 8601 date
  userId: string    // Solana address
  userName?: string
  potId?: string
  potName?: string
  friendId?: string
  friendAddress?: string
  amount?: number
  currency?: 'SOL' | 'USDC'
}
```

## Required API Endpoints

### Friends

#### `GET /api/friends`
Get all friends for the authenticated user.

**Response:**
```json
{
  "friends": [
    {
      "id": "friend-123",
      "publicKey": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
      "address": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
      "displayName": "Alice",
      "addedAt": "2024-01-15T10:00:00Z"
    }
  ]
}
```

#### `POST /api/friends`
Add a new friend.

**Request:**
```json
{
  "address": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
  "displayName": "Alice"
}
```

**Response:** Friend object

#### `DELETE /api/friends/:id`
Remove a friend.

### Pots

#### `GET /api/pots`
Get all pots. Should support query params:
- `userAddress` - Filter pots where user is creator or contributor

**Response:**
```json
{
  "pots": [
    {
      "id": "pot-123",
      "name": "Trip to Japan",
      "description": "Saving up for our dream vacation",
      "creatorAddress": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
      "targetAmount": 50,
      "targetDate": "2024-04-15T00:00:00Z",
      "currency": "SOL",
      "category": "Goal",
      "contributors": ["7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU"],
      "contributions": [],
      "createdAt": "2024-01-15T10:00:00Z",
      "isReleased": false
    }
  ]
}
```

#### `GET /api/pots/:id`
Get a single pot by ID.

#### `POST /api/pots`
Create a new pot.

**Request:**
```json
{
  "name": "Trip to Japan",
  "description": "Saving up for our dream vacation",
  "creatorAddress": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
  "targetAmount": 50,
  "targetDate": "2024-04-15T00:00:00Z",
  "currency": "SOL",
  "category": "Goal",
  "contributors": ["7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU"]
}
```

**Note:** `creatorAddress` should automatically be added to `contributors` array if not present.

**Response:** Complete pot object with `id`, `createdAt`, `contributions: []`, `isReleased: false`

#### `PATCH /api/pots/:id`
Update pot details (name, description, etc.).

**Request:**
```json
{
  "name": "Updated Name",
  "description": "Updated description"
}
```

#### `POST /api/pots/:id/contributors`
Add a contributor to a pot.

**Request:**
```json
{
  "contributorAddress": "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM"
}
```

**Note:** If the contributor is not in the user's friends list, they should be automatically added.

#### `POST /api/pots/:id/contributions`
Add a contribution to a pot.

**Request:**
```json
{
  "contributorAddress": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
  "amount": 10,
  "currency": "SOL"
}
```

**Note:** 
- `currency` must match the pot's currency
- Should automatically create an activity entry
- Should validate that contributor is in the pot's contributors list

**Response:** Complete contribution object with `id` and `timestamp`

#### `POST /api/pots/:id/release`
Release pot funds.

**Request:**
```json
{
  "releasedBy": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU"
}
```

**Validation:**
- Only allowed when total contributions >= targetAmount (100% progress)
- Should automatically create an activity entry

**Response:** Updated pot object with `isReleased: true`, `releasedAt`, `releasedBy`

### Activities

#### `GET /api/activities`
Get activities. Should support query params:
- `userAddress` - Filter activities relevant to user

**Activity Visibility Rules:**
- User is creator/contributor of related pot
- User is friends with activity user
- Activity is performed by user themselves

**Response:**
```json
{
  "activities": [
    {
      "id": "act-123",
      "type": "pot_created",
      "timestamp": "2024-01-15T10:00:00Z",
      "userId": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
      "potId": "pot-123",
      "potName": "Trip to Japan"
    }
  ]
}
```

## Integration Steps

### Step 1: Replace Mock Data Initialization

In `store/app-store.ts`, replace the `createMockData()` call with API initialization:

```typescript
export const useAppStore = create<AppStore>((set, get) => {
  // Initialize with empty arrays
  return {
    friends: [],
    pots: [],
    activities: [],
    
    // Fetch initial data
    initialize: async (userAddress: string) => {
      const [friends, pots, activities] = await Promise.all([
        fetch(`/api/friends?userAddress=${userAddress}`).then(r => r.json()),
        fetch(`/api/pots?userAddress=${userAddress}`).then(r => r.json()),
        fetch(`/api/activities?userAddress=${userAddress}`).then(r => r.json())
      ])
      set({ friends, pots, activities })
    },
    
    // ... rest of methods
  }
})
```

### Step 2: Update Store Methods to Call API

Replace direct state updates with API calls:

```typescript
addFriend: async (publicKey, address, displayName) => {
  try {
    const response = await fetch('/api/friends', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address, displayName })
    })
    const friend = await response.json()
    set((state) => ({ friends: [...state.friends, friend] }))
    // Auto-create activity
    get().addActivity({
      type: 'friend_added',
      userId: address,
      friendId: friend.id,
      friendAddress: address,
    })
  } catch (error) {
    // Handle error (show toast, etc.)
    throw error
  }
}
```

### Step 3: Add Loading and Error States

Consider adding loading/error states to the store:

```typescript
interface AppStore {
  // ... existing state
  isLoading: boolean
  error: string | null
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}
```

### Step 4: Implement Real-time Updates (Optional)

For real-time updates (new contributions, pot releases), consider:

1. **WebSocket Connection:**
```typescript
useEffect(() => {
  const ws = new WebSocket('wss://your-api.com/ws')
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data)
    if (data.type === 'contribution') {
      // Update pot contributions
    }
  }
  return () => ws.close()
}, [])
```

2. **Server-Sent Events (SSE):**
```typescript
useEffect(() => {
  const eventSource = new EventSource('/api/events')
  eventSource.onmessage = (event) => {
    const data = JSON.parse(event.data)
    // Update store
  }
  return () => eventSource.close()
}, [])
```

## Authentication

The app uses Solana wallet authentication. Your backend should:

1. Verify wallet signatures for authentication
2. Use the wallet address as the user identifier
3. Validate that users can only modify their own data or data they have permission for

## Error Handling

All API calls should return standard error responses:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid contribution amount",
    "details": {}
  }
}
```

Handle errors in store methods and show user-friendly messages.

## Testing

When testing your backend integration:

1. Start with empty state (no mock data)
2. Test each store method individually
3. Verify state updates correctly after API calls
4. Test error scenarios
5. Test edge cases (empty lists, invalid data, etc.)

## Questions?

Refer to `store/app-store.ts` for:
- Complete type definitions
- Method signatures
- Expected behavior
- Mock data examples

