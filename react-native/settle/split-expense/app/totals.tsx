import TabLayoutWrapper from '@/components/TabLayoutWrapper';
import { Button, Modal } from '@/components/common';
import { Colors } from '@/constants/colors';
import { styles } from '@/styles/totals.styles';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TotalsScreen() {
  const router = useRouter();
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('All time');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleInfoPress = (title: string, message: string) => {
    setModalTitle(title);
    setModalMessage(message);
    setShowInfoModal(true);
  };

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
    if (period !== 'All time') {
      setShowDatePicker(true);
    }
  };

  const handleDateNavigation = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const handleDatePickerPress = () => {
    setShowDatePicker(true);
  };

  return (
    <TabLayoutWrapper>
      <SafeAreaView style={styles.container} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={24} color={Colors.black} />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Jje</Text>
            <Text style={styles.headerSubtitle}>October 2025 group spending</Text>
          </View>
          <TouchableOpacity style={styles.infoButton} onPress={() => handleInfoPress('What do these terms mean?', 'Total spent = the total cost of every expense added to the group for the time period specified\n\nYour share = your total share of all group expenses involving you')}>
            <MaterialIcons name="help-outline" size={20} color={Colors.black} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Bar Chart */}
          <View style={styles.chartContainer}>
            <View style={styles.chartGrid}>
              {[...Array(5)].map((_, i) => (
                <View key={i} style={styles.gridLine} />
              ))}
            </View>
            <View style={styles.barsContainer}>
              <View style={styles.barWrapper}>
                <View style={[styles.bar, styles.barLow]} />
                <Text style={styles.barLabel}>AUG.</Text>
              </View>
              <View style={styles.barWrapper}>
                <View style={[styles.bar, styles.barLow]} />
                <Text style={styles.barLabel}>SEP.</Text>
              </View>
              <View style={styles.barWrapper}>
                <View style={[styles.bar, styles.barHigh]} />
                <Text style={styles.barLabel}>OCT.</Text>
              </View>
            </View>
          </View>

          {/* Total Spent */}
          <View style={styles.summarySection}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total spent</Text>
              <TouchableOpacity onPress={() => handleInfoPress('Total spent', 'Total spent = the total cost of every expense added to the group for the time period specified')}>
                <MaterialIcons name="help-outline" size={18} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>
            <View style={styles.amountRow}>
              <View style={styles.dot} />
              <Text style={styles.amountText}>$106.00</Text>
            </View>
          </View>

          {/* Your Share */}
          <View style={styles.summarySection}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Your share</Text>
              <TouchableOpacity onPress={() => handleInfoPress('Your share', 'Your share = your total share of all group expenses involving you')}>
                <MaterialIcons name="help-outline" size={18} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>
            <View style={styles.amountRow}>
              <View style={styles.dot} />
              <Text style={styles.amountText}>$106.00</Text>
            </View>
            <Text style={styles.sharePercentage}>100% of total group spending</Text>
          </View>

          {/* Pro users get more */}
          <View style={styles.proUsersSection}>
            <Text style={styles.proUsersText}>Pro users get more</Text>
          </View>
        </ScrollView>

        {/* Bottom Date Selector */}
        <View style={styles.bottomBar}>
          <TouchableOpacity 
            style={[styles.bottomBarButton, selectedPeriod === 'All time' && styles.bottomBarButtonSelected]} 
            onPress={() => handlePeriodChange('All time')}
          >
            <Text style={[styles.bottomBarButtonText, selectedPeriod === 'All time' && styles.bottomBarButtonTextSelected]}>All time</Text>
          </TouchableOpacity>
          <View style={styles.bottomBarDateSelector}>
            <TouchableOpacity onPress={() => handleDateNavigation('prev')}>
              <MaterialIcons name="chevron-left" size={24} color={Colors.black} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDatePickerPress} style={styles.dateTextContainer}>
              <Text style={styles.bottomBarDateText}>{formatDate(currentDate)}</Text>
              <MaterialIcons name="arrow-drop-down" size={24} color={Colors.black} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDateNavigation('next')}>
              <MaterialIcons name="chevron-right" size={24} color={Colors.black} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Date Picker Modal */}
        <Modal
          visible={showDatePicker}
          onClose={() => setShowDatePicker(false)}
          variant="bottom"
        >
          <View style={styles.datePickerHeader}>
            <Text style={styles.datePickerTitle}>Select Period</Text>
            <TouchableOpacity onPress={() => setShowDatePicker(false)}>
              <MaterialIcons name="close" size={24} color={Colors.black} />
            </TouchableOpacity>
          </View>
          <View style={styles.datePickerContent}>
            {['All time', 'Custom range', 'This month', 'Last month'].map((option) => (
              <TouchableOpacity 
                key={option}
                style={styles.datePickerOption}
                onPress={() => {
                  setSelectedPeriod(option);
                  if (option === 'Last month') {
                    const lastMonth = new Date();
                    lastMonth.setMonth(lastMonth.getMonth() - 1);
                    setCurrentDate(lastMonth);
                  } else if (option === 'This month') {
                    setCurrentDate(new Date());
                  }
                  setShowDatePicker(false);
                }}
              >
                <Text style={styles.datePickerOptionText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Modal>

        {/* Info Modal */}
        <Modal
          visible={showInfoModal}
          onClose={() => setShowInfoModal(false)}
          variant="center"
        >
          <TouchableOpacity style={styles.modalCloseButton} onPress={() => setShowInfoModal(false)}>
            <MaterialIcons name="close" size={24} color={Colors.black} />
          </TouchableOpacity>
          <View style={styles.modalHeader}>
            <MaterialIcons name="help-outline" size={24} color={Colors.success} />
            <Text style={styles.modalTitle}>{modalTitle}</Text>
          </View>
          <Text style={styles.modalMessage}>{modalMessage}</Text>
          <Button 
            title="Close" 
            variant="primary" 
            onPress={() => setShowInfoModal(false)}
            style={styles.modalActionButton}
          />
        </Modal>
      </SafeAreaView>
    </TabLayoutWrapper>
  );
}

