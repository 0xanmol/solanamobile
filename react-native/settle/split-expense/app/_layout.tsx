// IMPORTANT: Must be imported before @solana/web3.js to provide crypto.getRandomValues()
import 'react-native-get-random-values';

import { Montserrat_400Regular, Montserrat_500Medium, Montserrat_600SemiBold, Montserrat_700Bold, useFonts as useMontserrat } from '@expo-google-fonts/montserrat';
import { Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold, useFonts as usePoppins } from '@expo-google-fonts/poppins';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Text as RNText, TextInput as RNTextInput } from 'react-native';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: 'login',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [pLoaded] = usePoppins({ Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold });
  const [mLoaded] = useMontserrat({ Montserrat_400Regular, Montserrat_500Medium, Montserrat_600SemiBold, Montserrat_700Bold });

  if (!pLoaded || !mLoaded) {
    return null;
  }

  // Set global default fonts
  if (!RNText.defaultProps) RNText.defaultProps = {};
  RNText.defaultProps.style = [RNText.defaultProps.style, { fontFamily: 'Poppins_400Regular' }];
  if (!RNTextInput.defaultProps) RNTextInput.defaultProps = {} as any;
  RNTextInput.defaultProps.style = [RNTextInput.defaultProps.style, { fontFamily: 'Poppins_400Regular' }];

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="signup" options={{ headerShown: false }} />
        <Stack.Screen name="signin" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="create-group" options={{ headerShown: false }} />
        <Stack.Screen name="add-expense" options={{ headerShown: false }} />
        <Stack.Screen name="adjust-split" options={{ headerShown: false }} />
        <Stack.Screen name="add-friends" options={{ headerShown: false, presentation: 'modal' }} />
        <Stack.Screen name="group-detail/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="group-settings" options={{ headerShown: false }} />
        <Stack.Screen name="invite-link" options={{ headerShown: false }} />
        <Stack.Screen name="balances" options={{ headerShown: false }} />
        <Stack.Screen name="account-settings" options={{ headerShown: false }} />
        <Stack.Screen name="security" options={{ headerShown: false }} />
        <Stack.Screen name="email-settings" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
