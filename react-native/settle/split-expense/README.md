# Settle - Web3 Expense Splitting App 💰⚡

A modern expense splitting app built with React Native, Expo, and Solana blockchain. Split expenses with friends and settle debts instantly using SOL payments on the Solana network.

## 🌟 Overview

Settle is a Splitwise-inspired expense tracking app that enables **instant on-chain settlement** of debts using Solana. Unlike traditional expense splitting apps where you need to coordinate off-chain payments, Settle allows you to pay your friends directly through the app using your Solana wallet.

### Key Features

- 🔐 **Wallet-Based Authentication** - Connect with Phantom, Solflare, or any Solana wallet
- 👥 **Group Management** - Create groups for trips, roommates, couples, etc.
- 💸 **Expense Tracking** - Track who paid what and split expenses automatically
- ⚡ **Instant Settlement** - Settle debts on-chain using SOL transfers
- 🌓 **Dark/Light Mode** - Beautiful UI that adapts to your preference
- 📱 **Mobile-First** - Built specifically for mobile with Solana Mobile Wallet Adapter

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Android device/emulator OR iOS device/simulator
- Solana wallet app (Phantom, Solflare, etc.) for mobile

### Installation

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Update .env with your backend URL
EXPO_PUBLIC_API_URL=http://your-backend-url:3000/api
```

### Development

```bash
# Start Expo development server
npm start

# Run on Android (requires prebuild)
npx expo prebuild --clean
npm run android

# Run on iOS (requires prebuild)
npx expo prebuild --clean
npm run ios
```

**Note:** This app requires a **development build** (cannot use Expo Go) due to native Solana Mobile Wallet Adapter modules.

## 📁 Project Structure

```
settle/
├── app/                              # Expo Router screens
│   ├── (tabs)/                       # Tab navigation
│   │   ├── groups.tsx                # Groups list
│   │   ├── activity.tsx              # Activity feed
│   │   ├── friends.tsx               # Friends list
│   │   └── account.tsx               # User account
│   ├── login.tsx                     # Wallet connection
│   ├── balances.tsx                  # Settlement screen
│   └── _layout.tsx                   # Root layout with providers
│
├── components/
│   ├── providers/                    # Context providers
│   │   ├── ConnectionProvider.tsx    # Solana RPC connection
│   │   ├── AuthorizationProvider.tsx # Wallet authorization
│   │   └── ThemeProvider.tsx         # Theme management
│   ├── hooks/                        # Custom hooks
│   │   └── useMWAWallet.tsx         # Wallet adapter
│   └── common/                       # Reusable UI components
│
├── solana/                           # Solana-specific logic
│   ├── wallet.ts                     # Wallet operations
│   └── transaction.ts                # Transaction utilities
│
├── apis/                             # Backend API calls
├── constants/                        # App constants & config
├── styles/                           # Screen-specific styles
└── utils/                            # General utilities
```

## 🔧 Technical Stack

### Frontend
- **React Native** with **Expo** (~54.0)
- **TypeScript** for type safety
- **Expo Router** for file-based navigation
- **Solana Web3.js** (^1.98.4) for blockchain interactions
- **Solana Mobile Wallet Adapter** (^2.2.5) for mobile wallet integration
- **AsyncStorage** for local data persistence

### Backend
- Node.js REST API
- SQLite/PostgreSQL database
- JWT authentication
- Transaction signature verification

## 🎯 What Parts Are On-Chain?

### On-Chain Components ⛓️

**1. Settlement Transactions**
- When you settle a debt, a **SOL transfer** is executed on Solana blockchain
- Transaction type: `SystemProgram.transfer()`
- Network: Solana Devnet (for development) / Mainnet (for production)
- Transaction is signed by your wallet and broadcasted to the network

**2. Transaction Verification**
- Backend verifies transaction signatures on-chain
- Ensures payment was actually made before recording settlement

### Off-Chain Components 🗄️

**1. User Data**
- User profiles, names, phone numbers
- Friend relationships

**2. Expense Records**
- Expense descriptions, amounts, dates
- Who paid what and split details

**3. Group Information**
- Group names, types, members
- Calculated balances

**Why Hybrid?** Pure on-chain expense tracking would be expensive and slow. We store metadata off-chain and only execute actual payments on-chain for efficiency.

## 💳 What Are The Transactions Doing?

### Settlement Transaction Flow

```typescript
// 1. Convert USD to SOL using CoinGecko API
const solPrice = await getSolToUsdRate();
const amountInSol = amountInUsd / solPrice;

// 2. Build Solana transaction
const transaction = new Transaction().add(
  SystemProgram.transfer({
    fromPubkey: yourWallet.publicKey,
    toPubkey: new PublicKey(recipientAddress),
    lamports: amountInSol * LAMPORTS_PER_SOL,
  })
);

// 3. Sign and send via wallet app
const signature = await wallet.signAndSendTransaction(transaction);

// 4. Confirm on blockchain
await connection.confirmTransaction(signature);

