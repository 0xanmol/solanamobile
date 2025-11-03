// Typography constants
export const FontFamily = {
  // Poppins
  poppinsRegular: 'Poppins_400Regular',
  poppinsMedium: 'Poppins_500Medium',
  poppinsSemiBold: 'Poppins_600SemiBold',
  poppinsBold: 'Poppins_700Bold',
  
  // Montserrat
  montserratRegular: 'Montserrat_400Regular',
  montserratMedium: 'Montserrat_500Medium',
  montserratSemiBold: 'Montserrat_600SemiBold',
  montserratBold: 'Montserrat_700Bold',
} as const;

export const FontSize = {
  // Extra small
  xs: 11,
  // Small
  sm: 12,
  // Base
  base: 14,
  // Medium
  md: 15,
  // Large
  lg: 16,
  // Extra large
  xl: 18,
  // 2xl
  '2xl': 20,
  // 3xl
  '3xl': 24,
  // 4xl
  '4xl': 28,
  // 5xl
  '5xl': 36,
} as const;

export const LineHeight = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.75,
  loose: 2,
} as const;

export const LetterSpacing = {
  tighter: -0.5,
  tight: -0.3,
  normal: 0,
  wide: 0.2,
  wider: 0.3,
  widest: 0.5,
} as const;

