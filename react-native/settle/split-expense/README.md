# SplitExpense 💰

A modern expense splitting app built with React Native and Expo, inspired by Splitwise. Track shared expenses, manage groups, and settle debts with friends and family.

## Features ✨

- **Authentication**: Login and signup with email/password
- **Groups Management**: Create and manage expense groups (trips, home, couple, etc.)
- **Friends**: Add and manage friends for expense splitting
- **Expense Tracking**: Add expenses with multiple split methods
- **Activity Feed**: Track all your expense-related activities
- **Profile Management**: Update profile and settings
- **Modern UI**: Clean, intuitive interface with dark/light mode support

## Tech Stack 🛠️

- **React Native** with **Expo** for cross-platform development
- **TypeScript** for type safety
- **Expo Router** for navigation
- **React Native Reanimated** for smooth animations
- **Expo Image Picker** for profile photos
- **React Navigation** for tab and stack navigation

## Getting Started 🚀

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the development server**
   ```bash
   npx expo start
   ```

3. **Run on your preferred platform**
   - **Web**: Press `w` in the terminal or scan the QR code
   - **iOS**: Press `i` in the terminal (requires iOS Simulator)
   - **Android**: Press `a` in the terminal (requires Android emulator)

## Project Structure 📁

```
app/
├── (tabs)/           # Tab navigation screens
│   ├── groups.tsx    # Groups management
│   ├── friends.tsx   # Friends management
│   ├── activity.tsx  # Activity feed
│   └── account.tsx   # User profile
├── login.tsx         # Login screen
├── signup.tsx        # Signup screen
├── signin.tsx        # Sign in screen
└── _layout.tsx       # Root layout

components/
├── ui/               # Reusable UI components
├── AddExpenseButton.tsx  # Floating action button
└── TabLayoutWrapper.tsx  # Tab layout wrapper

constants/
└── theme.ts          # App theme and colors
```

## Key Components 🧩

- **AddExpenseButton**: Floating action button for adding new expenses
- **TabLayoutWrapper**: Wrapper component for tab screens
- **IconSymbol**: Custom icon component for consistent iconography
- **Themed Components**: Color scheme aware components

## Development Notes 📝

- The app uses a Splitwise-inspired design with a teal color scheme (#1CC29F)
- All screens are fully responsive and support both light and dark modes
- Mock data is used for demonstration purposes
- The Android build may require additional setup for native dependencies

## Contributing 🤝

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test on multiple platforms
5. Submit a pull request

## License 📄

This project is open source and available under the [MIT License](LICENSE).