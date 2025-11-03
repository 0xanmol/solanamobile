# Settle Backend API

Express.js backend with SQLite3 database for the Settle app (Splitwise clone for Solana Mobile).

## Tech Stack

- **Express.js** - Web framework
- **SQLite3** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing (not used for wallet auth)

## Features

- ✅ Wallet-based authentication (Solana public key)
- ✅ Groups & expense management
- ✅ Friend system
- ✅ Balance calculation & settlements
- ✅ Activity feed
- ✅ Settings management
- ✅ Group invitations
- ✅ Search functionality

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

3. Initialize database:
```bash
npm run init-db
```

4. Start server:
```bash
# Development (with nodemon)
npm run dev

# Production
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/connect` - Connect wallet (check if user exists)
- `POST /api/auth/complete-profile` - Complete profile for new users
- `POST /api/auth/logout` - Logout

### Users
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update profile
- `POST /api/user/profile-image` - Upload profile image
- `DELETE /api/user/account` - Delete account

### Groups
- `GET /api/groups` - Get all groups
- `GET /api/groups/:id` - Get single group
- `POST /api/groups` - Create group
- `PUT /api/groups/:id` - Update group
- `DELETE /api/groups/:id` - Delete group
- `POST /api/groups/:id/leave` - Leave group
- `GET /api/groups/:id/members` - Get group members
- `POST /api/groups/:id/members` - Add member to group

### Expenses
- `GET /api/expenses` - Get all expenses
- `GET /api/expenses/:id` - Get single expense
- `POST /api/expenses` - Create expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense
- `PUT /api/expenses/:id/split` - Adjust split

### Friends
- `GET /api/friends` - Get all friends
- `POST /api/friends` - Add friend
- `DELETE /api/friends/:id` - Remove friend
- `GET /api/friends/search` - Search users

### Balances
- `GET /api/balances` - Get balances
- `POST /api/balances/settle` - Create settlement

### Activity
- `GET /api/activity` - Get activity feed

### Settings
- `GET /api/settings/email` - Get email settings
- `PUT /api/settings/email` - Update email settings

### Invites
- `GET /api/invites/:groupId` - Get invite code
- `POST /api/invites/join` - Join via invite code

### Search
- `GET /api/search/users` - Search users
- `GET /api/search` - Unified search

## Authentication Flow

1. User connects wallet (provides public key)
2. Backend checks if pubkey exists:
   - **Exists**: Return token + user data
   - **New**: Create user, return token + requiresProfileCompletion flag
3. If new user, frontend shows profile completion screen
4. User submits name (and optional phone)
5. Frontend calls `/api/auth/complete-profile`
6. User is now fully registered

## Database Schema

- **users** - User accounts (pubkey-based auth)
- **groups** - Expense groups
- **group_members** - Group membership
- **friends** - Friend relationships
- **expenses** - Expense records
- **expense_participants** - Split details
- **settlements** - Payment records
- **activities** - Activity feed
- **email_settings** - Notification preferences

## Frontend Integration

### Android Emulator
Use `http://10.0.2.2:3000` as the API base URL

### iOS Simulator
Use `http://localhost:3000` as the API base URL

### Example .env configuration for frontend:
```
API_URL_ANDROID=http://10.0.2.2:3000/api
API_URL_IOS=http://localhost:3000/api
```

## Development

- Database file: `settle.db`
- Logs: Check console output
- Reset database: `rm settle.db && npm run init-db`

## License

MIT
