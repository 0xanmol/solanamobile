import TabLayoutWrapper from '@/components/TabLayoutWrapper';
import FabButtons from '@/components/fab-buttons';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
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

interface Group {
  id: string;
  name: string;
  status: string;
  tileColor: string;
  icon: React.ReactNode;
}

export default function GroupsScreen() {
  const router = useRouter();
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'outstanding' | 'owe' | 'owed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroupType, setSelectedGroupType] = useState<'trip' | 'home' | 'couple' | 'other' | null>(null);
  const [groupName, setGroupName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const [groups] = useState<Group[]>([
    {
      id: '1',
      name: 'Jje',
      status: 'settled up',
      tileColor: '#781D27',
      icon: <MaterialIcons name="home" size={28} color="#ffffff" />,
    },
    {
      id: '2',
      name: 'Uu3uu',
      status: 'no expenses',
      tileColor: '#781D27',
      icon: <MaterialIcons name="list" size={28} color="#ffffff" />,
    },
    {
      id: '3',
      name: 'Non-group expenses',
      status: 'no expenses',
      tileColor: '#E5E7EB',
      icon: (
        <View style={styles.multiColorTile}>
          <View style={[styles.colorBlock, { backgroundColor: '#1CC29F' }]} />
          <View style={[styles.colorBlock, { backgroundColor: '#F59E0B' }]} />
          <View style={[styles.colorBlock, { backgroundColor: '#8B5CF6' }]} />
        </View>
      ),
    },
  ]);

  const allGroups = [
    { id: '1', name: 'Weekend Trip to Paris', type: 'trip' },
    { id: '2', name: 'Apartment Expenses', type: 'home' },
    { id: '3', name: 'Date Night Fund', type: 'couple' },
    { id: '4', name: 'Office Lunch', type: 'other' },
    { id: '5', name: 'Vacation 2024', type: 'trip' },
    { id: '6', name: 'House Bills', type: 'home' },
    { id: '7', name: 'Wedding Planning', type: 'couple' },
    { id: '8', name: 'Study Group', type: 'other' },
  ];

  const allUsers = [
    { id: '1', name: 'John Doe', email: 'john@example.com' },
    { id: '2', name: 'Sarah Wilson', email: 'sarah@example.com' },
    { id: '3', name: 'Mike Johnson', email: 'mike@example.com' },
    { id: '4', name: 'Emma Brown', email: 'emma@example.com' },
    { id: '5', name: 'David Lee', email: 'david@example.com' },
    { id: '6', name: 'Lisa Chen', email: 'lisa@example.com' },
  ];

  // Filter search results
  const filteredGroups = allGroups.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredUsers = allUsers.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <Text style={styles.groupName}>{group.name}</Text>
        <Text style={styles.groupStatus}>{group.status}</Text>
      </View>
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
            <TouchableOpacity 
              style={styles.addGroupButton}
              onPress={() => router.push('/create-group')}
            >
              <MaterialIcons name="person-add" size={24} color="#1F2937" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView 
          style={styles.content} 
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.settledUpHeader}>
            <Text style={styles.settledUpText}>You are all settled up!</Text>
            <TouchableOpacity style={styles.filterButton} onPress={() => setShowFilterModal(true)}>
              <MaterialIcons name="tune" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <View style={styles.groupsList}>
            {groups.map(renderGroupCard)}
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
        />
      </SafeAreaView>

      {/* Search Modal */}
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
                placeholder="Search groups and users..."
                placeholderTextColor="#6B7280"
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <MaterialIcons name="clear" size={20} color="#6B7280" />
                </TouchableOpacity>
              )}
            </View>

            <ScrollView style={styles.searchResults} showsVerticalScrollIndicator={false}>
              {searchQuery.length > 0 ? (
                <>
                  {/* Groups Section */}
                  {filteredGroups.length > 0 && (
                    <View style={styles.searchSection}>
                      <Text style={styles.searchSectionTitle}>Groups</Text>
                      {filteredGroups.map((group) => (
                        <TouchableOpacity key={group.id} style={styles.searchResultItem}>
                          <View style={styles.searchResultIcon}>
                            <MaterialCommunityIcons name="account-group" size={20} color="#FFFFFF" />
                          </View>
                          <View style={styles.searchResultContent}>
                            <Text style={styles.searchResultName}>{group.name}</Text>
                            <Text style={styles.searchResultSubtitle}>
                              {group.type.charAt(0).toUpperCase() + group.type.slice(1)} Group
                            </Text>
                          </View>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}

                  {/* Users Section */}
                  {filteredUsers.length > 0 && (
                    <View style={styles.searchSection}>
                      <Text style={styles.searchSectionTitle}>Users</Text>
                      {filteredUsers.map((user) => (
                        <TouchableOpacity key={user.id} style={styles.searchResultItem}>
                          <View style={styles.searchResultIcon}>
                            <MaterialIcons name="person" size={20} color="#FFFFFF" />
                          </View>
                          <View style={styles.searchResultContent}>
                            <Text style={styles.searchResultName}>{user.name}</Text>
                            <Text style={styles.searchResultSubtitle}>{user.email}</Text>
                          </View>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}

                  {/* No Results */}
                  {filteredGroups.length === 0 && filteredUsers.length === 0 && (
                    <View style={styles.noResultsContainer}>
                      <MaterialIcons name="search-off" size={40} color="#9CA3AF" />
                      <Text style={styles.noResultsText}>No results found</Text>
                      <Text style={styles.noResultsSubtext}>Try different keywords</Text>
                    </View>
                  )}
                </>
              ) : (
                <View style={styles.emptySearchContainer}>
                  <MaterialIcons name="search" size={40} color="#9CA3AF" />
                  <Text style={styles.emptySearchText}>Search for groups and users</Text>
                  <Text style={styles.emptySearchSubtext}>Start typing to see results</Text>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

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
              style={[
                styles.filterPopupOption,
                selectedFilter === 'all' && styles.filterPopupOptionSelected
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
                  color={selectedFilter === 'all' ? '#7C3AED' : '#6B7280'} 
                />
                <Text style={[
                  styles.filterPopupOptionText,
                  selectedFilter === 'all' && styles.filterPopupOptionTextSelected
                ]}>
                  All groups
                </Text>
              </View>
                {selectedFilter === 'all' && (
                  <MaterialIcons name="check" size={18} color="#7C3AED" />
                )}
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.filterPopupOption,
                selectedFilter === 'outstanding' && styles.filterPopupOptionSelected
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
                  color={selectedFilter === 'outstanding' ? '#7C3AED' : '#6B7280'} 
                />
                <Text style={[
                  styles.filterPopupOptionText,
                  selectedFilter === 'outstanding' && styles.filterPopupOptionTextSelected
                ]}>
                  Outstanding balances
                </Text>
              </View>
                {selectedFilter === 'outstanding' && (
                  <MaterialIcons name="check" size={18} color="#7C3AED" />
                )}
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.filterPopupOption,
                selectedFilter === 'owe' && styles.filterPopupOptionSelected
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
                  color={selectedFilter === 'owe' ? '#7C3AED' : '#6B7280'} 
                />
                <Text style={[
                  styles.filterPopupOptionText,
                  selectedFilter === 'owe' && styles.filterPopupOptionTextSelected
                ]}>
                  Groups you owe
                </Text>
              </View>
                {selectedFilter === 'owe' && (
                  <MaterialIcons name="check" size={18} color="#7C3AED" />
                )}
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.filterPopupOption,
                selectedFilter === 'owed' && styles.filterPopupOptionSelected
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
                  color={selectedFilter === 'owed' ? '#7C3AED' : '#6B7280'} 
                />
                <Text style={[
                  styles.filterPopupOptionText,
                  selectedFilter === 'owed' && styles.filterPopupOptionTextSelected
                ]}>
                  Groups that owe you
                </Text>
              </View>
                {selectedFilter === 'owed' && (
                  <MaterialIcons name="check" size={18} color="#7C3AED" />
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
  settledUpHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  settledUpText: {
    fontSize: 18,
    color: '#1F2937',
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
    color: '#1F2937',
    marginBottom: 2,
    fontFamily: 'Poppins_600SemiBold',
  },
  groupStatus: {
    fontSize: 14,
    color: '#6B7280',
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
    backgroundColor: '#ffffff',
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
  // Search Modal Styles
  searchModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
  searchResults: {
    maxHeight: 400,
    paddingHorizontal: 20,
  },
  searchSection: {
    marginBottom: 20,
  },
  searchSectionTitle: {
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 12,
    fontFamily: 'Montserrat_600SemiBold',
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchResultIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#7C3AED',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  searchResultContent: {
    flex: 1,
  },
  searchResultName: {
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 2,
    fontFamily: 'Poppins_500Medium',
  },
  searchResultSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Montserrat_400Regular',
  },
  noResultsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  noResultsText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 12,
    marginBottom: 4,
    fontFamily: 'Poppins_500Medium',
  },
  noResultsSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    fontFamily: 'Montserrat_400Regular',
  },
  emptySearchContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptySearchText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 12,
    marginBottom: 4,
    fontFamily: 'Poppins_500Medium',
  },
  emptySearchSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
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
    fontFamily: 'Poppins_500Medium',
  },
  filterPopupOptionTextSelected: {
    color: '#7C3AED',
    fontFamily: 'Poppins_600SemiBold',
  },
});
