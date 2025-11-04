import TabLayoutWrapper from '@/components/TabLayoutWrapper';
import FabButtons from '@/components/fab-buttons';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter, useFocusEffect } from 'expo-router';
import React, { useState, useCallback } from 'react';
import { getFriends } from '@/apis/friends';
import { getBalances, Balance } from '@/apis/balances';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Friend {
  id: string;
  name: string;
  pubkey?: string;
  phone?: string;
  avatar_uri?: string;
  balance?: number;
  status?: string;
}

export default function FriendsScreen() {
  const router = useRouter();
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [friendEmail, setFriendEmail] = useState('');
  const [friendName, setFriendName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'outstanding' | 'owe' | 'owed'>('all');

  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const [friends, setFriends] = useState<Friend[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [overallBalance, setOverallBalance] = useState<{ youOwe: number; youAreOwed: number }>({ youOwe: 0, youAreOwed: 0 });

  useFocusEffect(
    useCallback(() => {
      const fetchFriends = async () => {
        setIsLoading(true);
        try {
          // Get current user
          const userJson = await AsyncStorage.getItem('user_data');
          const currentUser = userJson ? JSON.parse(userJson) : null;

          if (!currentUser) {
            console.warn('No current user found');
            setFriends([]);
            setIsLoading(false);
            return;
          }

          // Fetch friends
          const friendsResponse = await getFriends();
          if (friendsResponse && friendsResponse.success && Array.isArray(friendsResponse.data)) {
            // Fetch overall balances
            const balancesResponse = await getBalances();
            let totalYouOwe = 0;
            let totalYouAreOwed = 0;

            // Create a map of balances by userId for quick lookup
            const balanceMap = new Map<string, { amount: number; type: string }>();
            if (balancesResponse && balancesResponse.success && Array.isArray(balancesResponse.data)) {
              balancesResponse.data.forEach((b: Balance) => {
                balanceMap.set(b.userId, { amount: b.amount, type: b.type });

                // Calculate totals
                if (b.type === 'owes') {
                  totalYouOwe += b.amount;
                } else if (b.type === 'gets_back') {
                  totalYouAreOwed += b.amount;
                }
              });
            }

            // Map friends with their balances
            const friendsWithBalances = friendsResponse.data.map((friend: any) => {
              const balanceInfo = balanceMap.get(friend.id);
              let status = 'no expenses';

              if (balanceInfo) {
                if (balanceInfo.type === 'owes') {
                  status = `you owe ${balanceInfo.amount.toFixed(2)}`;
                } else if (balanceInfo.type === 'gets_back') {
                  status = `owes you ${balanceInfo.amount.toFixed(2)}`;
                }
              }

              return {
                ...friend,
                balance: balanceInfo ? balanceInfo.amount : 0,
                status,
              };
            });

            setFriends(friendsWithBalances);
            setOverallBalance({ youOwe: totalYouOwe, youAreOwed: totalYouAreOwed });
          } else {
            console.warn('Could not fetch friends');
            setFriends([]);
          }
        } catch (error) {
          console.error('Error fetching friends:', error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchFriends();
    }, [])
  );

  const handleAddFriend = () => {
    console.log('Adding friend:', {
      name: friendName,
      email: friendEmail,
    });
    setShowAddFriend(false);
    setFriendName('');
    setFriendEmail('');
  };

  // Filter friends based on search query and selected filter
  const filteredFriends = friends.filter(friend => {
    // Apply search filter
    const matchesSearch = searchQuery.trim() === '' ||
      friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      friend.phone?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      friend.pubkey?.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    // Apply balance filter
    if (selectedFilter === 'all') {
      return true;
    } else if (selectedFilter === 'outstanding') {
      return friend.status !== 'no expenses';
    } else if (selectedFilter === 'owe') {
      return friend.status?.includes('you owe');
    } else if (selectedFilter === 'owed') {
      return friend.status?.includes('owes you');
    }
    return true;
  });

  const getFriendColor = (friendId: string) => {
    // Generate consistent color based on friend ID
    const colors = ['#10B981', '#7C3AED', '#F59E0B', '#EF4444', '#3B82F6', '#EC4899'];
    const index = friendId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
  };

  const renderFriendCard = (friend: Friend) => (
    <TouchableOpacity
      key={friend.id}
      style={[styles.friendCard, { borderBottomColor: colors.border }]}
    >
      <View style={[styles.friendTile, { backgroundColor: getFriendColor(friend.id) }]}>
        <MaterialIcons name="person" size={28} color="#FFFFFF" />
      </View>
      <View style={styles.friendInfo}>
        <Text style={[styles.friendName, { color: colors.text }]}>{friend.name}</Text>
      </View>
      <Text style={[styles.friendStatus, { color: colors.icon }]}>{friend.status || 'no expenses'}</Text>
    </TouchableOpacity>
  );

  return (
    <TabLayoutWrapper>
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
        <View style={styles.header}>
          <View style={styles.headerLeft} />
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.searchButton}
              onPress={() => {
                setShowSearchBar(!showSearchBar);
                if (showSearchBar) {
                  setSearchQuery('');
                }
              }}
            >
              <MaterialIcons name={showSearchBar ? "close" : "search"} size={24} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.addPersonButton} onPress={() => router.push('/add-friends')}>
              <MaterialCommunityIcons name="account-plus" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          horizontal={false}
          nestedScrollEnabled={true}
        >
          {/* Inline Search Bar */}
          {showSearchBar && (
            <View style={[styles.inlineSearchContainer, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
              <MaterialIcons name="search" size={20} color={colors.icon} />
              <TextInput
                style={[styles.inlineSearchInput, { color: colors.text }]}
                placeholder="Search friends..."
                placeholderTextColor={colors.icon}
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <MaterialIcons name="clear" size={20} color={colors.icon} />
                </TouchableOpacity>
              )}
            </View>
          )}

          <View style={styles.settledUpHeader}>
            <Text style={[styles.settledUpText, { color: colors.text }]}>
              {overallBalance.youOwe === 0 && overallBalance.youAreOwed === 0
                ? 'You are all settled up!'
                : overallBalance.youOwe > overallBalance.youAreOwed
                ? `You owe ${(overallBalance.youOwe - overallBalance.youAreOwed).toFixed(2)} overall`
                : `You are owed ${(overallBalance.youAreOwed - overallBalance.youOwe).toFixed(2)} overall`}
            </Text>
            <TouchableOpacity style={styles.filterButton} onPress={() => setShowFilterModal(true)}>
              <MaterialIcons name="tune" size={24} color={colors.icon} />
            </TouchableOpacity>
          </View>

          <View style={styles.friendsList}>
            {filteredFriends.length > 0 ? (
              filteredFriends.map(renderFriendCard)
            ) : (
              <View style={{ alignItems: 'center', paddingVertical: 40 }}>
                <MaterialIcons name="person-search" size={48} color={colors.icon} />
                <Text style={[styles.emptySearchText, { color: colors.text, marginTop: 16 }]}>
                  {searchQuery.trim() ? 'No friends found' : 'No friends match this filter'}
                </Text>
                <Text style={[styles.emptySearchSubtext, { color: colors.icon }]}>
                  {searchQuery.trim() ? 'Try a different search term' : 'Try a different filter'}
                </Text>
              </View>
            )}
          </View>

          <TouchableOpacity style={[styles.addMoreFriendsButton, { borderColor: colors.success }]} onPress={() => router.push('/add-friends')}>
            <MaterialCommunityIcons name="account-plus" size={24} color={colors.success} />
            <Text style={[styles.addMoreFriendsText, { color: colors.success }]}>Add more friends</Text>
          </TouchableOpacity>
        </ScrollView>

        <FabButtons
          onAddExpensePress={() => console.log('Add expense pressed')}
          isTabScreen={true}
        />

        {/* Filter Popup */}
        {showFilterModal && (
          <TouchableOpacity 
            style={styles.filterPopupOverlay}
            activeOpacity={1}
            onPress={() => setShowFilterModal(false)}
          >
            <TouchableOpacity
              style={[styles.filterPopupContainer, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
              activeOpacity={1}
              onPress={(e) => e.stopPropagation()}
            >
              <TouchableOpacity
                style={[styles.filterPopupOption, { backgroundColor: colors.cardBackground }, selectedFilter === 'all' && { backgroundColor: colors.border }]}
                onPress={() => { setSelectedFilter('all'); setShowFilterModal(false); }}
              >
                <View style={styles.filterPopupOptionContent}>
                  <MaterialIcons name="group" size={18} color={selectedFilter === 'all' ? colors.tint : colors.icon} />
                  <Text style={[styles.filterPopupOptionText, { color: colors.text }, selectedFilter === 'all' && { color: colors.tint }]}>All friends</Text>
                </View>
                {selectedFilter === 'all' && <MaterialIcons name="check" size={18} color={colors.tint} />}
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.filterPopupOption, { backgroundColor: colors.cardBackground }, selectedFilter === 'outstanding' && { backgroundColor: colors.border }]}
                onPress={() => { setSelectedFilter('outstanding'); setShowFilterModal(false); }}
              >
                <View style={styles.filterPopupOptionContent}>
                  <MaterialIcons name="account-balance-wallet" size={18} color={selectedFilter === 'outstanding' ? colors.tint : colors.icon} />
                  <Text style={[styles.filterPopupOptionText, { color: colors.text }, selectedFilter === 'outstanding' && { color: colors.tint }]}>Outstanding balances</Text>
                </View>
                {selectedFilter === 'outstanding' && <MaterialIcons name="check" size={18} color={colors.tint} />}
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.filterPopupOption, { backgroundColor: colors.cardBackground }, selectedFilter === 'owe' && { backgroundColor: colors.border }]}
                onPress={() => { setSelectedFilter('owe'); setShowFilterModal(false); }}
              >
                <View style={styles.filterPopupOptionContent}>
                  <MaterialIcons name="trending-down" size={18} color={selectedFilter === 'owe' ? colors.tint : colors.icon} />
                  <Text style={[styles.filterPopupOptionText, { color: colors.text }, selectedFilter === 'owe' && { color: colors.tint }]}>Friends you owe</Text>
                </View>
                {selectedFilter === 'owe' && <MaterialIcons name="check" size={18} color={colors.tint} />}
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.filterPopupOption, { backgroundColor: colors.cardBackground }, selectedFilter === 'owed' && { backgroundColor: colors.border }]}
                onPress={() => { setSelectedFilter('owed'); setShowFilterModal(false); }}
              >
                <View style={styles.filterPopupOptionContent}>
                  <MaterialIcons name="trending-up" size={18} color={selectedFilter === 'owed' ? colors.tint : colors.icon} />
                  <Text style={[styles.filterPopupOptionText, { color: colors.text }, selectedFilter === 'owed' && { color: colors.tint }]}>Friends who owe you</Text>
                </View>
                {selectedFilter === 'owed' && <MaterialIcons name="check" size={18} color={colors.tint} />}
              </TouchableOpacity>
            </TouchableOpacity>
          </TouchableOpacity>
        )}

      {/* Add Friend Modal */}
      <Modal
        visible={showAddFriend}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowAddFriend(false)}>
              <Text style={[styles.cancelButton, { color: colors.tint }]}>Cancel</Text>
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Add Friend</Text>
            <TouchableOpacity onPress={handleAddFriend}>
              <Text style={[styles.addButtonText, { color: colors.tint }]}>Add</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>Friend's Name</Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                  color: colors.text 
                }]}
                placeholder="Enter friend's name"
                placeholderTextColor={colors.tabIconDefault}
                value={friendName}
                onChangeText={setFriendName}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>Email Address</Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                  color: colors.text 
                }]}
                placeholder="Enter email address"
                placeholderTextColor={colors.tabIconDefault}
                value={friendEmail}
                onChangeText={setFriendEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.helpText}>
              <MaterialIcons name="info" size={20} color={colors.tabIconDefault} />
              <Text style={[styles.helpTextContent, { color: colors.tabIconDefault }]}>
                Your friend will receive an invitation to join SplitExpense
              </Text>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      </SafeAreaView>
    </TabLayoutWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 16,
  },
  searchButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addPersonButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  inlineSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    marginBottom: 16,
    borderWidth: 1,
  },
  inlineSearchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
  },
  emptySearchText: {
    fontSize: 16,
    fontFamily: 'Poppins_500Medium',
  },
  emptySearchSubtext: {
    fontSize: 14,
    fontFamily: 'Montserrat_400Regular',
    marginTop: 4,
  },
  settledUpHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  settledUpText: {
    fontSize: 18,
    fontFamily: 'Montserrat_600SemiBold',
  },
  filterButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  friendsList: {
    gap: 8,
    marginBottom: 16,
  },
  friendCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 0,
  },
  friendTile: {
    width: 56,
    height: 56,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  friendAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: 16,
    marginBottom: 2,
    fontFamily: 'Poppins_600SemiBold',
  },
  friendStatus: {
    fontSize: 14,
    fontFamily: 'Montserrat_400Regular',
  },
  addMoreFriendsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 2,
    gap: 8,
  },
  addMoreFriendsText: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E7',
  },
  cancelButton: {
    fontSize: 16,
    fontWeight: '500',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  helpText: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  helpTextContent: {
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },
  // Filter popup styles
  filterPopupOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
  },
  filterPopupContainer: {
    position: 'absolute',
    top: 140,
    right: 20,
    borderRadius: 16,
    minWidth: 260,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 6,
    borderWidth: 1,
    overflow: 'hidden',
  },
  filterPopupOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  filterPopupOptionSelected: {
  },
  filterPopupOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  filterPopupOptionText: {
    fontSize: 16,
  },
  filterPopupOptionTextSelected: {
    fontWeight: '600',
  },
});
