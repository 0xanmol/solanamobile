import { Colors } from '@/constants/colors';
import { BorderRadius, Shadow, Spacing } from '@/constants/spacing';
import { FontFamily, FontSize } from '@/constants/typography';
import { router } from 'expo-router';
import React, { useState, useEffect } from 'react';
import {
    ActivityIndicator,
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { connectWallet, storeWalletAuth, getStoredWalletAuth, clearWalletAuth } from '@/apis/auth';
import { authorizeWallet, reauthorizeWallet } from '@/services/wallet';

export default function LoginScreen() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(false); // Disabled for now

  // Check for cached wallet session on mount
  // Temporarily disabled - enable after testing basic wallet connection
  useEffect(() => {
    // checkCachedSession();
    setIsCheckingSession(false);
  }, []);

  const checkCachedSession = async () => {
    try {
      const cachedAuth = await getStoredWalletAuth();

      if (cachedAuth) {
        console.log('Found cached wallet session, attempting reauthorization...');

        try {
          // Add timeout to prevent infinite loading
          const reauthorizePromise = reauthorizeWallet(cachedAuth.authToken);
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Reauthorization timeout')), 5000)
          );

          const walletAuth = await Promise.race([reauthorizePromise, timeoutPromise]) as any;
          console.log('Reauthorization successful:', { pubkey: walletAuth.pubkey });

          // Update stored auth with new token (token may have been refreshed)
          await storeWalletAuth(walletAuth.authToken, walletAuth.pubkey);

          // Connect to backend
          const response = await connectWallet(walletAuth.pubkey);

          if (response.success && response.data && !response.data.requiresProfileCompletion) {
            console.log('Session restored successfully');
            // Navigate directly to main app
            router.replace('/(tabs)/groups');
            return;
          }
        } catch (error) {
          console.log('Reauthorization failed, user needs to login again:', error);
          // Clear invalid cached auth
          await clearWalletAuth();
          // Fall through to show login screen
        }
      }
    } catch (error) {
      console.error('Session check error:', error);
    } finally {
      setIsCheckingSession(false);
    }
  };

  const handleConnectWallet = async () => {
    setIsConnecting(true);

    try {
      // Step 1: Authorize wallet using Mobile Wallet Adapter
      console.log('Requesting wallet authorization...');
      const walletAuth = await authorizeWallet();
      console.log('Wallet authorized:', { pubkey: walletAuth.pubkey });

      // Step 2: Store wallet auth credentials for session persistence
      await storeWalletAuth(walletAuth.authToken, walletAuth.pubkey);

      // Step 3: Connect to backend with the wallet pubkey
      const response = await connectWallet(walletAuth.pubkey);

      if (response.success && response.data) {
        console.log('Backend connection successful:', response.data);

        if (response.data.requiresProfileCompletion) {
          // New user - navigate to profile completion
          Alert.alert(
            'Welcome!',
            'Please complete your profile to continue.',
            [{ text: 'OK', onPress: () => router.push('/signup') }]
          );
        } else {
          // Existing user - navigate to main app
          Alert.alert(
            'Welcome back!',
            `Logged in as ${response.data.user.name || 'User'}`,
            [{ text: 'OK', onPress: () => router.replace('/(tabs)/groups') }]
          );
        }
      } else {
        Alert.alert('Connection Failed', response.message || 'Failed to connect to backend');
      }
    } catch (error: any) {
      console.error('Wallet connection error:', error);

      let errorMessage = 'Failed to connect wallet. Please try again.';

      // Provide more specific error messages
      if (error.message?.includes('user declined')) {
        errorMessage = 'Wallet authorization was cancelled.';
      } else if (error.message?.includes('no wallet')) {
        errorMessage = 'No wallet app found. Please install a Solana wallet.';
      }

      Alert.alert('Error', errorMessage);
    } finally {
      setIsConnecting(false);
    }
  };

  // Show loading screen while checking for cached session
  if (isCheckingSession) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={[styles.content, styles.loadingContainer]}>
          <ActivityIndicator size="large" color="#14F195" />
          <Text style={styles.loadingText}>Checking for saved session...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.content}>
        {/* Logo Section */}
        <View style={styles.logoContainer}>
          <View style={styles.logoWrapper}>
            {/* Splitwise Logo Recreation */}
            <View style={styles.logoSquare}>
              <View style={styles.logoTopHalf} />
              <View style={styles.logoBottomHalf}>
                <View style={styles.logoSShape}>
                  <View style={styles.sTop} />
                  <View style={styles.sBottom} />
                </View>
              </View>
            </View>
          </View>
          <Text style={styles.appName}>Settle</Text>
          <Text style={styles.appSubtitle}>Powered by Solana</Text>
        </View>

        {/* Buttons Section */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[styles.connectButton, isConnecting && styles.connectButtonDisabled]}
            onPress={handleConnectWallet}
            activeOpacity={0.8}
            disabled={isConnecting}
          >
            {isConnecting ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <>
                <View style={styles.walletIconWrapper}>
                  <Text style={styles.walletIcon}>◎</Text>
                </View>
                <Text style={styles.connectButtonText}>Connect Wallet</Text>
              </>
            )}
          </TouchableOpacity>

          <Text style={styles.testNote}>
            Connect with Phantom, Solflare, or any Solana wallet
          </Text>

          {/* Footer Links */}
          <View style={styles.footer}>
            <TouchableOpacity>
              <Text style={styles.footerLink}>Terms</Text>
            </TouchableOpacity>
            <Text style={styles.footerSeparator}> | </Text>
            <TouchableOpacity>
              <Text style={styles.footerLink}>Privacy Policy</Text>
            </TouchableOpacity>
            <Text style={styles.footerSeparator}> | </Text>
            <TouchableOpacity>
              <Text style={styles.footerLink}>Contact us</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.slate50,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing['2xl'],
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: Spacing['2xl'],
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.lg,
  },
  loadingText: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    fontFamily: FontFamily.poppinsRegular,
  },
  logoContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    marginTop: -20,
  },
  logoWrapper: {
    marginBottom: Spacing['2xl'],
    ...Shadow.base,
  },
  logoSquare: {
    width: 160,
    height: 160,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    backgroundColor: Colors.white,
  },
  logoTopHalf: {
    width: 160,
    height: 80,
    backgroundColor: '#5BC5A7',
  },
  logoBottomHalf: {
    width: 160,
    height: 80,
    backgroundColor: '#48535B',
    position: 'relative',
    overflow: 'hidden',
  },
  logoSShape: {
    position: 'absolute',
    width: 64,
    height: 64,
    left: 20,
    top: 8,
  },
  sTop: {
    width: 40,
    height: 32,
    backgroundColor: '#5BC5A7',
    borderRadius: 20,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  sBottom: {
    width: 40,
    height: 32,
    backgroundColor: '#5BC5A7',
    borderRadius: 20,
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  appName: {
    fontSize: FontSize['4xl'],
    fontWeight: '600',
    color: Colors.textPrimary,
    letterSpacing: -0.3,
    fontFamily: FontFamily.poppinsSemiBold,
  },
  appSubtitle: {
    fontSize: FontSize.md,
    color: Colors.textTertiary,
    marginTop: Spacing.xs,
    fontFamily: FontFamily.poppinsRegular,
  },
  buttonsContainer: {
    gap: Spacing.sm,
    paddingBottom: Spacing.md,
  },
  connectButton: {
    backgroundColor: '#14F195',
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.md,
    ...Shadow.md,
  },
  connectButtonDisabled: {
    opacity: 0.6,
  },
  walletIconWrapper: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  walletIcon: {
    color: Colors.white,
    fontSize: 20,
    fontWeight: '700',
  },
  connectButtonText: {
    color: '#1a1a2e',
    fontSize: FontSize.lg,
    fontWeight: '700',
    letterSpacing: 0.3,
    fontFamily: FontFamily.poppinsSemiBold,
  },
  testNote: {
    textAlign: 'center',
    color: Colors.textTertiary,
    fontSize: FontSize.sm,
    marginTop: Spacing.sm,
    fontFamily: FontFamily.poppinsRegular,
    fontStyle: 'italic',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing['2xl'],
    flexWrap: 'wrap',
  },
  footerLink: {
    color: Colors.textTertiary,
    fontSize: FontSize.sm,
    textDecorationLine: 'underline',
    fontFamily: FontFamily.poppinsRegular,
  },
  footerSeparator: {
    color: Colors.textTertiary,
    fontSize: FontSize.sm,
  },
});
