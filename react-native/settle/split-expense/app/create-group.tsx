import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { createGroup, CreateGroupData } from '../apis/groups';

type GroupType = 'trip' | 'home' | 'couple' | 'other';

export default function CreateGroupScreen() {
  const router = useRouter();
  const [groupName, setGroupName] = useState('');
  const [selectedType, setSelectedType] = useState<GroupType>('trip');
  const [addTripDates, setAddTripDates] = useState(true);
  const [startDate, setStartDate] = useState('Today');
  const [endDate, setEndDate] = useState('');
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [startDateValue, setStartDateValue] = useState(new Date());
  const [endDateValue, setEndDateValue] = useState(new Date());

  const handleDone = async () => {
    if (!groupName.trim()) {
      alert('Please enter a group name.');
      return;
    }

    const groupData: CreateGroupData = {
      name: groupName,
      type: selectedType,
    };

    if (selectedType === 'trip' && addTripDates) {
      groupData.startDate = startDateValue.toISOString();
      if (endDate) {
        groupData.endDate = endDateValue.toISOString();
      }
    }

    try {
      const result = await createGroup(groupData);
      if (result.success) {
        router.back();
      } else {
        console.error('Failed to create group:', result.message);
        alert(`Error: ${result.message || 'An unknown error occurred.'}`);
      }
    } catch (error) {
      console.error('An error occurred during group creation:', error);
      alert('An unexpected error occurred. Please try again.');
    }
  };

  const handleBack = () => {
    router.back();
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const handleStartDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      if (event.type === 'set' && selectedDate) {
        setStartDateValue(selectedDate);
        setStartDate(formatDate(selectedDate));
        setShowStartDatePicker(false);
      } else if (event.type === 'dismissed') {
        setShowStartDatePicker(false);
      } else if (selectedDate) {
        setStartDateValue(selectedDate);
      }
    } else {
      if (selectedDate) {
        setStartDateValue(selectedDate);
      }
      if (event.type === 'dismissed') {
        setShowStartDatePicker(false);
      }
    }
  };

  const handleStartDateConfirm = () => {
    setStartDate(formatDate(startDateValue));
    setShowStartDatePicker(false);
  };

  const handleEndDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      if (event.type === 'set' && selectedDate) {
        setEndDateValue(selectedDate);
        setEndDate(formatDate(selectedDate));
        setShowEndDatePicker(false);
      } else if (event.type === 'dismissed') {
        setShowEndDatePicker(false);
      } else if (selectedDate) {
        setEndDateValue(selectedDate);
      }
    } else {
      if (selectedDate) {
        setEndDateValue(selectedDate);
      }
      if (event.type === 'dismissed') {
        setShowEndDatePicker(false);
      }
    }
  };

  const handleEndDateConfirm = () => {
    setEndDate(formatDate(endDateValue));
    setShowEndDatePicker(false);
  };

  const groupTypes = [
    {
      key: 'trip' as GroupType,
      label: 'Trip',
      icon: <MaterialIcons name="flight" size={24} color={selectedType === 'trip' ? "#16A34A" : "#6B7280"} />,
    },
    {
      key: 'home' as GroupType,
      label: 'Home',
      icon: <MaterialIcons name="home" size={24} color={selectedType === 'home' ? "#16A34A" : "#6B7280"} />,
    },
    {
      key: 'couple' as GroupType,
      label: 'Couple',
      icon: <MaterialIcons name="favorite" size={24} color={selectedType === 'couple' ? "#16A34A" : "#6B7280"} />,
    },
    {
      key: 'other' as GroupType,
      label: 'Other',
      icon: <MaterialIcons name="list" size={24} color={selectedType === 'other' ? "#16A34A" : "#6B7280"} />,
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.closeButton}>
          <Text style={styles.closeIcon}>×</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter} pointerEvents="none">
          <Text style={styles.headerTitle}>Create a group</Text>
        </View>
        <TouchableOpacity onPress={handleDone} style={styles.doneButton}>
          <Text style={styles.doneText}>Done</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Group Name Section */}
        <View style={styles.section}>
          <View style={styles.groupNameRow}>
            <View style={styles.groupImagePlaceholder}>
              <MaterialIcons name="camera-alt" size={28} color="#6B7280" />
              <View style={styles.plusIcon}>
                <MaterialIcons name="add" size={18} color="#FFFFFF" />
              </View>
            </View>
            <View style={styles.groupNameContainer}>
              <Text style={styles.groupNameLabel}>Group name</Text>
              <TextInput
                style={styles.groupNameInput}
                placeholder="Enter group name"
                value={groupName}
                onChangeText={setGroupName}
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>
        </View>

        {/* Group Type Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Type</Text>
          <View style={styles.groupTypesRow}>
            {groupTypes.map((type) => (
              <TouchableOpacity
                key={type.key}
                style={[
                  styles.groupTypeButton,
                  selectedType === type.key && styles.groupTypeButtonSelected,
                ]}
                onPress={() => setSelectedType(type.key)}
              >
                <View style={styles.groupTypeIcon}>
                  {type.icon}
                </View>
                <Text style={[
                  styles.groupTypeLabel,
                  selectedType === type.key && styles.groupTypeLabelSelected,
                ]}>
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Trip Dates Section - Only show for trip type */}
        {selectedType === 'trip' && (
          <View style={styles.section}>
            <View style={styles.tripDatesHeader}>
              <Text style={styles.sectionLabel}>Add trip dates</Text>
              <Switch
                value={addTripDates}
                onValueChange={setAddTripDates}
                trackColor={{ false: '#E5E7EB', true: '#16A34A' }}
                thumbColor="#FFFFFF"
              />
            </View>
            <Text style={styles.tripDatesDescription}>
              Splitwise will remind friends to join, add expenses, and settle up.
            </Text>
            
            {addTripDates && (
              <View style={styles.dateInputsContainer}>
                <View style={styles.dateInputRow}>
                  <Text style={styles.dateLabel}>Start</Text>
                  <View style={styles.dateInputContainer}>
                    <Text style={styles.dateInput}>{startDate}</Text>
                    <TouchableOpacity 
                      onPress={() => {
                        console.log('Start date picker pressed');
                        setShowStartDatePicker(true);
                      }}
                      style={{ padding: 8 }}
                    >
                      <MaterialIcons name="event" size={20} color="#6B7280" />
                    </TouchableOpacity>
                  </View>
                </View>
                
                <View style={styles.dateInputRow}>
                  <Text style={styles.dateLabel}>End</Text>
                  <View style={styles.dateInputContainer}>
                    <Text style={styles.dateInput}>{endDate || 'Select end date'}</Text>
                    <TouchableOpacity 
                      onPress={() => {
                        console.log('End date picker pressed');
                        setShowEndDatePicker(true);
                      }}
                      style={{ padding: 8 }}
                    >
                      <MaterialIcons name="event" size={20} color="#6B7280" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Date Pickers */}
      {Platform.OS === 'ios' && showStartDatePicker && (
        <Modal
          visible={showStartDatePicker}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowStartDatePicker(false)}
        >
          <View style={styles.datePickerModal}>
            <View style={styles.datePickerContainer}>
              <View style={styles.datePickerHeader}>
                <TouchableOpacity onPress={() => setShowStartDatePicker(false)}>
                  <Text style={styles.datePickerCancel}>Cancel</Text>
                </TouchableOpacity>
                <Text style={styles.datePickerTitle}>Select Start Date</Text>
                <TouchableOpacity onPress={handleStartDateConfirm}>
                  <Text style={styles.datePickerDone}>Done</Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                key="start-date-picker"
                value={startDateValue}
                mode="date"
                display="spinner"
                onChange={handleStartDateChange}
              />
            </View>
          </View>
        </Modal>
      )}

      {Platform.OS === 'android' && showStartDatePicker && (
        <DateTimePicker
          key="start-date-picker-android"
          value={startDateValue}
          mode="date"
          display="calendar"
          onChange={handleStartDateChange}
        />
      )}

      {Platform.OS === 'ios' && showEndDatePicker && (
        <Modal
          visible={showEndDatePicker}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowEndDatePicker(false)}
        >
          <View style={styles.datePickerModal}>
            <View style={styles.datePickerContainer}>
              <View style={styles.datePickerHeader}>
                <TouchableOpacity onPress={() => setShowEndDatePicker(false)}>
                  <Text style={styles.datePickerCancel}>Cancel</Text>
                </TouchableOpacity>
                <Text style={styles.datePickerTitle}>Select End Date</Text>
                <TouchableOpacity onPress={handleEndDateConfirm}>
                  <Text style={styles.datePickerDone}>Done</Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                key="end-date-picker"
                value={endDateValue}
                mode="date"
                display="spinner"
                onChange={handleEndDateChange}
              />
            </View>
          </View>
        </Modal>
      )}

      {Platform.OS === 'android' && showEndDatePicker && (
        <DateTimePicker
          key="end-date-picker-android"
          value={endDateValue}
          mode="date"
          display="calendar"
          onChange={handleEndDateChange}
        />
      )}
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerCenter: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  closeButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    fontSize: 24,
    color: '#1F2937',
    fontWeight: '400',
  },
  headerTitle: {
    fontSize: 18,
    color: '#1F2937',
    fontFamily: 'Montserrat_600SemiBold',
  },
  doneButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  doneText: {
    fontSize: 16,
    color: '#7C3AED',
    fontFamily: 'Poppins_600SemiBold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginTop: 20,
  },
  groupNameRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  groupImagePlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  plusIcon: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#7C3AED',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  groupNameContainer: {
    flex: 1,
    paddingTop: 4,
  },
  groupNameLabel: {
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 8,
    fontFamily: 'Poppins_500Medium',
  },
  groupNameInput: {
    fontSize: 16,
    color: '#1F2937',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 8,
    paddingTop: 2,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 12,
  },
  groupTypesRow: {
    flexDirection: 'row',
    gap: 12,
  },
  groupTypeButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    minHeight: 72,
    maxWidth: 80,
  },
  groupTypeButtonSelected: {
    backgroundColor: '#D6F5EF',
    borderColor: '#16A34A',
    borderWidth: 2,
  },
  groupTypeIcon: {
    marginBottom: 8,
  },
  groupTypeLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  groupTypeLabelSelected: {
    color: '#16A34A',
    fontWeight: '600',
  },
  tripDatesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  tripDatesDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  dateInputsContainer: {
    gap: 16,
  },
  dateInputRow: {
    gap: 8,
  },
  dateLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
    paddingBottom: 8,
    paddingTop: 2,
  },
  dateInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    paddingVertical: 2,
  },
  datePickerModal: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  datePickerContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 34,
  },
  datePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  datePickerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  datePickerCancel: {
    fontSize: 16,
    color: '#6B7280',
  },
  datePickerDone: {
    fontSize: 16,
    color: '#7C3AED',
    fontWeight: '600',
  },
});
