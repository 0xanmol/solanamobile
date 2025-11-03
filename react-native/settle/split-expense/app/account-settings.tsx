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
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AccountSettingsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [isFriendSuggestionEnabled, setIsFriendSuggestionEnabled] = useState(true);

  const handleSaveChanges = () => {
    Alert.alert('Success', 'Your changes have been saved!');
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive' },
      ]
    );
  };

  const handleManageBlocklist = () => {
    Alert.alert('Blocklist', 'Manage your blocked users');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Account settings</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Account Information Section */}
        <View style={styles.section}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Full name</Text>
            <View style={styles.valueContainer}>
              <Text style={styles.value}>Saurav Meghwal</Text>
              <TouchableOpacity style={styles.editButton}>
                <MaterialIcons name="edit" size={16} color="#007AFF" />
                <Text style={styles.editText}>Edit</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Email address</Text>
            <View style={styles.valueContainer}>
              <Text style={styles.value}>sauravmeghwal11@gmail.com</Text>
              <TouchableOpacity style={styles.editButton}>
                <MaterialIcons name="edit" size={16} color="#007AFF" />
                <Text style={styles.editText}>Edit</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Phone number</Text>
            <View style={styles.valueContainer}>
              <Text style={styles.value}>None</Text>
              <TouchableOpacity style={styles.editButton}>
                <MaterialIcons name="edit" size={16} color="#007AFF" />
                <Text style={styles.editText}>Edit</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.valueContainer}>
              <Text style={styles.value}>••••••••</Text>
              <TouchableOpacity style={styles.editButton}>
                <MaterialIcons name="edit" size={16} color="#007AFF" />
                <Text style={styles.editText}>Edit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          <View style={styles.dropdownRow}>
            <Text style={styles.label}>Time zone</Text>
            <TouchableOpacity style={styles.dropdown}>
              <Text style={styles.dropdownText}>(GMT+05:30) Chennai</Text>
              <MaterialIcons name="keyboard-arrow-down" size={20} color="#666666" />
            </TouchableOpacity>
          </View>

          <View style={styles.dropdownRow}>
            <Text style={styles.label}>Default currency</Text>
            <TouchableOpacity style={styles.dropdown}>
              <Text style={styles.dropdownText}>USD</Text>
              <MaterialIcons name="keyboard-arrow-down" size={20} color="#666666" />
            </TouchableOpacity>
          </View>

          <View style={styles.dropdownRow}>
            <Text style={styles.label}>Language (for emails and notifications)</Text>
            <TouchableOpacity style={styles.dropdown}>
              <Text style={styles.dropdownText}>English</Text>
              <MaterialIcons name="keyboard-arrow-down" size={20} color="#666666" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/email-settings')}>
            <View style={styles.menuItemLeft}>
              <MaterialIcons name="mail-outline" size={24} color="#374151" />
              <Text style={styles.menuItemText}>Email settings</Text>
            </View>
            <MaterialIcons name="chevron-right" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/security')}>
            <View style={styles.menuItemLeft}>
              <MaterialIcons name="lock-outline" size={24} color="#374151" />
              <Text style={styles.menuItemText}>Security</Text>
            </View>
            <MaterialIcons name="chevron-right" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* Privacy Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy settings</Text>
          
          <TouchableOpacity 
            style={styles.checkboxRow}
            onPress={() => setIsFriendSuggestionEnabled(!isFriendSuggestionEnabled)}
          >
            <View style={styles.checkboxContainer}>
              <View style={[
                styles.checkbox,
                isFriendSuggestionEnabled && styles.checkboxChecked
              ]}>
                {isFriendSuggestionEnabled && (
                  <MaterialIcons name="check" size={16} color="#FFFFFF" />
                )}
              </View>
            </View>
            <View style={styles.checkboxTextContainer}>
              <Text style={styles.checkboxText}>
                Allow Splitwise to suggest me as a friend to other users
              </Text>
              <Text style={styles.checkboxSubtext}>
                Splitwise will only recommend you to users who already have your email address or phone number in their phone's contact book
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Save Changes Button */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
          <Text style={styles.saveButtonText}>Save changes</Text>
        </TouchableOpacity>

        {/* Advanced Features Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Advanced features</Text>
          
          <View style={styles.advancedRow}>
            <Text style={styles.advancedLabel}>Block other users</Text>
            <TouchableOpacity style={styles.advancedButton} onPress={handleManageBlocklist}>
              <Text style={styles.advancedButtonText}>Manage your blocklist</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.advancedRow}>
            <Text style={styles.advancedLabel}>Your account</Text>
            <TouchableOpacity style={styles.advancedButton} onPress={handleDeleteAccount}>
              <Text style={styles.advancedButtonText}>Delete your account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
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
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Montserrat_600SemiBold',
    color: '#000000',
  },
  headerSpacer: {
    width: 32,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    paddingVertical: 16,
  },
  infoRow: {
    marginBottom: 16,
  },
  label: {
    fontSize: 15,
    fontFamily: 'Poppins_500Medium',
    color: '#1F2937',
    marginBottom: 6,
  },
  valueContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  value: {
    fontSize: 15,
    fontFamily: 'Poppins_500Medium',
    color: '#1F2937',
    flex: 1,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  editText: {
    fontSize: 15,
    fontFamily: 'Poppins_500Medium',
    color: '#007AFF',
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Poppins_500Medium',
    color: '#1F2937',
    marginBottom: 16,
  },
  dropdownRow: {
    marginBottom: 16,
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  dropdownText: {
    fontSize: 15,
    fontFamily: 'Poppins_400Regular',
    color: '#1F2937',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkboxContainer: {
    marginRight: 12,
    marginTop: 2,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
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
  checkboxTextContainer: {
    flex: 1,
  },
  checkboxText: {
    fontSize: 15,
    fontFamily: 'Poppins_500Medium',
    color: '#1F2937',
    marginBottom: 4,
  },
  checkboxSubtext: {
    fontSize: 14,
    fontFamily: 'Montserrat_400Regular',
    color: '#6B7280',
    lineHeight: 20,
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
  advancedRow: {
    marginBottom: 16,
  },
  advancedLabel: {
    fontSize: 15,
    fontFamily: 'Poppins_500Medium',
    color: '#1F2937',
    marginBottom: 6,
  },
  advancedButton: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  advancedButtonText: {
    fontSize: 15,
    fontFamily: 'Poppins_500Medium',
    color: '#1F2937',
  },
  menuItem: {
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
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  menuItemText: {
    fontSize: 15,
    fontFamily: 'Poppins_500Medium',
    color: '#1F2937',
  },
});
