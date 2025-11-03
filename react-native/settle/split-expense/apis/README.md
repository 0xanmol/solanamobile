# API Layer

This folder contains mock API implementations that simulate backend API calls. All functions log their request/response data to the console for debugging and development purposes.

## Structure

```
apis/
├── index.ts          # Central export for all APIs
├── auth.ts           # Authentication (signup, login, logout)
├── user.ts           # User profile management
├── groups.ts         # Group CRUD operations
├── friends.ts        # Friends management
├── expenses.ts       # Expense tracking
├── balances.ts       # Balance calculation & settlement
├── activity.ts       # Activity feed
├── settings.ts       # User settings
├── invites.ts        # Group invitations
├── whiteboard.ts     # Group whiteboard/notes
├── reports.ts        # Reports & exports
├── search.ts         # Search functionality
└── other.ts          # Miscellaneous (scan, timezone, etc.)
```

## Usage

Import the APIs you need:

```typescript
import { signup, login } from '@/apis/auth';
import { createGroup, getGroups } from '@/apis/groups';
import { createExpense } from '@/apis/expenses';
```

Or import everything:

```typescript
import * as API from '@/apis';
```

## Example

```typescript
// Signup a new user
const handleSignup = async () => {
  const response = await signup({
    fullName: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
  });
  
  if (response.success) {
    console.log('User created:', response.user);
  }
};

// Create a group
const handleCreateGroup = async () => {
  const response = await createGroup({
    name: 'Weekend Trip',
    type: 'trip',
    startDate: '2025-01-01',
    endDate: '2025-01-07',
  });
  
  console.log('Group created:', response.group);
};
```

## API Categories

### Authentication (`auth.ts`)
- `signup(data)` - User registration
- `login(data)` - Email/password login
- `googleSignIn()` - Google OAuth
- `logout()` - User logout
- `forgotPassword(email)` - Password reset

### User Profile (`user.ts`)
- `getCurrentUser()` - Get current user
- `updateProfile(data)` - Update profile
- `updatePassword(currentPassword, newPassword)` - Change password
- `uploadProfileImage(imageUri)` - Upload avatar
- `deleteAccount()` - Delete account

### Groups (`groups.ts`)
- `getGroups()` - List all groups
- `getGroup(id)` - Get group details
- `createGroup(data)` - Create new group
- `updateGroup(id, data)` - Update group
- `deleteGroup(id)` - Delete group
- `leaveGroup(id)` - Leave group
- `updateGroupSettings(id, settings)` - Update settings
- `searchGroups(query)` - Search groups
- `getGroupMembers(groupId)` - Get members
- `addGroupMember(groupId, data)` - Add member

### Friends (`friends.ts`)
- `getFriends()` - List friends
- `addFriend(data)` - Add friend
- `inviteFriend(data)` - Send invitation
- `getContacts()` - Get phone contacts
- `removeFriend(friendId)` - Remove friend

### Expenses (`expenses.ts`)
- `createExpense(data)` - Create expense
- `getExpenses(groupId?)` - List expenses
- `getExpense(id)` - Get expense details
- `updateExpense(id, data)` - Update expense
- `deleteExpense(id)` - Delete expense
- `adjustSplit(expenseId, data)` - Adjust split

### Balances (`balances.ts`)
- `getBalances(groupId?)` - Get balances
- `remindDebt(data)` - Send reminder
- `settleUp(data)` - Process settlement
- `addSettleUpDate(data)` - Add settlement date
- `addPeopleToSettleUp(data)` - Add people

### Activity (`activity.ts`)
- `getActivity()` - Get activity feed
- `getActivityByGroup(groupId)` - Get group activity

### Settings (`settings.ts`)
- `updateAccountSettings(settings)` - Update account
- `updateEmailSettings(settings)` - Update email prefs
- `updateSecuritySettings(settings)` - Update security
- `manageBlocklist(action, userId)` - Manage blocks
- `getBlocklist()` - Get blocked users

### Invites (`invites.ts`)
- `getInviteLink(groupId)` - Get invite link
- `copyInviteLink(groupId)` - Copy to clipboard
- `shareInviteLink(groupId, method)` - Share link
- `changeInviteLink(groupId)` - Regenerate link
- `joinGroupByLink(inviteCode)` - Join via link

### Whiteboard (`whiteboard.ts`)
- `getMessages(groupId)` - Get messages
- `saveMessage(groupId, message)` - Save message
- `deleteMessage(groupId, messageId)` - Delete message
- `clearAllMessages(groupId)` - Clear all

### Reports (`reports.ts`)
- `exportExpenses(groupId?, format)` - Export data
- `getCharts(groupId)` - Get chart data
- `getTotals(groupId?, period)` - Get totals
- `convertCurrency(data)` - Currency conversion

### Search (`search.ts`)
- `searchUsers(query)` - Search users
- `searchAll(query)` - Unified search

### Other (`other.ts`)
- `scanReceipt(imageUri)` - OCR receipt scan
- `updateTimezone(timezone)` - Update timezone
- `updateCurrency(currency)` - Update currency
- `updateLanguage(language)` - Update language

## Console Logging

All API functions log:
1. **Request**: Endpoint and request body
2. **Response**: Mock response data

Example console output:
```
[API] Request: { endpoint: 'POST /api/auth/signup', body: { ... } }
[API] Response: { success: true, user: { ... }, token: '...' }
```

## Future Integration

When integrating with a real backend:
1. Replace the mock implementations with actual API calls
2. Use `fetch` or `axios` for HTTP requests
3. Keep the same function signatures
4. Update error handling as needed
5. Add authentication headers/tokens

Example real implementation:
```typescript
export const signup = async (data: SignupData): Promise<AuthResponse> => {
  const response = await fetch('https://api.yourapp.com/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return response.json();
};
```

