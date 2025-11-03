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
  const [showSearchModal, setShowSearchModal] = useState(false);
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

  const renderFriendCard = (friend: Friend) => (
    <TouchableOpacity
      key={friend.id}
      style={styles.friendCard}
    >
      <View style={styles.friendAvatar}>
        <MaterialIcons name="person" size={24} color="#6B7280" />
      </View>
      <View style={styles.friendInfo}>
        <Text style={styles.friendName}>{friend.name}</Text>
      </View>
      <Text style={styles.friendStatus}>{friend.status || 'no expenses'}</Text>
    </TouchableOpacity>
  );

  return (
    <TabLayoutWrapper>
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <View style={styles.headerLeft} />
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.searchButton} onPress={() => setShowSearchModal(true)}>
              <MaterialIcons name="search" size={24} color="#1F2937" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.addPersonButton} onPress={() => router.push('/add-friends')}>
              <MaterialCommunityIcons name="account-plus" size={24} color="#1F2937" />
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
          <View style={styles.settledUpHeader}>
            <Text style={styles.settledUpText}>
              {overallBalance.youOwe === 0 && overallBalance.youAreOwed === 0
                ? 'You are all settled up!'
                : overallBalance.youOwe > overallBalance.youAreOwed
                ? `You owe ${(overallBalance.youOwe - overallBalance.youAreOwed).toFixed(2)} overall`
                : `You are owed ${(overallBalance.youAreOwed - overallBalance.youOwe).toFixed(2)} overall`}
            </Text>
            <TouchableOpacity style={styles.filterButton} onPress={() => setShowFilterModal(true)}>
              <MaterialIcons name="tune" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <View style={styles.friendsList}>
            {friends.map(renderFriendCard)}
          </View>

          <TouchableOpacity style={styles.addMoreFriendsButton} onPress={() => router.push('/add-friends')}>
            <MaterialCommunityIcons name="account-plus" size={24} color="#16A34A" />
            <Text style={styles.addMoreFriendsText}>Add more friends</Text>
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
              style={styles.filterPopupContainer}
              activeOpacity={1}
              onPress={(e) => e.stopPropagation()}
            >
              <TouchableOpacity 
                style={[styles.filterPopupOption, selectedFilter === 'all' && styles.filterPopupOptionSelected]}
                onPress={() => { setSelectedFilter('all'); setShowFilterModal(false); }}
              >
                <View style={styles.filterPopupOptionContent}>
                  <MaterialIcons name="group" size={18} color={selectedFilter === 'all' ? '#7C3AED' : '#6B7280'} />
                  <Text style={[styles.filterPopupOptionText, selectedFilter === 'all' && styles.filterPopupOptionTextSelected]}>All friends</Text>
                </View>
                {selectedFilter === 'all' && <MaterialIcons name="check" size={18} color="#7C3AED" />}
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.filterPopupOption, selectedFilter === 'outstanding' && styles.filterPopupOptionSelected]}
                onPress={() => { setSelectedFilter('outstanding'); setShowFilterModal(false); }}
              >
                <View style={styles.filterPopupOptionContent}>
                  <MaterialIcons name="account-balance-wallet" size={18} color={selectedFilter === 'outstanding' ? '#7C3AED' : '#6B7280'} />
                  <Text style={[styles.filterPopupOptionText, selectedFilter === 'outstanding' && styles.filterPopupOptionTextSelected]}>Outstanding balances</Text>
                </View>
                {selectedFilter === 'outstanding' && <MaterialIcons name="check" size={18} color="#7C3AED" />}
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.filterPopupOption, selectedFilter === 'owe' && styles.filterPopupOptionSelected]}
                onPress={() => { setSelectedFilter('owe'); setShowFilterModal(false); }}
              >
                <View style={styles.filterPopupOptionContent}>
                  <MaterialIcons name="trending-down" size={18} color={selectedFilter === 'owe' ? '#7C3AED' : '#6B7280'} />
                  <Text style={[styles.filterPopupOptionText, selectedFilter === 'owe' && styles.filterPopupOptionTextSelected]}>Friends you owe</Text>
                </View>
                {selectedFilter === 'owe' && <MaterialIcons name="check" size={18} color="#7C3AED" />}
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.filterPopupOption, selectedFilter === 'owed' && styles.filterPopupOptionSelected]}
                onPress={() => { setSelectedFilter('owed'); setShowFilterModal(false); }}
              >
                <View style={styles.filterPopupOptionContent}>
                  <MaterialIcons name="trending-up" size={18} color={selectedFilter === 'owed' ? '#7C3AED' : '#6B7280'} />
                  <Text style={[styles.filterPopupOptionText, selectedFilter === 'owed' && styles.filterPopupOptionTextSelected]}>Friends who owe you</Text>
                </View>
                {selectedFilter === 'owed' && <MaterialIcons name="check" size={18} color="#7C3AED" />}
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

      {/* Search Modal (centered) */}
      <Modal
        visible={showSearchModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowSearchModal(false)}
      >
        <View style={styles.searchModalOverlay}>
          <View style={styles.searchModalContainer}>
            <View style={styles.searchModalHeader}>
              <Text style={styles.searchModalTitle}>Search</Text>
              <TouchableOpacity onPress={() => setShowSearchModal(false)}>
                <MaterialIcons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            <View style={styles.searchInputContainer}>
              <MaterialIcons name="search" size={20} color="#6B7280" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search friends..."
                placeholderTextColor="#6B7280"
                value={friendName}
                onChangeText={setFriendName}
                autoFocus
              />
              {friendName.length > 0 && (
                <TouchableOpacity onPress={() => setFriendName('')}>
                  <MaterialIcons name="clear" size={20} color="#6B7280" />
                </TouchableOpacity>
              )}
            </View>
            <ScrollView style={{ maxHeight: 320 }}>
              {friends
                .filter(f => f.name.toLowerCase().includes(friendName.toLowerCase()))
                .map(f => (
                  <View key={f.id} style={styles.searchResultItem}>
                    <View style={styles.friendAvatar}>
                      <MaterialIcons name="person" size={20} color="#6B7280" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.friendName}>{f.name}</Text>
                      <Text style={styles.friendStatus}>{f.email}</Text>
                    </View>
                  </View>
                ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  settledUpHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  settledUpText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
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
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  friendAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  friendStatus: {
    fontSize: 14,
    color: '#6B7280',
  },
  addMoreFriendsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#16A34A',
    gap: 8,
  },
  addMoreFriendsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#16A34A',
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
  searchModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  searchModalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
  searchModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  searchModalTitle: {
    fontSize: 20,
    color: '#1F2937',
    fontFamily: 'Montserrat_600SemiBold',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    margin: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
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
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    minWidth: 260,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 6,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    overflow: 'hidden',
  },
  filterPopupOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
  },
  filterPopupOptionSelected: {
    backgroundColor: '#F3F4F6',
  },
  filterPopupOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  filterPopupOptionText: {
    fontSize: 16,
    color: '#1F2937',
  },
  filterPopupOptionTextSelected: {
    color: '#7C3AED',
    fontWeight: '600',
  },
});
