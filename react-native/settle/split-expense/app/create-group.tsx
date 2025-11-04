import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
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
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import Toast from 'react-native-toast-message';

import { createGroup, CreateGroupData } from '../apis/groups';

type GroupType = 'trip' | 'home' | 'couple' | 'other';

export default function CreateGroupScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [groupName, setGroupName] = useState('');
  const [selectedType, setSelectedType] = useState<GroupType>('trip');
  const [addTripDates, setAddTripDates] = useState(true);
  const [startDate, setStartDate] = useState('Today');
  const [endDate, setEndDate] = useState('');
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [startDateValue, setStartDateValue] = useState(new Date());
  const [endDateValue, setEndDateValue] = useState(new Date());
  const [isCreating, setIsCreating] = useState(false);

  const handleDone = async () => {
    if (!groupName.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter a group name',
      });
      return;
    }

    if (selectedType === 'trip' && addTripDates && endDate && endDateValue < startDateValue) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'End date must be after start date',
      });
      return;
    }

    setIsCreating(true);

    const groupData: CreateGroupData = {
      name: groupName.trim(),
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
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Group created successfully',
        });
        router.back();
      } else {
        console.error('Failed to create group:', result.message);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: result.message || 'Failed to create group',
        });
      }
    } catch (error) {
      console.error('An error occurred during group creation:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setIsCreating(false);
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
      icon: <MaterialIcons name="flight" size={24} color={selectedType === 'trip' ? colors.success : colors.icon} />,
    },
    {
      key: 'home' as GroupType,
      label: 'Home',
      icon: <MaterialIcons name="home" size={24} color={selectedType === 'home' ? colors.success : colors.icon} />,
    },
    {
      key: 'couple' as GroupType,
      label: 'Couple',
      icon: <MaterialIcons name="favorite" size={24} color={selectedType === 'couple' ? colors.success : colors.icon} />,
    },
    {
      key: 'other' as GroupType,
      label: 'Other',
      icon: <MaterialIcons name="list" size={24} color={selectedType === 'other' ? colors.success : colors.icon} />,
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={handleBack} style={styles.closeButton}>
          <Text style={[styles.closeIcon, { color: colors.text }]}>×</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter} pointerEvents="none">
          <Text style={[styles.headerTitle, { color: colors.text }]}>Create a group</Text>
        </View>
        <TouchableOpacity
          onPress={handleDone}
          style={styles.doneButton}
          disabled={isCreating}
        >
          {isCreating ? (
            <ActivityIndicator size="small" color={colors.tint} />
          ) : (
            <Text style={[styles.doneText, { color: colors.tint }]}>Done</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Group Name Section */}
        <View style={styles.section}>
          <View style={styles.groupNameRow}>
            <View style={[styles.groupImagePlaceholder, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
              <MaterialIcons name="camera-alt" size={28} color={colors.icon} />
              <View style={[styles.plusIcon, { backgroundColor: colors.tint, borderColor: colors.background }]}>
                <MaterialIcons name="add" size={18} color="#FFFFFF" />
              </View>
            </View>
            <View style={styles.groupNameContainer}>
              <Text style={[styles.groupNameLabel, { color: colors.text }]}>Group name</Text>
              <TextInput
                style={[styles.groupNameInput, { color: colors.text, borderBottomColor: colors.border }]}
                placeholder="Enter group name"
                value={groupName}
                onChangeText={setGroupName}
                placeholderTextColor={colors.icon}
              />
            </View>
          </View>
        </View>

        {/* Group Type Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: colors.text }]}>Type</Text>
          <View style={styles.groupTypesRow}>
            {groupTypes.map((type) => (
              <TouchableOpacity
                key={type.key}
                style={[
                  styles.groupTypeButton,
                  { borderColor: colors.border, backgroundColor: colors.background },
                  selectedType === type.key && { backgroundColor: '#D6F5EF', borderColor: colors.success, borderWidth: 2 },
                ]}
                onPress={() => setSelectedType(type.key)}
              >
                <View style={styles.groupTypeIcon}>
                  {type.icon}
                </View>
                <Text style={[
                  styles.groupTypeLabel,
                  { color: colors.icon },
                  selectedType === type.key && { color: colors.success, fontWeight: '600' },
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
              <Text style={[styles.sectionLabel, { color: colors.text }]}>Add trip dates</Text>
              <Switch
                value={addTripDates}
                onValueChange={setAddTripDates}
                trackColor={{ false: colors.border, true: colors.success }}
                thumbColor="#FFFFFF"
              />
            </View>
            <Text style={[styles.tripDatesDescription, { color: colors.icon }]}>
              Splitwise will remind friends to join, add expenses, and settle up.
            </Text>

            {addTripDates && (
              <View style={styles.dateInputsContainer}>
                <View style={styles.dateInputRow}>
                  <Text style={[styles.dateLabel, { color: colors.text }]}>Start</Text>
                  <View style={[styles.dateInputContainer, { borderBottomColor: colors.text }]}>
                    <Text style={[styles.dateInput, { color: colors.text }]}>{startDate}</Text>
                    <TouchableOpacity
                      onPress={() => {
                        console.log('Start date picker pressed');
                        setShowStartDatePicker(true);
                      }}
                      style={{ padding: 8 }}
                    >
                      <MaterialIcons name="event" size={20} color={colors.icon} />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.dateInputRow}>
                  <Text style={[styles.dateLabel, { color: colors.text }]}>End</Text>
                  <View style={[styles.dateInputContainer, { borderBottomColor: colors.text }]}>
                    <Text style={[styles.dateInput, { color: colors.text }]}>{endDate || 'Select end date'}</Text>
                    <TouchableOpacity
                      onPress={() => {
                        console.log('End date picker pressed');
                        setShowEndDatePicker(true);
                      }}
                      style={{ padding: 8 }}
                    >
                      <MaterialIcons name="event" size={20} color={colors.icon} />
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
            <View style={[styles.datePickerContainer, { backgroundColor: colors.background }]}>
              <View style={[styles.datePickerHeader, { borderBottomColor: colors.border }]}>
                <TouchableOpacity onPress={() => setShowStartDatePicker(false)}>
                  <Text style={[styles.datePickerCancel, { color: colors.icon }]}>Cancel</Text>
                </TouchableOpacity>
                <Text style={[styles.datePickerTitle, { color: colors.text }]}>Select Start Date</Text>
                <TouchableOpacity onPress={handleStartDateConfirm}>
                  <Text style={[styles.datePickerDone, { color: colors.tint }]}>Done</Text>
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
            <View style={[styles.datePickerContainer, { backgroundColor: colors.background }]}>
              <View style={[styles.datePickerHeader, { borderBottomColor: colors.border }]}>
                <TouchableOpacity onPress={() => setShowEndDatePicker(false)}>
                  <Text style={[styles.datePickerCancel, { color: colors.icon }]}>Cancel</Text>
                </TouchableOpacity>
                <Text style={[styles.datePickerTitle, { color: colors.text }]}>Select End Date</Text>
                <TouchableOpacity onPress={handleEndDateConfirm}>
                  <Text style={[styles.datePickerDone, { color: colors.tint }]}>Done</Text>
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
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
    fontWeight: '400',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Montserrat_600SemiBold',
  },
  doneButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  doneText: {
    fontSize: 16,
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
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderWidth: 1,
  },
  plusIcon: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  groupNameContainer: {
    flex: 1,
    paddingTop: 4,
  },
  groupNameLabel: {
    fontSize: 16,
    marginBottom: 8,
    fontFamily: 'Poppins_500Medium',
  },
  groupNameInput: {
    fontSize: 16,
    borderBottomWidth: 1,
    paddingBottom: 8,
    paddingTop: 2,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '500',
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
    minHeight: 72,
    maxWidth: 80,
  },
  groupTypeButtonSelected: {
  },
  groupTypeIcon: {
    marginBottom: 8,
  },
  groupTypeLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  groupTypeLabelSelected: {
  },
  tripDatesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  tripDatesDescription: {
    fontSize: 14,
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
  },
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    paddingBottom: 8,
    paddingTop: 2,
  },
  dateInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 2,
  },
  datePickerModal: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  datePickerContainer: {
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
  },
  datePickerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  datePickerCancel: {
    fontSize: 16,
  },
  datePickerDone: {
    fontSize: 16,
    fontWeight: '600',
  },
});
