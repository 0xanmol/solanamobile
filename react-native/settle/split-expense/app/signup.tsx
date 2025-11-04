import { Colors } from '@/constants/colors';
import { styles } from '@/styles/signup.styles';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { completeProfile } from '@/apis/auth';
import Toast from 'react-native-toast-message';

export default function SignupScreen() {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [nameError, setNameError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDone = async () => {
    if (!fullName.trim()) {
      setNameError(true);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await completeProfile({
        name: fullName.trim(),
        phone: phoneNumber.trim() || undefined,
      });

      if (response.success) {
        Toast.show({
          type: 'success',
          text1: 'Profile Complete!',
          text2: 'Welcome to Settle',
        });
        setTimeout(() => router.replace('/(tabs)/groups'), 500);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: response.message || 'Failed to complete profile',
        });
      }
    } catch (error: any) {
      console.error('Complete profile error:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to complete profile. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
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
            <MaterialIcons name="chevron-left" size={28} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.formSection}>
            {/* Title */}
            <View style={styles.titleSection}>
              <Text style={styles.title}>Complete Your Profile</Text>
              <Text style={styles.subtitle}>Tell us a bit about yourself</Text>
            </View>

            {/* Full Name */}
            <View style={styles.inputContainer}>
              <View style={[styles.inputWrapper, nameError && styles.inputWrapperError]}>
                <Text style={[styles.floatingLabel, nameError && styles.floatingLabelError]}>Full name</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder=""
                  value={fullName}
                  onChangeText={(text) => {
                    setFullName(text);
                    setNameError(false);
                  }}
                  autoCorrect={false}
                  editable={!isSubmitting}
                />
                {nameError && (
                  <View style={styles.errorIcon}>
                    <MaterialIcons name="error" size={20} color={Colors.error} />
                  </View>
                )}
              </View>
              {nameError && (
                <Text style={styles.errorText}>You must enter a name</Text>
              )}
            </View>

            {/* Phone Number (Optional) */}
            <View style={styles.inputContainer}>
              <View style={styles.phoneRow}>
                <TouchableOpacity style={styles.countryPicker} disabled>
                  <View style={styles.flagContainer}>
                    <View style={styles.flag}>
                      <View style={styles.flagOrange} />
                      <View style={styles.flagWhite} />
                      <View style={styles.flagGreen} />
                    </View>
                  </View>
                  <Text style={styles.countryCode}>+91</Text>
                  <MaterialIcons name="keyboard-arrow-down" size={14} color={Colors.textSecondary} />
                </TouchableOpacity>
                <View style={[styles.inputWrapper, styles.phoneInputWrapper]}>
                  <Text style={styles.floatingLabel}>Phone number (optional)</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder=""
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    keyboardType="phone-pad"
                    editable={!isSubmitting}
                  />
                </View>
              </View>
            </View>

            {/* Info Text */}
            <View style={styles.infoContainer}>
              <MaterialIcons name="info-outline" size={16} color={Colors.textTertiary} />
              <Text style={styles.infoText}>
                Your phone number helps friends find you on Settle
              </Text>
            </View>

            {/* Done Button */}
            <TouchableOpacity
              style={[styles.doneButton, isSubmitting && styles.doneButtonDisabled]}
              onPress={handleDone}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color={Colors.white} />
              ) : (
                <Text style={styles.doneButtonText}>Complete Profile</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
