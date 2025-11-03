import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface SelectedItem {
  id: string;
  name: string;
  type: 'group' | 'friend';
  icon?: string;
  color?: string;
}

export default function AddExpenseScreen() {
  const router = useRouter();
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('0.00');
  const [withInput, setWithInput] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [selectedType, setSelectedType] = useState<'group' | 'friend' | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [note, setNote] = useState('');
  const [showDateModal, setShowDateModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showPaidByModal, setShowPaidByModal] = useState(false);
  const [paidBy, setPaidBy] = useState('you');

  const groups = [
    { id: '1', name: 'Jje', icon: 'home', color: '#781D27' },
    { id: '2', name: 'Uu3uu', icon: 'list', color: '#781D27' },
    { id: '3', name: 'Weekend Trip', icon: 'flight', color: '#16A34A' },
  ];

  const friends = [
    { id: '1', name: 'Aarav', icon: 'person', color: '#3B82F6' },
    { id: '2', name: 'Sarah', icon: 'person', color: '#EF4444' },
    { id: '3', name: 'Mike', icon: 'person', color: '#10B981' },
  ];

  // All possible people who can pay (including "you")
  const allPeople = [
    { id: 'you', name: 'you', icon: 'person', color: '#7C3AED' },
    ...friends,
  ];

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(withInput.toLowerCase())
  );

  const filteredFriends = friends.filter(friend =>
    friend.name.toLowerCase().includes(withInput.toLowerCase())
  );

  const handleInputChange = (text: string) => {
    setWithInput(text);
    setShowDropdown(text.length > 0);
  };

  const handleSelectItem = (item: SelectedItem) => {
    if (selectedType === null) {
      // First selection - set the type
      setSelectedType(item.type);
      setSelectedItems([item]);
    } else if (selectedType === item.type) {
      // Same type - can select multiple friends or replace group
      if (item.type === 'friend') {
        const isAlreadySelected = selectedItems.some(selected => selected.id === item.id);
        if (!isAlreadySelected) {
          setSelectedItems([...selectedItems, item]);
        }
      } else {
        // For groups, replace the current selection
        setSelectedItems([item]);
      }
    }
    // Different type - ignore (can't mix groups and friends)
  };

  const handleRemoveItem = (itemId: string) => {
    const newItems = selectedItems.filter(item => item.id !== itemId);
    setSelectedItems(newItems);
    if (newItems.length === 0) {
      setSelectedType(null);
    }
  };

  const renderSelectedItem = (item: SelectedItem) => (
    <View key={item.id} style={styles.selectedItem}>
      <View style={[styles.selectedItemIcon, { backgroundColor: item.color }]}>
        <MaterialIcons name={item.icon as any} size={16} color="#FFFFFF" />
      </View>
      <Text style={styles.selectedItemText}>{item.name}</Text>
      <TouchableOpacity onPress={() => handleRemoveItem(item.id)} style={styles.removeButton}>
        <MaterialIcons name="close" size={16} color="#6B7280" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
          <MaterialIcons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add expense</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
          <MaterialIcons name="check" size={24} color="#1F2937" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.withRow}>
            <Text style={styles.withLabel}>
              With <Text style={styles.withBold}>you</Text> and:
            </Text>
            <View style={styles.withInputContainer}>
              {selectedItems.length > 0 && (
                <View style={styles.selectedItemsContainer}>
                  {selectedItems.map(renderSelectedItem)}
                </View>
              )}
              <TextInput
                style={[styles.withInput, selectedItems.length > 0 && styles.withInputWithSelection]}
                placeholder={selectedItems.length === 0 ? "Enter names, emails, or phone numbers" : ""}
                placeholderTextColor="#9CA3AF"
                value={withInput}
                onChangeText={handleInputChange}
                onFocus={() => setShowDropdown(withInput.length > 0)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
              />
            </View>
          </View>

          {showDropdown && (
            <View style={styles.dropdown}>
              {filteredGroups.length > 0 && (
                <View style={styles.dropdownSection}>
                  <Text style={styles.dropdownSectionTitle}>Groups</Text>
                  {filteredGroups.map((group) => (
                    <TouchableOpacity
                      key={group.id}
                      style={[
                        styles.dropdownItem,
                        selectedItems.some(item => item.id === group.id) && styles.dropdownItemSelected
                      ]}
                      onPress={() => handleSelectItem(group)}
                    >
                      <View style={[styles.dropdownItemIcon, { backgroundColor: group.color }]}>
                        <MaterialIcons name={group.icon as any} size={20} color="#FFFFFF" />
                      </View>
                      <Text style={styles.dropdownItemText}>{group.name}</Text>
                      {selectedItems.some(item => item.id === group.id) && (
                        <MaterialIcons name="check" size={20} color="#16A34A" />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {filteredFriends.length > 0 && (
                <View style={styles.dropdownSection}>
                  <Text style={styles.dropdownSectionTitle}>Friends</Text>
                  {filteredFriends.map((friend) => (
                    <TouchableOpacity
                      key={friend.id}
                      style={[
                        styles.dropdownItem,
                        selectedItems.some(item => item.id === friend.id) && styles.dropdownItemSelected
                      ]}
                      onPress={() => handleSelectItem(friend)}
                    >
                      <View style={[styles.dropdownItemIcon, { backgroundColor: friend.color }]}>
                        <MaterialIcons name={friend.icon as any} size={20} color="#FFFFFF" />
                      </View>
                      <Text style={styles.dropdownItemText}>{friend.name}</Text>
                      {selectedItems.some(item => item.id === friend.id) && (
                        <MaterialIcons name="check" size={20} color="#16A34A" />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {filteredGroups.length === 0 && filteredFriends.length === 0 && (
                <View style={styles.noResults}>
                  <Text style={styles.noResultsText}>No results found</Text>
                </View>
              )}
            </View>
          )}

          <View style={styles.fieldRow}>
            <View style={[styles.fieldIconBox, styles.tileCard]}>
              <MaterialIcons name="receipt" size={24} color="#1F2937" />
            </View>
            <View style={styles.fieldContent}>
              <TextInput
                style={styles.textInput}
                value={description}
                onChangeText={setDescription}
                placeholder="Enter a description"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          <View style={styles.fieldRow}>
            <View style={[styles.fieldIconBox, styles.tileCard]}>
              <Text style={styles.currency}>$</Text>
            </View>
            <View style={styles.fieldContent}>
              <TextInput
                style={[styles.textInput, styles.amountInput]}
                value={amount}
                onChangeText={(text) => {
                  // Only allow numbers, decimal point, and backspace
                  const cleanText = text.replace(/[^0-9.]/g, '');
                  // Only allow one decimal point
                  const parts = cleanText.split('.');
                  if (parts.length > 2) {
                    setAmount(parts[0] + '.' + parts.slice(1).join(''));
                  } else {
                    setAmount(cleanText);
                  }
                }}
                keyboardType="decimal-pad"
                placeholder="0.00"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          <View style={styles.pillRow}>
            <Text style={styles.pillLabel}>Paid by</Text>
            <TouchableOpacity 
              style={[styles.pill, styles.pillSelected]}
              onPress={() => setShowPaidByModal(true)}
            >
              <Text style={styles.pillText}>{paidBy}</Text>
            </TouchableOpacity>
            <Text style={styles.pillLabel}>and split</Text>
            <TouchableOpacity 
              style={[styles.pill, styles.pillSelected]}
              onPress={() => router.push('/adjust-split')}
            >
              <Text style={styles.pillText}>equally</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <View style={styles.quickActionsBar}>
          <TouchableOpacity 
            style={styles.quickIconBox}
            onPress={() => setShowDateModal(true)}
          >
            <MaterialIcons name="event" size={22} color="#0EA5E9" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.quickIconBox}
            onPress={() => setShowNoteModal(true)}
          >
            <MaterialIcons name="edit" size={22} color="#10B981" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Date Picker Modal */}
      <Modal
        visible={showDateModal}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setShowDateModal(false)}>
                <Text style={styles.modalCancel}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Select Date</Text>
              <TouchableOpacity onPress={() => setShowDateModal(false)}>
                <Text style={styles.modalDone}>Done</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.datePickerContent}>
              <TextInput
                style={styles.dateInput}
                placeholder="Enter date (e.g., Dec 25, 2024)"
                value={selectedDate}
                onChangeText={setSelectedDate}
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Note Modal */}
      <Modal
        visible={showNoteModal}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setShowNoteModal(false)}>
                <Text style={styles.modalCancel}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Add Note</Text>
              <TouchableOpacity onPress={() => setShowNoteModal(false)}>
                <Text style={styles.modalDone}>Done</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.noteContent}>
              <TextInput
                style={styles.noteInput}
                placeholder="Enter any note about this expense..."
                value={note}
                onChangeText={setNote}
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={4}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Paid By Selection Modal */}
      <Modal
        visible={showPaidByModal}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.modalBackdrop} 
            activeOpacity={1}
            onPress={() => setShowPaidByModal(false)}
          />
          <View style={styles.paidByModalContainer}>
            <View style={styles.paidByHeader}>
              <Text style={styles.paidByTitle}>Who paid?</Text>
              <TouchableOpacity 
                onPress={() => setShowPaidByModal(false)}
                style={styles.closeButton}
              >
                <MaterialIcons name="close" size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>
            <View style={styles.paidByList}>
              {allPeople.map((person, index) => (
                <TouchableOpacity
                  key={person.id}
                  style={[
                    styles.paidByItem,
                    paidBy === person.name && styles.paidByItemSelected,
                    index === allPeople.length - 1 && styles.paidByItemLast
                  ]}
                  onPress={() => {
                    setPaidBy(person.name);
                    setShowPaidByModal(false);
                  }}
                >
                  <View style={[styles.paidByAvatar, { backgroundColor: person.color }]}>
                    <Text style={styles.paidByAvatarText}>
                      {person.name === 'you' ? 'Y' : person.name.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <Text style={[
                    styles.paidByName,
                    paidBy === person.name && styles.paidByNameSelected
                  ]}>
                    {person.name}
                  </Text>
                  {paidBy === person.name && (
                    <View style={styles.selectedIndicator}>
                      <MaterialIcons name="check-circle" size={20} color="#7C3AED" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerTitle: { fontSize: 24, color: '#1F2937', fontFamily: 'Montserrat_600SemiBold' },
  iconButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  content: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 120 },
  withRow: {
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  withLabel: { fontSize: 18, color: '#1F2937', marginRight: 8, marginBottom: 8 },
  withBold: { fontFamily: 'Poppins_600SemiBold' },
  withInputContainer: { flex: 1 },
  withInput: { fontSize: 16, color: '#1F2937', minHeight: 24 },
  withInputWithSelection: { minHeight: 40 },
  selectedItemsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  selectedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 6,
  },
  selectedItemIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedItemText: {
    fontSize: 14,
    color: '#1F2937',
    fontFamily: 'Poppins_500Medium',
  },
  removeButton: {
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropdown: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
    marginBottom: 20,
    maxHeight: 300,
  },
  dropdownSection: {
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  dropdownSectionTitle: {
    fontSize: 14,
    color: '#6B7280',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F9FAFB',
    fontFamily: 'Montserrat_600SemiBold',
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  dropdownItemSelected: {
    backgroundColor: '#F0FDF4',
  },
  dropdownItemIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropdownItemText: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    fontFamily: 'Poppins_500Medium',
  },
  noResults: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 16,
    color: '#6B7280',
    fontFamily: 'Montserrat_400Regular',
  },
  fieldRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  fieldIconBox: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  tileCard: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  fieldContent: { flex: 1 },
  textInput: {
    fontSize: 20,
    color: '#1F2937',
    borderBottomWidth: 1,
    borderBottomColor: '#9CA3AF',
    paddingBottom: 8,
  },
  amountInput: { fontSize: 40, fontFamily: 'Poppins_600SemiBold' },
  currency: { fontSize: 24, color: '#1F2937', fontFamily: 'Poppins_600SemiBold' },
  pillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 16,
    marginBottom: 20,
  },
  pillLabel: { fontSize: 16, color: '#1F2937', fontFamily: 'Montserrat_400Regular' },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  pillSelected: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  pillText: { fontSize: 16, color: '#1F2937', fontFamily: 'Poppins_600SemiBold' },
  quickActionsBar: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    flexDirection: 'row',
    gap: 12,
  },
  quickIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 34,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    color: '#1F2937',
    fontFamily: 'Montserrat_600SemiBold',
  },
  modalCancel: {
    fontSize: 16,
    color: '#6B7280',
  },
  modalDone: {
    fontSize: 16,
    color: '#7C3AED',
    fontFamily: 'Poppins_600SemiBold',
  },
  datePickerContent: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  dateInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  noteContent: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  noteInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F2937',
    textAlignVertical: 'top',
    minHeight: 100,
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  paidByModalContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: -4 },
    elevation: 20,
  },
  paidByHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  paidByTitle: {
    fontSize: 20,
    color: '#0F172A',
    letterSpacing: -0.5,
    fontFamily: 'Montserrat_600SemiBold',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paidByList: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  paidByItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginBottom: 4,
  },
  paidByItemSelected: {
    backgroundColor: '#F0F4FF',
  },
  paidByItemLast: {
    marginBottom: 0,
  },
  paidByAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  paidByAvatarText: {
    fontSize: 16,
    color: '#FFFFFF',
    letterSpacing: 0.5,
    fontFamily: 'Poppins_600SemiBold',
  },
  paidByName: {
    flex: 1,
    fontSize: 17,
    color: '#334155',
    letterSpacing: -0.2,
    fontFamily: 'Poppins_500Medium',
  },
  paidByNameSelected: {
    color: '#7C3AED',
    fontFamily: 'Poppins_600SemiBold',
  },
  selectedIndicator: {
    marginLeft: 8,
  },
});