// 5. Record in backend with transaction signature
await settleUp({
  from: yourUserId,
  to: recipientUserId,
  amount: amountInUsd,
  transactionSignature: signature, // Proof of payment
});
```

**Transaction Details:**
- **Type:** Native SOL transfer using `SystemProgram.transfer()`
- **From:** Your connected wallet address
- **To:** Recipient's wallet address (from their profile)
- **Amount:** Calculated in real-time from USD to SOL
- **Fee:** ~0.000005 SOL (~$0.0001) per transaction
- **Speed:** Confirmed in ~400ms on Solana

## 📦 Third-Party SDKs & Integration

### Solana Mobile Wallet Adapter

**What:** Official Solana SDK for mobile wallet integration
**Packages:**
- `@solana-mobile/mobile-wallet-adapter-protocol` (^2.2.5)
- `@solana-mobile/mobile-wallet-adapter-protocol-web3js` (^2.2.5)

**Integration with React Native:**

```typescript
// 1. Requires development build (not Expo Go)
npx expo prebuild --clean

// 2. Polyfill required for crypto APIs
import 'react-native-get-random-values'; // Must be first import!

// 3. Use transact() for all wallet operations
import { transact } from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';

await transact(async (wallet) => {
  // Authorize wallet
  await wallet.authorize({
    cluster: 'devnet',
    identity: { name: 'Settle', uri: 'https://settle.app' },
  });

  // Sign and send transaction
  const signatures = await wallet.signAndSendTransactions({
    transactions: [transaction],
  });
});
```

**How It Works:**
1. `transact()` opens user's wallet app (Phantom/Solflare)
2. User approves authorization/transaction in their wallet
3. App returns with signed transaction
4. Transaction is broadcasted to Solana network

**React Native Specifics:**
- Uses deep linking to communicate between apps
- Handles app backgrounding/foregrounding automatically
- Preserves session state across app switches
- Authorization tokens cached in AsyncStorage

### Solana Web3.js

**What:** Official Solana JavaScript SDK
**Package:** `@solana/web3.js` (^1.98.4)

**Usage:**
```typescript
import { Connection, PublicKey, Transaction, SystemProgram } from '@solana/web3.js';

// Create RPC connection
const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

// Build transaction
const tx = new Transaction().add(
  SystemProgram.transfer({
    fromPubkey: sender,
    toPubkey: recipient,
    lamports: amount,
  })
);

// Get recent blockhash
const { blockhash } = await connection.getLatestBlockhash();
tx.recentBlockhash = blockhash;
```

**No Anchor SDK:** We use raw Web3.js for simple SOL transfers. Anchor would be needed if we had custom Solana programs, but native transfers are sufficient for our use case.

### Other Key Dependencies

**Expo SDK Suite:**
- `expo-router` - File-based navigation
- `expo-image-picker` - Camera/gallery access
- `expo-haptics` - Haptic feedback
- `expo-font` - Custom fonts (Poppins, Montserrat)

**UI/UX:**
- `react-native-toast-message` - Toast notifications
- `react-native-reanimated` - Animations
- `@react-native-async-storage/async-storage` - Local storage

**HTTP Client:**
- `axios` - Backend API calls

## 🏗️ Architecture

### Provider Architecture (Solana Mobile Best Practices)

```typescript
<ConnectionProvider endpoint="https://api.devnet.solana.com">
  <AuthorizationProvider>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </AuthorizationProvider>
</ConnectionProvider>
```

**ConnectionProvider:**
- Provides memoized Solana RPC connection
- Prevents unnecessary re-instantiation
- Shared across entire app

**AuthorizationProvider:**
- Manages wallet authorization state
- Handles authorize/reauthorize/deauthorize
- Persists session to AsyncStorage
- Auto-retry on auth expiration

**Custom Hooks:**
```typescript
const connection = useConnection();          // Access RPC connection
const { authorization } = useAuthorization(); // Access wallet state
const wallet = useMWAWallet();               // Wallet adapter for signing
```

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed architecture documentation.

## 📚 Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Detailed architecture overview
- [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) - Migration patterns and examples
- [MIGRATION_COMPLETE.md](./MIGRATION_COMPLETE.md) - Change log from refactoring
- [WEB3_INTEGRATION.md](./WEB3_INTEGRATION.md) - Solana integration guide
- [frontend/README.md](./frontend/README.md) - Frontend-specific documentation (coming soon)
- [backend/README.md](../backend/README.md) - Backend-specific documentation (coming soon)

## 🔐 Security Considerations

1. **Wallet Security:** Users maintain custody of their funds via self-custody wallets
2. **Auth Tokens:** MWA auth tokens stored securely in AsyncStorage
3. **Transaction Verification:** Backend verifies all transaction signatures on-chain
4. **No Private Keys:** App never has access to user's private keys

## 🧪 Testing

```bash
# Run linter
npm run lint

# Type check
npx tsc --noEmit
```

## 🚢 Deployment

1. **Build for production:**
   ```bash
   # Android
   eas build --platform android --profile production

   # iOS
   eas build --platform ios --profile production
   ```

2. **Submit to stores:**
   ```bash
   eas submit --platform android
   eas submit --platform ios
   ```

## 🤝 Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution guidelines.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [Solana Mobile](https://solanamobile.com/) - Mobile Wallet Adapter
- [Expo](https://expo.dev/) - React Native framework
- [Splitwise](https://www.splitwise.com/) - Design inspiration

---

**Built with ⚡ by the Settle team**
