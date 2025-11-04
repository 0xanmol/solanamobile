import TabLayoutWrapper from '@/components/TabLayoutWrapper';
import { Colors } from '@/constants/colors';
import { BorderRadius, Spacing } from '@/constants/spacing';
import { FontFamily, FontSize } from '@/constants/typography';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import React, { useState, useEffect } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getFriends, Friend } from '@/apis/friends';
import { addGroupMember, getGroup } from '@/apis/groups';
import Toast from 'react-native-toast-message';

export default function AddGroupMembersScreen() {
  const router = useRouter();
  const { groupId } = useLocalSearchParams();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [selectedFriends, setSelectedFriends] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [groupMembers, setGroupMembers] = useState<Set<string>>(new Set());
  const [groupName, setGroupName] = useState('');

  useEffect(() => {
    fetchData();
  }, [groupId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch friends
      const friendsResponse = await getFriends();
      console.log('Friends response:', friendsResponse);

      if (friendsResponse && friendsResponse.success && Array.isArray(friendsResponse.data)) {
        console.log('Friends data:', friendsResponse.data);
        setFriends(friendsResponse.data);
      } else {
        console.error('Failed to fetch friends:', friendsResponse);
      }

      // Fetch group details to get existing members
      if (groupId) {
        const groupResponse = await getGroup(groupId as string);
        if (groupResponse.success && groupResponse.data) {
          setGroupName(groupResponse.data.name);
          const memberIds = new Set(
            groupResponse.data.members?.map((m) => m.id) || []
          );
          setGroupMembers(memberIds);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to load friends',
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleFriendSelection = (friendId: string) => {
    const newSelected = new Set(selectedFriends);
    if (newSelected.has(friendId)) {
      newSelected.delete(friendId);
    } else {
      newSelected.add(friendId);
    }
    setSelectedFriends(newSelected);
  };

  const handleAddMembers = async () => {
    if (selectedFriends.size === 0) {
      Toast.show({
        type: 'info',
        text1: 'No Selection',
        text2: 'Please select at least one friend to add',
      });
      return;
    }

    if (!groupId) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Group ID is missing',
      });
      return;
    }

    setAdding(true);
    try {
      const selectedArray = Array.from(selectedFriends);
      let successCount = 0;
      let failCount = 0;

      // Add each selected friend to the group
      for (const friendId of selectedArray) {
        const response = await addGroupMember(groupId as string, { userId: friendId });
        if (response.success) {
          successCount++;
        } else {
          failCount++;
          console.error('Failed to add member:', response.message);
        }
      }

      if (successCount > 0) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: `Added ${successCount} member${successCount > 1 ? 's' : ''} to the group`,
        });
        setTimeout(() => router.back(), 500);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to add members to the group',
        });
      }
    } catch (error) {
      console.error('Error adding members:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to add members. Please try again.',
      });
    } finally {
      setAdding(false);
    }
  };

  const filteredFriends = friends.filter((friend) => {
    // Filter out friends who are already in the group
    if (groupMembers.has(friend.id)) {
      return false;
    }
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      return (
        friend.name?.toLowerCase().includes(query) ||
        friend.email?.toLowerCase().includes(query)
      );
    }
    return true;
  });

  if (loading) {
    return (
      <TabLayoutWrapper>
        <SafeAreaView style={styles.container} edges={['top']}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <MaterialIcons name="arrow-back" size={24} color={Colors.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Add Members</Text>
            <View style={styles.headerSpacer} />
          </View>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#781D27" />
          </View>
        </SafeAreaView>
      </TabLayoutWrapper>
    );
  }

  return (
    <TabLayoutWrapper>
      <SafeAreaView style={styles.container} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Add Members</Text>
            {groupName && <Text style={styles.headerSubtitle}>{groupName}</Text>}
          </View>
          <View style={styles.headerSpacer} />
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <MaterialIcons name="search" size={20} color={Colors.textTertiary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search friends..."
            placeholderTextColor={Colors.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Friends List */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {filteredFriends.length === 0 ? (
            <View style={styles.emptyContainer}>
              <MaterialIcons name="person-off" size={48} color={Colors.textTertiary} />
              <Text style={styles.emptyText}>
                {searchQuery.trim()
                  ? 'No friends found'
                  : 'No friends available to add'}
              </Text>
              <Text style={styles.emptySubtext}>
                {searchQuery.trim()
                  ? 'Try a different search term'
                  : 'Add friends first to invite them to groups'}
              </Text>
              {!searchQuery.trim() && (
                <TouchableOpacity
                  style={styles.addFriendButton}
                  onPress={() => router.push('/add-friends')}
                >
                  <MaterialIcons name="person-add" size={20} color="#FFFFFF" />
                  <Text style={styles.addFriendButtonText}>Add Friends</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <View style={styles.friendsList}>
              {filteredFriends.map((friend) => (
                <TouchableOpacity
                  key={friend.id}
                  style={styles.friendRow}
                  onPress={() => toggleFriendSelection(friend.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.friendInfo}>
                    <View style={styles.friendAvatar}>
                      <Text style={styles.avatarText}>
                        {friend.name?.charAt(0).toUpperCase() || '?'}
                      </Text>
                    </View>
                    <View style={styles.friendDetails}>
                      <Text style={styles.friendName}>{friend.name}</Text>
                      {friend.email && (
                        <Text style={styles.friendEmail}>{friend.email}</Text>
                      )}
                    </View>
                  </View>
                  <View
                    style={[
                      styles.checkbox,
                      selectedFriends.has(friend.id) && styles.checkboxSelected,
                    ]}
                  >
                    {selectedFriends.has(friend.id) && (
                      <MaterialIcons name="check" size={16} color="#FFFFFF" />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>

        {/* Add Button */}
        {selectedFriends.size > 0 && (
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.addButton, adding && styles.addButtonDisabled]}
              onPress={handleAddMembers}
              disabled={adding}
            >
              {adding ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <MaterialIcons name="group-add" size={20} color="#FFFFFF" />
                  <Text style={styles.addButtonText}>
                    Add {selectedFriends.size} Member{selectedFriends.size > 1 ? 's' : ''}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </TabLayoutWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  backButton: {
    padding: 8,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: FontSize.xl,
    fontFamily: FontFamily.poppinsSemiBold,
    color: Colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.poppinsRegular,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  headerSpacer: {
    width: 40,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.slate50,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    margin: Spacing.md,
    gap: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: FontSize.md,
    fontFamily: FontFamily.poppinsRegular,
    color: Colors.textPrimary,
    padding: 0,
  },
  content: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing['2xl'],
    paddingTop: 80,
  },
  emptyText: {
    fontSize: FontSize.lg,
    fontFamily: FontFamily.poppinsSemiBold,
    color: Colors.textPrimary,
    marginTop: Spacing.lg,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.poppinsRegular,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
  addFriendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7C3AED',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
    marginTop: Spacing.xl,
  },
  addFriendButtonText: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.poppinsSemiBold,
    color: '#FFFFFF',
  },
  friendsList: {
    paddingHorizontal: Spacing.md,
  },
  friendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  friendInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  friendAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  avatarText: {
    fontSize: FontSize.xl,
    fontFamily: FontFamily.poppinsSemiBold,
    color: '#FFFFFF',
  },
  friendDetails: {
    flex: 1,
  },
  friendName: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.poppinsSemiBold,
    color: Colors.textPrimary,
  },
  friendEmail: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.poppinsRegular,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  footer: {
    padding: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    backgroundColor: Colors.white,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
  },
  addButtonDisabled: {
    opacity: 0.6,
  },
  addButtonText: {
    fontSize: FontSize.lg,
    fontFamily: FontFamily.poppinsSemiBold,
    color: '#FFFFFF',
  },
});
