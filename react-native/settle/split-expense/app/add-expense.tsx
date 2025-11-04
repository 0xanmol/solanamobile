import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import React, { useState, useEffect, useCallback } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getGroups, getGroup, Group, GroupMember } from '@/apis/groups';
import { getFriends, Friend } from '@/apis/friends';
import { createExpense, CreateExpenseData } from '@/apis/expenses';
import { Checkbox } from '@/components/common/Checkbox';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

interface SelectedItem {
  id: string;
  name: string;
  type: 'group' | 'friend';
  icon?: string;
  color?: string;
}

export default function AddExpenseScreen() {
  const router = useRouter();
  const { groupId } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('0.00');
  const [note, setNote] = useState('');

  // State for global expense
  const [withInput, setWithInput] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [selectedType, setSelectedType] = useState<'group' | 'friend' | null>(null);

  // State for group-context expense
  const [group, setGroup] = useState<Group | null>(null);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [paidBy, setPaidBy] = useState<string>('');

  // Common state
  const [allGroups, setAllGroups] = useState<Group[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const userJson = await AsyncStorage.getItem('user_data');
      const user = userJson ? JSON.parse(userJson) : null;
      setCurrentUser(user);

      // Set current user as default payer
      if (user) {
        setPaidBy(user.id);
      }

      if (groupId) {
        const groupResponse = await getGroup(groupId as string);
        if (groupResponse.success) {
          setGroup(groupResponse.data);
          // Pre-select all members including current user
          const allMemberIds = groupResponse.data.members?.map(m => m.id) || [];
          setSelectedMembers(allMemberIds);
        }
      } else {
        const groupsResponse = await getGroups();
        if (groupsResponse.success) {
          setAllGroups(groupsResponse.data);
        }
        const friendsResponse = await getFriends();
        if (friendsResponse.success) {
          setFriends(friendsResponse.data);
        }
      }
    } catch (error) {
      console.error("Error fetching initial data:", error);
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSave = async () => {
    if (!description) { alert('Please enter a description.'); return; }
    if (parseFloat(amount) <= 0) { alert('Please enter an amount greater than zero.'); return; }
    if (!currentUser) { alert('Could not identify user. Please log in again.'); return; }

    let expenseData: CreateExpenseData;

    if (groupId && group) {
      if (selectedMembers.length === 0) { alert('Please select at least one member to split with.'); return; }
      const share = parseFloat(amount) / selectedMembers.length;
      expenseData = {
        description,
        amount: parseFloat(amount),
        paidBy: paidBy,
        groupId: groupId as string,
        participants: selectedMembers.map(userId => ({ userId, share })),
        splitMethod: 'equally',
        notes: note,
      };
    } else {
      if (selectedItems.length === 0) { alert('Please select a group or at least one friend.'); return; }

      if (selectedType === 'group') {
        const selectedGroupId = selectedItems[0].id;
        const groupResponse = await getGroup(selectedGroupId);
        if (!groupResponse.success) {
          alert('Failed to get group details to create expense.');
          return;
        }
        const members = groupResponse.data.members;
        if (!members || members.length === 0) {
          alert('Cannot create an expense in an empty group.');
          return;
        }
        const share = parseFloat(amount) / members.length;
        expenseData = {
          description,
          amount: parseFloat(amount),
          paidBy: currentUser.id, // Always "you paid" in non-group context
          groupId: selectedGroupId,
          participants: members.map(member => ({ userId: member.id, share })),
          splitMethod: 'equally',
          notes: note,
        };
      } else { // friend
        const participantIds = [currentUser.id, ...selectedItems.map(item => item.id)];
        const share = parseFloat(amount) / participantIds.length;
        expenseData = {
          description,
          amount: parseFloat(amount),
          paidBy: currentUser.id, // Always "you paid" in non-group context
          participants: participantIds.map(userId => ({ userId, share })),
          splitMethod: 'equally',
          notes: note,
        };
      }
    }

    const result = await createExpense(expenseData);
    if (result.success) {
      router.back();
    } else {
      alert(`Failed to create expense: ${result.message}`);
    }
  };

  const handleToggleMember = (memberId: string) => {
    setSelectedMembers(prev => 
      prev.includes(memberId) ? prev.filter(id => id !== memberId) : [...prev, memberId]
    );
  };

  // --- Global Expense Functions ---
  const filteredGroups = allGroups.filter(g => g.name.toLowerCase().includes(withInput.toLowerCase()));
  const filteredFriends = friends.filter(f => f.name.toLowerCase().includes(withInput.toLowerCase()));
  const handleInputChange = (text: string) => { setWithInput(text); setShowDropdown(text.length > 0); };
  const handleSelectItem = (item: SelectedItem) => {
    if (selectedType === null) {
      setSelectedType(item.type);
      setSelectedItems([item]);
    } else if (selectedType === item.type) {
      if (item.type === 'friend') {
        if (!selectedItems.some(selected => selected.id === item.id)) {
          setSelectedItems([...selectedItems, item]);
        }
      } else {
        setSelectedItems([item]);
      }
    }
  };
  const handleRemoveItem = (itemId: string) => {
    const newItems = selectedItems.filter(item => item.id !== itemId);
    setSelectedItems(newItems);
    if (newItems.length === 0) setSelectedType(null);
  };
  const renderSelectedItem = (item: SelectedItem) => (
    <View key={item.id} style={[styles.selectedItem, { backgroundColor: colors.cardBackground }]}>
      <View style={[styles.selectedItemIcon, { backgroundColor: item.color || '#4B5563' }]}>
        <MaterialIcons name={item.type === 'group' ? 'group' : 'person'} size={16} color="#FFFFFF" />
      </View>
      <Text style={[styles.selectedItemText, { color: colors.text }]}>{item.name}</Text>
      <TouchableOpacity onPress={() => handleRemoveItem(item.id)} style={styles.removeButton}>
        <MaterialIcons name="close" size={16} color={colors.icon} />
      </TouchableOpacity>
    </View>
  );
  // --- End Global Expense Functions ---

  const renderHeader = () => (
    <View style={[styles.header, { borderBottomColor: colors.border }]}>
      <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
        <MaterialIcons name="arrow-back" size={24} color={colors.text} />
      </TouchableOpacity>
      <Text style={[styles.headerTitle, { color: colors.text }]}>Add expense</Text>
      <TouchableOpacity onPress={handleSave} style={styles.iconButton}>
        <MaterialIcons name="check" size={24} color={colors.text} />
      </TouchableOpacity>
    </View>
  );

  const renderCommonFields = () => (
    <>
      <View style={styles.fieldRow}>
        <View style={[styles.fieldIconBox, styles.tileCard, { backgroundColor: colors.background, borderColor: colors.border }]}><MaterialIcons name="receipt" size={24} color={colors.text} /></View>
        <View style={styles.fieldContent}>
          <TextInput style={[styles.textInput, { color: colors.text, borderBottomColor: colors.icon }]} value={description} onChangeText={setDescription} placeholder="Enter a description" placeholderTextColor={colors.icon} />
        </View>
      </View>
      <View style={styles.fieldRow}>
        <View style={[styles.fieldIconBox, styles.tileCard, { backgroundColor: colors.background, borderColor: colors.border }]}><Text style={[styles.currency, { color: colors.text }]}>$</Text></View>
        <View style={styles.fieldContent}>
          <TextInput style={[styles.textInput, styles.amountInput, { color: colors.text, borderBottomColor: colors.icon }]} value={amount} onChangeText={setAmount} keyboardType="decimal-pad" placeholder="0.00" placeholderTextColor={colors.icon} />
        </View>
      </View>
    </>
  );

  if (loading) {
    return <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}><ActivityIndicator size="large" color={colors.tint} /></View>;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      {renderHeader()}
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          {groupId && group ? (
            // --- Group Context UI ---
            <>
              <View style={styles.groupContextHeader}>
                <Text style={[styles.withLabel, { color: colors.text }]}>Expense in <Text style={styles.withBold}>{group.name}</Text></Text>
              </View>
              {renderCommonFields()}

              {/* Who Paid Selector */}
              <View style={styles.paidByContainer}>
                <Text style={[styles.paidByHeader, { color: colors.text }]}>Paid by</Text>
                {group.members?.map(member => (
                  <TouchableOpacity
                    key={member.id}
                    style={styles.paidByItem}
                    onPress={() => setPaidBy(member.id)}
                  >
                    <View style={[styles.radioButton, { borderColor: paidBy === member.id ? colors.tint : colors.border }]}>
                      {paidBy === member.id && <View style={[styles.radioButtonInner, { backgroundColor: colors.tint }]} />}
                    </View>
                    <Text style={[styles.paidByName, { color: colors.text }]}>
                      {member.id === currentUser?.id ? 'You' : member.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.participantsContainer}>
                <Text style={[styles.participantsHeader, { color: colors.text }]}>Split between</Text>
                {group.members?.map(member => (
                  <View key={member.id} style={styles.participantItem}>
                    <Checkbox
                      checked={selectedMembers.includes(member.id)}
                      onPress={() => handleToggleMember(member.id)}
                    />
                    <TouchableOpacity
                      style={styles.participantNameContainer}
                      onPress={() => handleToggleMember(member.id)}
                    >
                      <Text style={[styles.participantName, { color: colors.text }]}>{member.name}</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </>
          ) : (
            // --- Global Context UI ---
            <>
              <View style={[styles.withRow, { borderColor: colors.border }]}>
                <Text style={[styles.withLabel, { color: colors.text }]}>With <Text style={styles.withBold}>you</Text> and:</Text>
                <View style={styles.withInputContainer}>
                  {selectedItems.length > 0 && <View style={styles.selectedItemsContainer}>{selectedItems.map(renderSelectedItem)}</View>}
                  <TextInput
                    style={[styles.withInput, { color: colors.text }, selectedItems.length > 0 && styles.withInputWithSelection]}
                    placeholder={selectedItems.length === 0 ? "Enter names or groups" : ""}
                    placeholderTextColor={colors.icon}
                    value={withInput}
                    onChangeText={handleInputChange}
                    onFocus={() => setShowDropdown(withInput.length > 0)}
                    onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                  />
                </View>
              </View>
              {showDropdown && (
                <View style={[styles.dropdown, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
                  {filteredGroups.length > 0 && <View style={[styles.dropdownSection, { borderBottomColor: colors.border }]}><Text style={[styles.dropdownSectionTitle, { color: colors.icon, backgroundColor: colors.background }]}>Groups</Text>{filteredGroups.map(g => (<TouchableOpacity key={g.id} style={styles.dropdownItem} onPress={() => handleSelectItem({ ...g, type: 'group' })}><View style={[styles.dropdownItemIcon, { backgroundColor: g.color || '#4B5563' }]}><MaterialIcons name="group" size={20} color="#FFFFFF" /></View><Text style={[styles.dropdownItemText, { color: colors.text }]}>{g.name}</Text></TouchableOpacity>))}</View>}
                  {filteredFriends.length > 0 && <View style={[styles.dropdownSection, { borderBottomColor: colors.border }]}><Text style={[styles.dropdownSectionTitle, { color: colors.icon, backgroundColor: colors.background }]}>Friends</Text>{filteredFriends.map(f => (<TouchableOpacity key={f.id} style={styles.dropdownItem} onPress={() => handleSelectItem({ ...f, type: 'friend' })}><View style={[styles.dropdownItemIcon, { backgroundColor: f.color || '#3B82F6' }]}><MaterialIcons name="person" size={20} color="#FFFFFF" /></View><Text style={[styles.dropdownItemText, { color: colors.text }]}>{f.name}</Text></TouchableOpacity>))}</View>}
                </View>
              )}
              {renderCommonFields()}

              {/* Paid by You - Non-group context */}
              <View style={styles.paidByContainer}>
                <Text style={[styles.paidByHeader, { color: colors.text }]}>Paid by</Text>
                <View style={styles.paidByItem}>
                  <View style={[styles.radioButton, styles.radioButtonSelected, { borderColor: colors.tint }]}>
                    <View style={[styles.radioButtonInner, { backgroundColor: colors.tint }]} />
                  </View>
                  <Text style={[styles.paidByName, { color: colors.text }]}>You</Text>
                </View>
              </View>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1 },
  headerTitle: { fontSize: 24, fontFamily: 'Montserrat_600SemiBold' },
  iconButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  content: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 120 },
  withRow: { paddingVertical: 16, borderWidth: 1, borderRadius: 12, paddingHorizontal: 16, marginBottom: 20 },
  withLabel: { fontSize: 18, marginRight: 8, marginBottom: 8 },
  withBold: { fontFamily: 'Poppins_600SemiBold' },
  withInputContainer: { flex: 1 },
  withInput: { fontSize: 16, minHeight: 24 },
  withInputWithSelection: { minHeight: 40 },
  selectedItemsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  selectedItem: { flexDirection: 'row', alignItems: 'center', borderRadius: 16, paddingHorizontal: 8, paddingVertical: 4, gap: 6 },
  selectedItemIcon: { width: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  selectedItemText: { fontSize: 14, fontFamily: 'Poppins_500Medium' },
  removeButton: { width: 16, height: 16, alignItems: 'center', justifyContent: 'center' },
  dropdown: { borderRadius: 12, borderWidth: 1, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 5, marginBottom: 20, maxHeight: 300 },
  dropdownSection: { borderBottomWidth: 1 },
  dropdownSectionTitle: { fontSize: 14, paddingHorizontal: 16, paddingVertical: 8, fontFamily: 'Montserrat_600SemiBold' },
  dropdownItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, gap: 12 },
  dropdownItemIcon: { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  dropdownItemText: { flex: 1, fontSize: 16, fontFamily: 'Poppins_500Medium' },
  fieldRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  fieldIconBox: { width: 56, height: 56, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  tileCard: { borderWidth: 1, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  fieldContent: { flex: 1 },
  textInput: { fontSize: 20, borderBottomWidth: 1, paddingBottom: 8 },
  amountInput: { fontSize: 40, fontFamily: 'Poppins_600SemiBold' },
  currency: { fontSize: 24, fontFamily: 'Poppins_600SemiBold' },
  groupContextHeader: { marginBottom: 20 },
  paidByContainer: { marginTop: 20, marginBottom: 20 },
  paidByHeader: { fontSize: 16, fontFamily: 'Poppins_600SemiBold', marginBottom: 12 },
  paidByItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, gap: 12 },
  paidByName: { fontSize: 16, fontFamily: 'Poppins_500Medium' },
  radioButton: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  radioButtonSelected: {},
  radioButtonInner: { width: 10, height: 10, borderRadius: 5 },
  participantsContainer: { marginTop: 20 },
  participantsHeader: { fontSize: 16, fontFamily: 'Poppins_600SemiBold', marginBottom: 8 },
  participantItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, gap: 12 },
  participantNameContainer: { flex: 1 },
  participantName: { fontSize: 16 },
});