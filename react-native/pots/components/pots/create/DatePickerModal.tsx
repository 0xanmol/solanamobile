import React from 'react'
import { View, StyleSheet, Modal, TouchableOpacity, Platform } from 'react-native'
import { AppText } from '@/components/app-text'
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker'

const quickDates = [
  { days: 7, label: 'In 7 days', subtitle: 'Next week' },
  { days: 30, label: 'In 30 days', subtitle: 'One month' },
  { days: 90, label: 'In 90 days', subtitle: 'Three months' },
]

const dayMs = 24 * 60 * 60 * 1000
const tomorrow = () => {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  d.setHours(0, 0, 0, 0)
  return d
}

const friendlyDate = (d: Date) =>
  d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

interface DatePickerModalProps {
  visible: boolean
  customDate: Date
  showCustomPicker: boolean
  palette: any
  cardStyle: any
  isDark: boolean
  isIOS: boolean
  onClose: () => void
  onQuickSelect: (days: number) => void
  onCustomDateChange: (date: Date) => void
  onShowCustomPicker: () => void
  onApplyDate: (date: Date) => void
}

export function DatePickerModal({
  visible,
  customDate,
  showCustomPicker,
  palette,
  cardStyle,
  isDark,
  isIOS,
  onClose,
  onQuickSelect,
  onCustomDateChange,
  onShowCustomPicker,
  onApplyDate,
}: DatePickerModalProps) {
  const ensureFuture = (date: Date) => {
    const min = tomorrow()
    return date.getTime() < min.getTime() ? min : date
  }

  const handleAndroidCustomPicker = () => {
    DateTimePickerAndroid.open({
      value: ensureFuture(customDate),
      mode: 'date',
      minimumDate: tomorrow(),
      onChange: (_event, selectedDate) => {
        if (selectedDate) onApplyDate(selectedDate)
      },
    })
  }

  if (!visible) return null

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={onClose}
        />

        <View style={[styles.modalCard, cardStyle]}>
          <AppText style={[styles.pickerTitle, { color: palette.text }]}>Target date</AppText>
          <AppText style={[styles.pickerSubtitle, { color: palette.textSecondary }]}>
            Pick a quick date for this pot.
          </AppText>

          {quickDates.map((q) => (
            <TouchableOpacity
              key={q.days}
              style={[styles.dateOption, { borderBottomColor: palette.border }]}
              activeOpacity={0.8}
              onPress={() => onQuickSelect(q.days)}
            >
              <AppText style={[styles.dateOptionLabel, { color: palette.text }]}>{q.label}</AppText>
              <AppText style={[styles.dateOptionSubtitle, { color: palette.textSecondary }]}>
                {q.subtitle}
              </AppText>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            style={[styles.dateOption, { borderBottomColor: 'transparent' }]}
            activeOpacity={0.8}
            onPress={() => {
              if (isIOS) {
                onShowCustomPicker()
              } else {
                handleAndroidCustomPicker()
              }
            }}
          >
            <AppText style={[styles.dateOptionLabel, { color: palette.text }]}>Custom date</AppText>
            <AppText style={[styles.dateOptionSubtitle, { color: palette.accent }]}>
              {friendlyDate(customDate)}
            </AppText>
          </TouchableOpacity>

          {showCustomPicker && isIOS && (
            <View style={[styles.customPickerContainer, { borderColor: palette.border }]}>
              <DateTimePicker
                mode="date"
                display="spinner"
                value={ensureFuture(customDate)}
                minimumDate={tomorrow()}
                onChange={(_e, d) => d && onCustomDateChange(d)}
                themeVariant={isDark ? 'dark' : 'light'}
              />

              <View style={styles.customPickerActions}>
                <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
                  <AppText style={[styles.customPickerAction, { color: palette.textSecondary }]}>
                    Cancel
                  </AppText>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onApplyDate(customDate)} activeOpacity={0.7}>
                  <AppText style={[styles.customPickerAction, { color: palette.accent }]}>Set</AppText>
                </TouchableOpacity>
              </View>
            </View>
          )}

          <TouchableOpacity
            style={styles.dateCancel}
            activeOpacity={0.7}
            onPress={onClose}
          >
            <AppText style={[styles.dateCancelText, { color: palette.textSecondary }]}>Cancel</AppText>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalCard: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 40,
    borderWidth: 1,
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  pickerSubtitle: {
    fontSize: 13,
    marginBottom: 16,
  },
  dateOption: {
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  dateOptionLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  dateOptionSubtitle: {
    fontSize: 13,
  },
  customPickerContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  customPickerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  customPickerAction: {
    fontSize: 16,
    fontWeight: '600',
  },
  dateCancel: {
    marginTop: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  dateCancelText: {
    fontSize: 15,
    fontWeight: '600',
  },
})

