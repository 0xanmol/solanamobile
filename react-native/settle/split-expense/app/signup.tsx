import { Colors } from '@/constants/colors';
import { styles } from '@/styles/signup.styles';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SignupScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const handleDone = () => {
    if (!fullName) {
      setNameError(true);
      return;
    }
    router.replace('/(tabs)/groups');
  };

  const handleBack = () => {
    router.push('/login');
  };

  const pickImage = async () => {
    // Request permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Sorry, we need camera roll permissions to upload a photo.');
      return;
    }

    // Show action sheet
    Alert.alert(
      'Select Photo',
      'Choose how you want to add your profile photo',
      [
        {
          text: 'Camera',
          onPress: () => openCamera(),
        },
        {
          text: 'Photo Library',
          onPress: () => openImageLibrary(),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Sorry, we need camera permissions to take a photo.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const openImageLibrary = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setProfileImage(result.assets[0].uri);
    }
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

          {/* Full Name and Photo in same row */}
          <View style={styles.namePhotoRow}>
            <View style={styles.nameInputContainer}>
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
            
            <TouchableOpacity style={styles.photoButtonInline} activeOpacity={0.7} onPress={pickImage}>
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.profileImageInline} />
              ) : (
                <View style={styles.placeholderContainer}>
                  <Text style={styles.placeholderText}>📷</Text>
                </View>
              )}
              <View style={styles.photoButtonPlusIcon}>
                <MaterialIcons name="add" size={10} color={Colors.white} />
              </View>
            </TouchableOpacity>
          </View>

          {/* Email Address */}
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Text style={styles.floatingLabel}>Email address</Text>
              <TextInput
                style={styles.textInput}
                placeholder=""
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          {/* Password */}
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Text style={styles.floatingLabel}>Password</Text>
              <TextInput
                style={styles.textInput}
                placeholder=""
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
            <Text style={styles.helperText}>Minimum 8 characters</Text>
          </View>

          {/* Phone Number */}
          <View style={styles.inputContainer}>
            <View style={styles.phoneRow}>
              <TouchableOpacity style={styles.countryPicker}>
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
                <Text style={styles.floatingLabel}>Phone number</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder=""
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  keyboardType="phone-pad"
                />
              </View>
            </View>
          </View>

          {/* Currency Selection */}
          <View style={styles.currencyContainer}>
            <Text style={styles.currencyText}>I use </Text>
            <TouchableOpacity>
              <Text style={styles.currencyValue}>AUD ($)</Text>
            </TouchableOpacity>
            <Text style={styles.currencyText}> as my currency. </Text>
            <TouchableOpacity>
              <Text style={styles.changeButton}>Change »</Text>
            </TouchableOpacity>
          </View>

          {/* Terms and Conditions */}
          <View style={styles.termsContainer}>
            <Text style={styles.termsText}>
              By signing up, you accept the Splitwise{' '}
            </Text>
            <TouchableOpacity>
              <Text style={styles.termsLink}>Terms of Service</Text>
            </TouchableOpacity>
            <Text style={styles.termsText}> and </Text>
            <TouchableOpacity>
              <Text style={styles.termsLink}>Privacy Policy</Text>
            </TouchableOpacity>
            <Text style={styles.termsText}>.</Text>
          </View>

          {/* Done Button */}
          <TouchableOpacity
            style={styles.doneButton}
            onPress={handleDone}
          >
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>

        </View>
      </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

