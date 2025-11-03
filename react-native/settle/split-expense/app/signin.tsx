import { Colors } from '@/constants/colors';
import { BorderRadius, Shadow, Spacing } from '@/constants/spacing';
import { FontFamily, FontSize } from '@/constants/typography';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SigninScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  

  const handleLogin = () => {
    router.replace('/(tabs)/groups');
  };

  const handleBack = () => {
    router.push('/login');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        {/* Header with back button */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <MaterialIcons name="chevron-left" size={28} color="#1CC29F" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Log in</Text>
          <View style={{ width: 44 }} />
        </View>

        <View style={styles.content}>
          <View style={styles.formSection}>
            {/* Email Address */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email address</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* Password */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity 
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <MaterialIcons 
                  name={showPassword ? "visibility" : "visibility-off"} 
                  size={20} 
                  color={Colors.textTertiary} 
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Forgot Password */}
          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot password?</Text>
          </TouchableOpacity>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
          >
            <Text style={styles.loginButtonText}>Log in</Text>
          </TouchableOpacity>

        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.slate50,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: Colors.textPrimary,
    fontFamily: FontFamily.montserratBold,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing['2xl'],
    paddingTop: Spacing.lg,
    backgroundColor: Colors.white,
    justifyContent: 'space-between',
  },
  formSection: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: Spacing.sm,
  },
  label: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: 6,
    fontWeight: '600',
    fontFamily: FontFamily.poppinsSemiBold,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.gray300,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.sm,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    backgroundColor: Colors.white,
    fontFamily: FontFamily.poppinsRegular,
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    borderWidth: 1,
    borderColor: Colors.gray300,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.sm,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    backgroundColor: Colors.white,
    paddingRight: 40,
    fontFamily: FontFamily.poppinsRegular,
  },
  eyeIcon: {
    position: 'absolute',
    right: Spacing.sm,
    top: Spacing.sm,
    padding: 2,
  },
  forgotPassword: {
    alignItems: 'flex-end',
    marginBottom: Spacing['2xl'],
    marginTop: -4,
  },
  forgotPasswordText: {
    color: Colors.primary,
    fontSize: FontSize.sm,
    fontWeight: '600',
    fontFamily: FontFamily.poppinsSemiBold,
  },
  loginButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    marginBottom: Spacing.md,
    ...Shadow.base,
  },
  loginButtonText: {
    color: Colors.white,
    fontSize: FontSize.md,
    fontWeight: '700',
    letterSpacing: 0.2,
    fontFamily: FontFamily.poppinsBold,
  },
});
