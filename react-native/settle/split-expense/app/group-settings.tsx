import TabLayoutWrapper from '@/components/TabLayoutWrapper';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import React, { useState, useCallback } from 'react';
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getGroup, deleteGroup, leaveGroup, updateGroupSettings } from '@/apis/groups';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface GroupMember {
  id: string;
  name: string;
  pubkey: string;
  avatar_uri?: string;
}

interface Group {
  id: string;
  name: string;
  type: string;
  simplify_debts?: number;
  created_by: string;
  members?: GroupMember[];
}

export default function GroupSettingsScreen() {
  const router = useRouter();
  const { groupId } = useLocalSearchParams();
  const [group, setGroup] = useState<Group | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [simplifyDebts, setSimplifyDebts] = useState(false);

  const fetchData = useCallback(async () => {
    if (!groupId) return;
    setLoading(true);
    try {
      const userJson = await AsyncStorage.getItem('user_data');
      if (userJson) {
        const user = JSON.parse(userJson);
        setCurrentUser(user);
      }

      const groupResponse = await getGroup(groupId as string);
      if (groupResponse && groupResponse.success) {
        setGroup(groupResponse.data);
        setSimplifyDebts(!!groupResponse.data.simplify_debts);
      } else {
        console.error('Failed to fetch group:', groupResponse?.message);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  const handleSimplifyDebtsToggle = async (value: boolean) => {
    setSimplifyDebts(value);
    if (groupId) {
      const response = await updateGroupSettings(groupId as string, {
        simplifyDebts: value,
      });
      if (!response.success) {
        // Revert on failure
        setSimplifyDebts(!value);
        Alert.alert('Error', response.message || 'Failed to update settings');
      }
    }
  };

  const handleLeaveGroup = () => {
    Alert.alert(
      'Leave Group',
      `Are you sure you want to leave "${group?.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Leave',
          style: 'destructive',
          onPress: async () => {
            if (groupId) {
              const response = await leaveGroup(groupId as string);
              if (response.success) {
                Alert.alert('Success', 'You have left the group');
                router.replace('/(tabs)/groups');
              } else {
                Alert.alert('Error', response.message || 'Failed to leave group');
              }
            }
          },
        },
      ]
    );
  };

  const handleDeleteGroup = () => {
    Alert.alert(
      'Delete Group',
      `Are you sure you want to delete "${group?.name}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            if (groupId) {
              const response = await deleteGroup(groupId as string);
              if (response.success) {
                Alert.alert('Success', 'Group has been deleted');
                router.replace('/(tabs)/groups');
              } else {
                Alert.alert('Error', response.message || 'Failed to delete group');
              }
            }
          },
        },
      ]
    );
  };

  const getGroupIcon = (type: string) => {
    switch (type) {
      case 'home':
        return 'home';
      case 'trip':
        return 'flight';
      case 'couple':
        return 'favorite';
      default:
        return 'list';
    }
  };

  const capitalizeFirst = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  if (loading || !group) {
    return (
      <TabLayoutWrapper>
        <SafeAreaView style={styles.container} edges={['top']}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <MaterialIcons name="arrow-back" size={24} color="#000000" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Group settings</Text>
            <View style={styles.headerSpacer} />
          </View>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#781D27" />
          </View>
        </SafeAreaView>
      </TabLayoutWrapper>
    );
  }

  const isCreator = currentUser && group.created_by === currentUser.id;

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
                <MaterialIcons name={getGroupIcon(group.type)} size={32} color="#FFFFFF" />
              </View>
              <View style={styles.groupDetails}>
                <Text style={styles.groupName}>{group.name}</Text>
                <Text style={styles.groupType}>{capitalizeFirst(group.type)}</Text>
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

            {/* All Group Members */}
            {group.members && group.members.map((member) => {
              const isCurrentUser = currentUser && member.id === currentUser.id;
              return (
                <View key={member.id} style={styles.memberRow}>
                  <View style={styles.memberAvatar}>
                    <View style={styles.avatarPattern}>
                      <View style={styles.pattern1} />
                      <View style={styles.pattern2} />
                    </View>
                  </View>
                  <View style={styles.memberInfo}>
                    <Text style={styles.memberName}>
                      {member.name}{isCurrentUser ? ' (you)' : ''}
                    </Text>
                    <Text style={styles.memberEmail}>
                      {member.pubkey?.substring(0, 16)}...
                    </Text>
                  </View>
                </View>
              );
            })}
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
                </View>
              </View>
              <Switch
                value={simplifyDebts}
                onValueChange={handleSimplifyDebtsToggle}
                trackColor={{ false: '#E5E7EB', true: '#10B981' }}
                thumbColor={simplifyDebts ? '#FFFFFF' : '#FFFFFF'}
              />
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionSection}>
            <TouchableOpacity style={styles.actionRow} onPress={handleLeaveGroup}>
              <MaterialIcons name="exit-to-app" size={24} color="#DC2626" />
              <Text style={styles.actionText}>Leave group</Text>
            </TouchableOpacity>

            {isCreator && (
              <TouchableOpacity style={styles.actionRow} onPress={handleDeleteGroup}>
                <MaterialIcons name="delete" size={24} color="#DC2626" />
                <Text style={styles.actionText}>Delete group</Text>
              </TouchableOpacity>
            )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    borderBottomWidth: 1,
    borderBottomColor: '#F9FAFB',
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
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    fontFamily: 'Poppins_500Medium',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Montserrat_400Regular',
    marginBottom: 4,
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
