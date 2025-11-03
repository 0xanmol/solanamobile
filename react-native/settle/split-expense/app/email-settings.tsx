import TabLayoutWrapper from '@/components/TabLayoutWrapper';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EmailSettingsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  // Simplified email notification states
  const [emailSettings, setEmailSettings] = useState({
    expenseNotifications: true,
    paymentNotifications: true,
    groupNotifications: true,
  });

  const handleBackPress = () => {
    router.back();
  };

  const toggleSetting = (key: keyof typeof emailSettings) => {
    setEmailSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSaveChanges = () => {
    Alert.alert('Success', 'Your email settings have been saved!');
  };

  const renderCheckbox = (isChecked: boolean) => (
    <View style={[
      styles.checkbox,
      isChecked && styles.checkboxChecked
    ]}>
      {isChecked && (
        <MaterialIcons name="check" size={16} color="#FFFFFF" />
      )}
    </View>
  );

  return (
    <TabLayoutWrapper>
      <SafeAreaView style={styles.container} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color="#000000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Email settings</Text>
          <View style={styles.headerRightPlaceholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Notifications Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>EMAIL NOTIFICATIONS</Text>

            <TouchableOpacity
              style={styles.optionRow}
              onPress={() => toggleSetting('groupNotifications')}
            >
              <View style={styles.optionTextContainer}>
                <Text style={styles.optionText}>Group notifications</Text>
                <Text style={styles.optionSubtext}>When you're added to groups or friends</Text>
              </View>
              {renderCheckbox(emailSettings.groupNotifications)}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionRow}
              onPress={() => toggleSetting('expenseNotifications')}
            >
              <View style={styles.optionTextContainer}>
                <Text style={styles.optionText}>Expense notifications</Text>
                <Text style={styles.optionSubtext}>When expenses are added or edited</Text>
              </View>
              {renderCheckbox(emailSettings.expenseNotifications)}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionRow}
              onPress={() => toggleSetting('paymentNotifications')}
            >
              <View style={styles.optionTextContainer}>
                <Text style={styles.optionText}>Payment notifications</Text>
                <Text style={styles.optionSubtext}>When someone pays you</Text>
              </View>
              {renderCheckbox(emailSettings.paymentNotifications)}
            </TouchableOpacity>
          </View>

          {/* Save Changes Button */}
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
            <Text style={styles.saveButtonText}>Save changes</Text>
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
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    padding: 6,
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: 'Montserrat_600SemiBold',
    color: '#000000',
  },
  headerRightPlaceholder: {
    width: 36,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: 'Montserrat_500Medium',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 0,
    backgroundColor: '#FFFFFF',
  },
  optionTextContainer: {
    flex: 1,
    marginRight: 12,
  },
  optionText: {
    fontSize: 15,
    fontFamily: 'Poppins_500Medium',
    color: '#1F2937',
  },
  optionSubtext: {
    fontSize: 13,
    fontFamily: 'Montserrat_400Regular',
    color: '#6B7280',
    marginTop: 2,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 3,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  saveButton: {
    backgroundColor: '#FF6B35',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignItems: 'center',
    marginVertical: 20,
    alignSelf: 'center',
    minWidth: 160,
  },
  saveButtonText: {
    fontSize: 15,
    fontFamily: 'Poppins_500Medium',
    color: '#FFFFFF',
  },
  bottomSpacer: {
    height: 20,
  },
});
