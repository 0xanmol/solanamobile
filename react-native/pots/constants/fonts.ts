/**
 * IBM Plex Sans (Headings) + IBM Plex Sans / IBM Plex Mono (Body/Numbers)
 * 
 * Font families used throughout the application:
 * - Headings: IBM Plex Sans (falls back to system font if not loaded)
 * - Body text: IBM Plex Sans (falls back to system font if not loaded)
 * - Numbers/Monospace: IBM Plex Mono (falls back to SpaceMono or system monospace)
 * 
 * NOTE: Once IBM Plex font files are added to assets/fonts/, uncomment the font loading
 * in app/_layout.tsx and update these constants to use the actual font names.
 */

// Check if fonts are loaded by trying to use them, fallback to system fonts
const hasIBMPlexSans = false // Set to true once fonts are loaded in _layout.tsx
const hasIBMPlexMono = false // Set to true once fonts are loaded in _layout.tsx

export const Fonts = {
  heading: hasIBMPlexSans ? 'IBMPlexSans' : undefined, // undefined = system default
  body: hasIBMPlexSans ? 'IBMPlexSans' : undefined,
  mono: hasIBMPlexMono ? 'IBMPlexMono' : 'SpaceMono', // Fallback to SpaceMono for now
} as const

// Font weight variants - use these with fontWeight when fonts are loaded
export const FontWeights = {
  regular: hasIBMPlexSans ? 'IBMPlexSans' : undefined,
  medium: hasIBMPlexSans ? 'IBMPlexSans-Medium' : undefined,
  semiBold: hasIBMPlexSans ? 'IBMPlexSans-SemiBold' : undefined,
  bold: hasIBMPlexSans ? 'IBMPlexSans-Bold' : undefined,
  monoRegular: hasIBMPlexMono ? 'IBMPlexMono' : 'SpaceMono',
  monoMedium: hasIBMPlexMono ? 'IBMPlexMono-Medium' : 'SpaceMono',
  monoSemiBold: hasIBMPlexMono ? 'IBMPlexMono-SemiBold' : 'SpaceMono',
} as const

export type FontFamily = typeof Fonts[keyof typeof Fonts]

