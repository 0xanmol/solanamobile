import { Colors } from '@/constants/colors';
import { BorderRadius, Shadow, Spacing } from '@/constants/spacing';
import { FontFamily, FontSize } from '@/constants/typography';
import { router } from 'expo-router';
import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {

  const handleSignup = () => {
    router.push('/signup');
  };

  const handleLogin = () => {
    router.push('/signin');
  };

  const handleGoogleSignin = () => {
    router.replace('/(tabs)/groups');
  };

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
          <Text style={styles.appName}>Splitwise</Text>
        </View>

        {/* Buttons Section */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.signupButton}
            onPress={handleSignup}
            activeOpacity={0.8}
          >
            <Text style={styles.signupButtonText}>Sign up</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
            activeOpacity={0.8}
          >
            <Text style={styles.loginButtonText}>Log in</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.googleButton}
            onPress={handleGoogleSignin}
            activeOpacity={0.8}
          >
            <View style={styles.googleIconWrapper}>
              <Text style={styles.googleG}>G</Text>
            </View>
            <Text style={styles.googleButtonText}>Sign in with Google</Text>
          </TouchableOpacity>

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
  buttonsContainer: {
    gap: Spacing.sm,
    paddingBottom: Spacing.md,
  },
  signupButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    ...Shadow.base,
  },
  signupButtonText: {
    color: Colors.white,
    fontSize: FontSize.lg,
    fontWeight: '600',
    letterSpacing: 0.2,
    fontFamily: FontFamily.poppinsSemiBold,
  },
  loginButton: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.border,
    ...Shadow.sm,
  },
  loginButtonText: {
    color: Colors.textSecondary,
    fontSize: FontSize.lg,
    fontWeight: '500',
    fontFamily: FontFamily.poppinsMedium,
  },
  googleButton: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.sm,
    borderWidth: 1.5,
    borderColor: Colors.border,
    ...Shadow.sm,
  },
  googleIconWrapper: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#4285F4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  googleG: {
    color: Colors.white,
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  googleButtonText: {
    color: Colors.textSecondary,
    fontSize: FontSize.lg,
    fontWeight: '500',
    fontFamily: FontFamily.poppinsMedium,
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
