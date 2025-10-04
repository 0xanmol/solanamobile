# Splash Screen Feature

This feature provides a structured loading screen that displays when the app starts.

## Structure

```
lib/features/splash/
├── presentation/
│   ├── splash_screen.dart      # Main splash screen widget
│   └── splash_notifier.dart    # State management for splash logic
├── splash.dart                 # Barrel file for clean imports
└── README.md                   # This documentation
```

## Features

- **Animated Logo**: Circular gradient container with coin icon that scales in
- **App Name**: "Coin Toss" displayed with fade-in animation
- **Loading Indicator**: Circular progress indicator with "Loading..." text
- **State Management**: Uses Riverpod for managing splash state
- **Navigation**: Automatically navigates to login screen after loading

## Usage

The splash screen is automatically shown when the app starts (defined in `app.dart`). It runs for approximately 2 seconds before navigating to the login screen.

## Customization

- Modify `SplashNotifier.startSplash()` to add actual initialization logic
- Update `_navigateToNextScreen()` to change the destination screen
- Adjust animation durations in `_setupAnimations()`
- Customize the logo, colors, and styling in the `build()` method
