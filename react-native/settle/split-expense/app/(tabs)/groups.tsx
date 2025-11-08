import TabLayoutWrapper from '@/components/TabLayoutWrapper';
import FabButtons from '@/components/fab-buttons';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { getGroups, Group as APIGroup } from '@/apis/groups';
import { getBalances, Balance } from '@/apis/balances';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Group {
  id: string;
  name: string;
  status: string;
  tileColor: string;
  icon: React.ReactNode;
}

const getGroupIcon = (type: string) => {
  switch (type) {
    case 'home':
      return <MaterialIcons name="home" size={28} color="#ffffff" />;
    case 'trip':
      return <MaterialIcons name="flight" size={28} color="#ffffff" />;
    case 'couple':
      return <MaterialIcons name="favorite" size={28} color="#ffffff" />;
    default:
      return <MaterialIcons name="list" size={28} color="#ffffff" />;
  }
};

export default function GroupsScreen() {
  const router = useRouter();
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'outstanding' | 'owe' | 'owed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroupType, setSelectedGroupType] = useState<'trip' | 'home' | 'couple' | 'other' | null>(null);
  const [groupName, setGroupName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [allGroups, setAllGroups] = useState<any[]>([]);
  const [allUsers] = useState<any[]>([]);
  const [overallBalance, setOverallBalance] = useState<{ youOwe: number; youAreOwed: number }>({ youOwe: 0, youAreOwed: 0 });

  useFocusEffect(
    useCallback(() => {
      const fetchGroups = async () => {
        console.log('🔄 Groups screen focused - fetching fresh data...');
        setIsLoading(true);
        try {
          // Get current user
          const userJson = await AsyncStorage.getItem('user_data');
          const currentUser = userJson ? JSON.parse(userJson) : null;

          if (!currentUser) {
            console.warn('No current user found');
            setGroups([]);
            setAllGroups([]);
            setIsLoading(false);
            return;
          }

          console.log('📡 Fetching groups from API...');
          const response = await getGroups();
          if (response && response.success && Array.isArray(response.data)) {
            let totalYouOwe = 0;
            let totalYouAreOwed = 0;

            // Fetch balances for each group and calculate status
            const mappedGroupsPromises = response.data.map(async (group: APIGroup) => {
              console.log(`📊 Fetching balances for group: ${group.name} (${group.id})`);
              const balancesResponse = await getBalances(group.id);
              let status = 'settled up';

              if (balancesResponse && balancesResponse.success && Array.isArray(balancesResponse.data)) {
                const balances: Balance[] = balancesResponse.data;

                // Calculate user's balance in this group
                // Note: Backend returns balances where userId is the OTHER person
                // type 'owes' = current user owes, 'gets_back' = current user is owed
                let groupBalance = 0;
                balances.forEach((balance) => {
                  if (balance.type === 'owes') {
                    groupBalance -= balance.amount;
                    totalYouOwe += balance.amount;
                  } else if (balance.type === 'gets_back') {
                    groupBalance += balance.amount;
                    totalYouAreOwed += balance.amount;
                  }
                });

                // Set status based on balance
                if (groupBalance < 0) {
                  status = `you owe ${Math.abs(groupBalance).toFixed(2)}`;
                } else if (groupBalance > 0) {
                  status = `you are owed ${groupBalance.toFixed(2)}`;
                }
              }

              return {
                id: group.id,
                name: group.name,
                status,
                tileColor: group.color || '#781D27',
                icon: getGroupIcon(group.type),
              };
            });

            const mappedGroups = await Promise.all(mappedGroupsPromises);
            console.log('✅ Groups data refreshed successfully', {
              groupCount: mappedGroups.length,
              totalYouOwe,
              totalYouAreOwed,
            });
            setGroups(mappedGroups);
            setOverallBalance({ youOwe: totalYouOwe, youAreOwed: totalYouAreOwed });

            setAllGroups(response.data.map((group: APIGroup) => ({
              id: group.id,
              name: group.name,
              type: group.type,
            })));
          } else {
            console.warn('Could not fetch groups or no groups found.');
            setGroups([]);
            setAllGroups([]);
          }
        } catch (error) {
          console.error('Error fetching groups:', error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchGroups();
    }, [])
  );

  // Filter groups based on search query and selected filter
  const displayedGroups = groups.filter(group => {
    // Apply search filter
    const matchesSearch = searchQuery.trim() === '' ||
      group.name.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    // Apply balance filter
    if (selectedFilter === 'all') {
      return true;
    } else if (selectedFilter === 'outstanding') {
      // Show groups with outstanding balances (not settled up)
      return group.status !== 'settled up';
    } else if (selectedFilter === 'owe') {
      // Show groups where user owes money
      return group.status.includes('you owe');
    } else if (selectedFilter === 'owed') {
      // Show groups where user is owed money
      return group.status.includes('you are owed');
    }
    return true;
  });

  const groupTypes = [
    { key: 'trip', label: 'Trip', icon: 'flight' },
    { key: 'home', label: 'Home', icon: 'home' },
    { key: 'couple', label: 'Couple', icon: 'favorite' },
    { key: 'other', label: 'Other', icon: 'more-horiz' },
  ] as const;

  const handleCreateGroup = () => {
    console.log('Creating group:', {
      name: groupName,
      type: selectedGroupType,
      startDate,
      endDate,
    });
    setShowCreateGroup(false);
    setGroupName('');
    setStartDate('');
    setEndDate('');
    setSelectedGroupType(null);
  };

  const renderGroupCard = (group: Group) => (
    <TouchableOpacity key={group.id} style={styles.groupCard} onPress={() => router.push(`/group-detail/${group.id}`)}>
      <View style={[styles.groupTile, { backgroundColor: group.tileColor }]}>
        {group.icon}
      </View>
      <View style={styles.groupInfo}>
        <Text style={[styles.groupName, { color: colors.text }]}>{group.name}</Text>
        <Text style={[styles.groupStatus, { color: colors.icon }]}>{group.status}</Text>
      </View>
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
            <TouchableOpacity
              style={styles.addGroupButton}
              onPress={() => router.push('/create-group')}
            >
              <MaterialIcons name="person-add" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Inline Search Bar */}
          {showSearchBar && (
            <View style={[styles.inlineSearchContainer, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
              <MaterialIcons name="search" size={20} color={colors.icon} />
              <TextInput
                style={[styles.inlineSearchInput, { color: colors.text }]}
                placeholder="Search groups..."
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

          <View style={styles.groupsList}>
            {displayedGroups.length > 0 ? (
              displayedGroups.map(renderGroupCard)
            ) : (
              <View style={{ alignItems: 'center', paddingVertical: 40 }}>
                <MaterialIcons name={searchQuery.trim() ? "search-off" : "filter-list-off"} size={48} color={colors.icon} />
                <Text style={[styles.emptySearchText, { color: colors.text, marginTop: 16 }]}>No groups found</Text>
                <Text style={[styles.emptySearchSubtext, { color: colors.icon }]}>
                  {searchQuery.trim() ? 'Try a different search term' : 'Try a different filter'}
                </Text>
              </View>
            )}
          </View>

          <TouchableOpacity 
            style={styles.startNewGroupButton}
            onPress={() => router.push('/create-group')}
          >
            <MaterialIcons name="person-add" size={24} color="#16A34A" />
            <Text style={styles.startNewGroupText}>Start a new group</Text>
          </TouchableOpacity>
        </ScrollView>

        <FabButtons
          onAddExpensePress={() => router.push('/add-expense')}
          isTabScreen={true}
        />
      </SafeAreaView>

      {/* Filter Popup */}
      {showFilterModal && (
        <TouchableOpacity 
          style={styles.filterPopupOverlay}
          activeOpacity={1}
          onPress={() => setShowFilterModal(false)}
        >
          <TouchableOpacity
            style={[styles.filterPopupContainer, { backgroundColor: colors.background, borderColor: colors.border }]}
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            <TouchableOpacity
              style={[
                styles.filterPopupOption,
                { backgroundColor: colors.background },
                selectedFilter === 'all' && { backgroundColor: colors.cardBackground }
              ]}
              onPress={() => {
                setSelectedFilter('all');
                setShowFilterModal(false);
              }}
            >
              <View style={styles.filterPopupOptionContent}>
                <MaterialIcons
                  name="group"
                  size={18}
                  color={selectedFilter === 'all' ? colors.tint : colors.icon}
                />
                <Text style={[
                  styles.filterPopupOptionText,
                  { color: colors.text },
                  selectedFilter === 'all' && styles.filterPopupOptionTextSelected
                ]}>
                  All groups
                </Text>
              </View>
                {selectedFilter === 'all' && (
                  <MaterialIcons name="check" size={18} color={colors.tint} />
                )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filterPopupOption,
                { backgroundColor: colors.background },
                selectedFilter === 'outstanding' && { backgroundColor: colors.cardBackground }
              ]}
              onPress={() => {
                setSelectedFilter('outstanding');
                setShowFilterModal(false);
              }}
            >
              <View style={styles.filterPopupOptionContent}>
                <MaterialIcons
                  name="account-balance-wallet"
                  size={18}
                  color={selectedFilter === 'outstanding' ? colors.tint : colors.icon}
                />
                <Text style={[
                  styles.filterPopupOptionText,
                  { color: colors.text },
                  selectedFilter === 'outstanding' && styles.filterPopupOptionTextSelected
                ]}>
                  Outstanding balances
                </Text>
              </View>
                {selectedFilter === 'outstanding' && (
                  <MaterialIcons name="check" size={18} color={colors.tint} />
                )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filterPopupOption,
                { backgroundColor: colors.background },
                selectedFilter === 'owe' && { backgroundColor: colors.cardBackground }
              ]}
              onPress={() => {
                setSelectedFilter('owe');
                setShowFilterModal(false);
              }}
            >
              <View style={styles.filterPopupOptionContent}>
                <MaterialIcons
                  name="trending-down"
                  size={18}
                  color={selectedFilter === 'owe' ? colors.tint : colors.icon}
                />
                <Text style={[
                  styles.filterPopupOptionText,
                  { color: colors.text },
                  selectedFilter === 'owe' && styles.filterPopupOptionTextSelected
                ]}>
                  Groups you owe
                </Text>
              </View>
                {selectedFilter === 'owe' && (
                  <MaterialIcons name="check" size={18} color={colors.tint} />
                )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filterPopupOption,
                { backgroundColor: colors.background },
                selectedFilter === 'owed' && { backgroundColor: colors.cardBackground }
              ]}
              onPress={() => {
                setSelectedFilter('owed');
                setShowFilterModal(false);
              }}
            >
              <View style={styles.filterPopupOptionContent}>
                <MaterialIcons
                  name="trending-up"
                  size={18}
                  color={selectedFilter === 'owed' ? colors.tint : colors.icon}
                />
                <Text style={[
                  styles.filterPopupOptionText,
                  { color: colors.text },
                  selectedFilter === 'owed' && styles.filterPopupOptionTextSelected
                ]}>
                  Groups that owe you
                </Text>
              </View>
                {selectedFilter === 'owed' && (
                  <MaterialIcons name="check" size={18} color={colors.tint} />
                )}
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      )}

      {/* Create Group Modal */}
      <Modal
        visible={showCreateGroup}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowCreateGroup(false)}>
              <Text style={[styles.cancelButton, { color: colors.tint }]}>Cancel</Text>
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Create Group</Text>
            <TouchableOpacity onPress={handleCreateGroup}>
              <Text style={[styles.createButtonText, { color: colors.tint }]}>Create</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>Group Name</Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                  color: colors.text 
                }]}
                placeholder="Enter group name"
                placeholderTextColor={colors.tabIconDefault}
                value={groupName}
                onChangeText={setGroupName}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>Group Type</Text>
              <View style={styles.groupTypesGrid}>
                {groupTypes.map((type) => (
                  <TouchableOpacity
                    key={type.key}
                    style={[
                      styles.groupTypeButton,
                      {
                        backgroundColor: selectedGroupType === type.key ? colors.tint : colors.background,
                        borderColor: colors.border,
                      }
                    ]}
                    onPress={() => setSelectedGroupType(type.key)}
                  >
                    <MaterialIcons 
                      name={type.icon} 
                      size={24} 
                      color={selectedGroupType === type.key ? 'white' : colors.text} 
                    />
                    <Text style={[
                      styles.groupTypeButtonText,
                      { color: selectedGroupType === type.key ? 'white' : colors.text }
                    ]}>
                      {type.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {selectedGroupType === 'trip' && (
              <>
                <View style={styles.inputContainer}>
                  <Text style={[styles.label, { color: colors.text }]}>Start Date</Text>
                  <TextInput
                    style={[styles.input, { 
                      backgroundColor: colors.background,
                      borderColor: colors.border,
                      color: colors.text 
                    }]}
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor={colors.tabIconDefault}
                    value={startDate}
                    onChangeText={setStartDate}
                  />
                </View>
                <View style={styles.inputContainer}>
                  <Text style={[styles.label, { color: colors.text }]}>End Date</Text>
                  <TextInput
                    style={[styles.input, { 
                      backgroundColor: colors.background,
                      borderColor: colors.border,
                      color: colors.text 
                    }]}
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor={colors.tabIconDefault}
                    value={endDate}
                    onChangeText={setEndDate}
                  />
                </View>
              </>
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>
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
  addGroupButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
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
  settledUpHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
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
  groupsList: {
    gap: 4,
    paddingTop: 12,
  },
  groupCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 0,
  },
  groupTile: {
    width: 56,
    height: 56,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  multiColorTile: {
    width: 56,
    height: 56,
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderRadius: 10,
    overflow: 'hidden',
  },
  colorBlock: {
    width: '33.33%',
    height: '50%',
  },
  groupInfo: {
    flex: 1,
    paddingLeft: 16,
  },
  groupName: {
    fontSize: 16,
    marginBottom: 2,
    fontFamily: 'Poppins_600SemiBold',
  },
  groupStatus: {
    fontSize: 14,
    fontFamily: 'Montserrat_400Regular',
  },
  startNewGroupButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#16A34A',
    gap: 8,
    marginTop: 12,
    marginBottom: 12,
  },
  startNewGroupText: {
    fontSize: 16,
    color: '#16A34A',
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
  groupTypesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  groupTypeButton: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  groupTypeButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  emptySearchText: {
    fontSize: 16,
    fontFamily: 'Poppins_500Medium',
  },
  emptySearchSubtext: {
    fontSize: 14,
    fontFamily: 'Montserrat_400Regular',
  },
  // Filter Popup Styles
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
    top: 140, // Position relative to the filter button area
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
    fontFamily: 'Poppins_500Medium',
  },
  filterPopupOptionTextSelected: {
    fontFamily: 'Poppins_600SemiBold',
  },
});
