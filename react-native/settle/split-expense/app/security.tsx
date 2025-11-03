import TabLayoutWrapper from '@/components/TabLayoutWrapper';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SecurityScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);
  const [timeout, setTimeout] = useState('5 seconds');

  const handleBackPress = () => {
    router.back();
  };

  const toggleBiometrics = () => {
    setBiometricsEnabled(previousState => !previousState);
  };

  const handleTimeoutPress = () => {
    console.log('Open timeout selection');
  };

  return (
    <TabLayoutWrapper>
      <SafeAreaView style={styles.container} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color="#000000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Security</Text>
          <View style={styles.headerRightPlaceholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Authenticate with biometrics */}
          <View style={styles.optionRow}>
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionTitle}>
                Authenticate with biometrics
              </Text>
              <Text style={styles.optionDescription}>
                Require device passcode or biometrics to open Splitwise
              </Text>
            </View>
            <Switch
              trackColor={{ false: '#D1D5DB', true: '#8B5CF6' }}
              thumbColor={biometricsEnabled ? '#FFFFFF' : '#FFFFFF'}
              ios_backgroundColor="#D1D5DB"
              onValueChange={toggleBiometrics}
              value={biometricsEnabled}
            />
          </View>

          {/* Timeout */}
          <TouchableOpacity style={styles.optionRow} onPress={handleTimeoutPress}>
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionTitle}>Timeout</Text>
              <Text style={styles.optionDescription}>
                Authentication will not be required if the app is reopened before the timeout expires.
              </Text>
            </View>
            <View style={styles.timeoutValueContainer}>
              <Text style={styles.timeoutValue}>{timeout}</Text>
              <MaterialIcons name="keyboard-arrow-down" size={20} color="#666666" />
            </View>
          </TouchableOpacity>

          {/* Bottom Spacing */}
          <View style={styles.bottomSpacer} />
        </ScrollView>
      </SafeAreaView>
    </TabLayoutWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    padding: 6,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Montserrat_600SemiBold',
    color: '#000000',
  },
  headerRightPlaceholder: {
    width: 36,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  optionTextContainer: {
    flex: 1,
    marginRight: 12,
  },
  optionTitle: {
    fontSize: 16,
    fontFamily: 'Poppins_500Medium',
    color: '#1F2937',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    fontFamily: 'Montserrat_400Regular',
    color: '#6B7280',
    lineHeight: 20,
  },
  timeoutValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeoutValue: {
    fontSize: 16,
    fontFamily: 'Poppins_500Medium',
    color: '#1F2937',
  },
  bottomSpacer: {
    height: 20,
  },
});
