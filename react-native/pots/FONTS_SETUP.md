# IBM Plex Fonts Setup

This application uses **IBM Plex Sans** (for headings and body text) and **IBM Plex Mono** (for numbers/monospace text).

## Current Status

⚠️ **Fonts are currently commented out** - The app will use system fonts until IBM Plex fonts are added.

## Required Font Files

Place the following font files in `assets/fonts/`:

- `IBMPlexSans-Regular.ttf`
- `IBMPlexSans-Medium.ttf`
- `IBMPlexSans-SemiBold.ttf`
- `IBMPlexSans-Bold.ttf`
- `IBMPlexMono-Regular.ttf`
- `IBMPlexMono-Medium.ttf`
- `IBMPlexMono-SemiBold.ttf`

## Download

Download IBM Plex fonts from:
- **GitHub**: https://github.com/IBM/plex/releases
- **Google Fonts**: 
  - https://fonts.google.com/specimen/IBM+Plex+Sans
  - https://fonts.google.com/specimen/IBM+Plex+Mono

After downloading, extract the `.ttf` files from the `fonts/` directory and place them in `assets/fonts/`.

## Enable Fonts

Once the font files are added:

1. **Uncomment font loading** in `app/_layout.tsx`:
   ```typescript
   const [loaded] = useFonts({
     IBMPlexSans: require('../assets/fonts/IBMPlexSans-Regular.ttf'),
     'IBMPlexSans-Medium': require('../assets/fonts/IBMPlexSans-Medium.ttf'),
     'IBMPlexSans-SemiBold': require('../assets/fonts/IBMPlexSans-SemiBold.ttf'),
     'IBMPlexSans-Bold': require('../assets/fonts/IBMPlexSans-Bold.ttf'),
     IBMPlexMono: require('../assets/fonts/IBMPlexMono-Regular.ttf'),
     'IBMPlexMono-Medium': require('../assets/fonts/IBMPlexMono-Medium.ttf'),
     'IBMPlexMono-SemiBold': require('../assets/fonts/IBMPlexMono-SemiBold.ttf'),
   })
   ```

2. **Update `constants/fonts.ts`**:
   ```typescript
   const hasIBMPlexSans = true
   const hasIBMPlexMono = true
   ```

3. **Remove the SpaceMono fallback** from `app/_layout.tsx` if desired.

## Font Usage

- **Headings**: IBM Plex Sans (Bold/SemiBold)
- **Body Text**: IBM Plex Sans (Regular/Medium)
- **Numbers/Monospace**: IBM Plex Mono (for addresses, codes, etc.)

All font references are centralized in `constants/fonts.ts`.
