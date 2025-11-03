import TabLayoutWrapper from '@/components/TabLayoutWrapper';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function GroupSettingsScreen() {
  const router = useRouter();
  const [simplifyDebts, setSimplifyDebts] = useState(false);

  return (
    <TabLayoutWrapper>
      <SafeAreaView style={styles.container} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={24} color="#000000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Group settings</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Group Identifier Section */}
          <View style={styles.groupSection}>
            <View style={styles.groupInfo}>
              <View style={styles.groupIcon}>
                <MaterialIcons name="home" size={32} color="#FFFFFF" />
              </View>
              <View style={styles.groupDetails}>
                <Text style={styles.groupName}>Jje</Text>
                <Text style={styles.groupType}>Home</Text>
              </View>
              <TouchableOpacity style={styles.editButton} onPress={() => router.push('/create-group')}>
                <MaterialIcons name="edit" size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Group Members Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Group members</Text>
            
            <TouchableOpacity style={styles.optionRow} onPress={() => router.push('/add-friends')}>
              <MaterialIcons name="group-add" size={24} color="#6B7280" />
              <Text style={styles.optionText}>Add people to group</Text>
              <MaterialIcons name="chevron-right" size={24} color="#D1D5DB" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionRow} onPress={() => router.push('/invite-link')}>
              <MaterialIcons name="link" size={24} color="#6B7280" />
              <Text style={styles.optionText}>Invite via link</Text>
              <MaterialIcons name="chevron-right" size={24} color="#D1D5DB" />
            </TouchableOpacity>

            {/* Current User */}
            <View style={styles.memberRow}>
              <View style={styles.memberAvatar}>
                <View style={styles.avatarPattern}>
                  <View style={styles.pattern1} />
                  <View style={styles.pattern2} />
                </View>
              </View>
              <View style={styles.memberInfo}>
                <Text style={styles.memberName}>Saurav Verma (you)</Text>
                <Text style={styles.memberEmail}>skbmasale941@gmail.com</Text>
              </View>
            </View>
          </View>

          {/* Advanced Settings Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Advanced settings</Text>
            
            {/* Simplify Group Debts */}
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <MaterialIcons name="account-tree" size={24} color="#6B7280" />
                <View style={styles.settingContent}>
                  <Text style={styles.settingTitle}>Simplify group debts</Text>
                  <Text style={styles.settingDescription}>
                    Automatically combines debts to reduce the total number of repayments between group members.
                  </Text>
                  <TouchableOpacity>
                    <Text style={styles.learnMoreLink}>Learn more</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <Switch
                value={simplifyDebts}
                onValueChange={setSimplifyDebts}
                trackColor={{ false: '#E5E7EB', true: '#10B981' }}
                thumbColor={simplifyDebts ? '#FFFFFF' : '#FFFFFF'}
              />
            </View>

            {/* Default Split */}
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <MaterialIcons name="equal" size={24} color="#6B7280" />
                <View style={styles.settingContent}>
                  <View style={styles.titleRow}>
                    <Text style={styles.settingTitle}>Default split</Text>
                    <View style={styles.proBadge}>
                      <Text style={styles.proText}>PRO</Text>
                    </View>
                  </View>
                  <Text style={styles.settingDescription}>Paid by you and split equally</Text>
                  <Text style={styles.settingSubDescription}>
                    New expenses you add to this group will default to this setting, which is personal, not group-wide.
                  </Text>
                </View>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#D1D5DB" />
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionSection}>
            <TouchableOpacity style={styles.actionRow}>
              <MaterialIcons name="exit-to-app" size={24} color="#DC2626" />
              <Text style={styles.actionText}>Leave group</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionRow}>
              <MaterialIcons name="delete" size={24} color="#DC2626" />
              <Text style={styles.actionText}>Delete group</Text>
            </TouchableOpacity>
          </View>
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
    fontFamily: 'Montserrat_600SemiBold',
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  groupSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  groupInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  groupIcon: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: '#781D27',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  groupDetails: {
    flex: 1,
  },
  groupName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    fontFamily: 'Poppins_700Bold',
    marginBottom: 4,
  },
  groupType: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Montserrat_400Regular',
  },
  editButton: {
    padding: 8,
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
    fontFamily: 'Montserrat_600SemiBold',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    marginLeft: 16,
    fontFamily: 'Poppins_400Regular',
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  avatarPattern: {
    width: 32,
    height: 32,
    position: 'relative',
  },
  pattern1: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 16,
    height: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
  },
  pattern2: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 16,
    height: 16,
    backgroundColor: '#10B981',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    fontFamily: 'Poppins_500Medium',
    marginBottom: 2,
  },
  memberEmail: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Montserrat_400Regular',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  settingLeft: {
    flex: 1,
    flexDirection: 'row',
  },
  settingContent: {
    flex: 1,
    marginLeft: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    fontFamily: 'Poppins_500Medium',
    marginRight: 8,
  },
  proBadge: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  proText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Poppins_600SemiBold',
  },
  settingDescription: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Montserrat_400Regular',
    marginBottom: 4,
  },
  settingSubDescription: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Montserrat_400Regular',
  },
  learnMoreLink: {
    fontSize: 14,
    color: '#10B981',
    fontFamily: 'Montserrat_500Medium',
  },
  actionSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  actionText: {
    fontSize: 16,
    color: '#DC2626',
    marginLeft: 16,
    fontFamily: 'Poppins_500Medium',
  },
});
