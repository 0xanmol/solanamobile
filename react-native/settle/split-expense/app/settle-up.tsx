import TabLayoutWrapper from '@/components/TabLayoutWrapper';
import FabButtons from '@/components/fab-buttons';
import { Colors } from '@/constants/colors';
import { BorderRadius, Spacing } from '@/constants/spacing';
import { FontFamily, FontSize } from '@/constants/typography';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettleUpScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('settle');

  const expenses = [
    {
      id: 1,
      title: 'Cock sugar',
      date: 'Oct. 23',
      paidBy: 'You paid $1,965,199.00',
      amount: '$982,599.50',
      type: 'lent',
      typeText: 'you lent',
      typeColor: '#10B981',
    },
    {
      id: 2,
      title: 'Netflix',
      date: 'Oct. 23',
      paidBy: 'Saurav V. paid $200.00',
      amount: '$100.00',
      type: 'borrowed',
      typeText: 'you borrowed',
      typeColor: '#F59E0B',
    },
    {
      id: 3,
      title: 'Boostore',
      date: 'Oct. 23',
      paidBy: 'Saurav V. paid $6,262.00',
      amount: '$3,131.00',
      type: 'borrowed',
      typeText: 'you borrowed',
      typeColor: '#F59E0B',
    },
  ];

  const handleSettleUp = () => {
    console.log('Settle up pressed');
  };

  const handleAddSettleUpDate = () => {
    console.log('Add settle up date pressed');
  };

  const handleAddPeople = () => {
    console.log('Add people pressed');
  };

  return (
    <TabLayoutWrapper>
      <SafeAreaView style={styles.container} edges={['top']}>
        {/* Minimal Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Settle Up</Text>
          <TouchableOpacity style={styles.settingsButton}>
            <MaterialIcons name="settings" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Ultra Minimal Summary */}
        <View style={styles.summarySection}>
          <Text style={styles.summaryAmount}>$979,368.50</Text>
        </View>

        {/* Minimal Tab Indicator */}
        <View style={styles.tabIndicator}>
          <View style={[styles.tabDot, activeTab === 'settle' && styles.activeTabDot]} />
          <View style={[styles.tabDot, activeTab === 'charts' && styles.activeTabDot]} />
          <View style={[styles.tabDot, activeTab === 'balances' && styles.activeTabDot]} />
        </View>

        {/* Ultra Compact Content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {expenses.map((expense) => (
            <View key={expense.id} style={styles.expenseItem}>
              <Text style={styles.expenseTitle}>{expense.title}</Text>
              <Text style={[styles.expenseAmount, { color: expense.typeColor }]}>{expense.amount}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Floating Action Buttons */}
        <FabButtons
          onAddExpensePress={() => router.push('/add-expense')}
          isTabScreen={false}
        />
      </SafeAreaView>
    </TabLayoutWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.white,
  },
  backButton: {
    padding: Spacing.xs,
  },
  headerTitle: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.montserratSemiBold,
    color: Colors.textPrimary,
  },
  settingsButton: {
    padding: Spacing.xs,
  },
  summarySection: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
    backgroundColor: Colors.slate50,
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  summaryAmount: {
    fontSize: FontSize['2xl'],
    fontFamily: FontFamily.poppinsSemiBold,
    color: Colors.success,
  },
  tabIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.white,
    gap: Spacing.xs,
  },
  tabDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.border,
  },
  activeTabDot: {
    backgroundColor: Colors.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
  },
  expenseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.borderLight,
  },
  expenseTitle: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.poppinsMedium,
    color: Colors.textPrimary,
    flex: 1,
  },
  expenseAmount: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.poppinsSemiBold,
  },
});
