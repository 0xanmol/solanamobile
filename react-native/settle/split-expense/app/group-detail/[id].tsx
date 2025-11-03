import FabButtons from '@/components/fab-buttons';
import TabLayoutWrapper from '@/components/TabLayoutWrapper';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function GroupDetailScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('settle-up');

  const expenses = [
    {
      id: 1,
      title: 'Cock sugar',
      date: 'Oct. 23',
      paidBy: 'You paid $1,965,199.00',
      status: 'you lent',
      amount: '$982,599.50',
      statusColor: '#10B981',
    },
    {
      id: 2,
      title: 'Netflix',
      date: 'Oct. 23',
      paidBy: 'Saurav V. paid $200.00',
      status: 'you borrowed',
      amount: '$100.00',
      statusColor: '#F59E0B',
    },
    {
      id: 3,
      title: 'Boostore',
      date: 'Oct. 23',
      paidBy: 'Saurav V. paid $6,262.00',
      status: 'you borrowed',
      amount: '$3,131.00',
      statusColor: '#F59E0B',
    },
  ];

  const renderSettleUpContent = () => (
    <View style={styles.settleUpContent}>
      {/* Header with amount owed */}
      <View style={styles.settleUpHeader}>
        <Text style={styles.settleUpTitle}>Saurav V. owes you</Text>
        <Text style={styles.settleUpAmount}>$979,368.50</Text>
      </View>

      {/* Expenses List */}
      <View style={styles.expensesSection}>
        <Text style={styles.expensesHeader}>October 2025</Text>
        
        {expenses.map((expense) => (
          <View key={expense.id} style={styles.expenseItem}>
            <View style={styles.expenseLeft}>
              <Text style={styles.expenseDate}>{expense.date}</Text>
              <MaterialIcons name="receipt" size={20} color="#6B7280" />
            </View>
            <View style={styles.expenseCenter}>
              <Text style={styles.expenseTitle}>{expense.title}</Text>
              <Text style={styles.expensePaidBy}>{expense.paidBy}</Text>
            </View>
            <View style={styles.expenseRight}>
              <Text style={[styles.expenseStatus, { color: expense.statusColor }]}>
                {expense.status}
              </Text>
              <Text style={[styles.expenseAmount, { color: expense.statusColor }]}>
                {expense.amount}
              </Text>
            </View>
          </View>
        ))}

        {/* Settled Message */}
        <View style={styles.settledMessage}>
          <Text style={styles.settledText}>
            All expenses before this date have been settled up.
          </Text>
          <TouchableOpacity>
            <Text style={styles.tapToShowText}>Tap to show</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <TabLayoutWrapper>
      <SafeAreaView style={styles.container} edges={['top']}>
         {/* Header */}
         <View style={styles.header}>

          {/* Back & Settings */}
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingsButton} onPress={() => router.push('/group-settings')}>
            <MaterialIcons name="settings" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Group Info */}
          <View style={styles.groupInfo}>
            <View style={styles.iconContainer}>
              <View style={styles.iconBackground}>
                <MaterialIcons name="home" size={40} color="#FFFFFF" />
              </View>
            </View>
            <Text style={styles.groupName}>Jje</Text>
            <Text style={styles.subText}>🎉 You are all settled up in this group.</Text>
          </View>

            {/* Navigation Buttons */}
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.navButtonsScrollView}
              contentContainerStyle={styles.navButtonsContainer}
            >
              <TouchableOpacity 
                style={[styles.navButton, activeTab === 'settle-up' && styles.activeNavButton]} 
                onPress={() => setActiveTab('settle-up')}
              >
                <Text style={[styles.navButtonText, activeTab === 'settle-up' && styles.activeNavButtonText]}>Settle up</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.navButton, activeTab === 'charts' && styles.activeNavButton]} 
                onPress={() => setActiveTab('charts')}
              >
                <MaterialIcons name="diamond" size={20} color="#8B5CF6" />
                <Text style={[styles.navButtonText, activeTab === 'charts' && styles.activeNavButtonText]}>Charts</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.navButton, activeTab === 'balances' && styles.activeNavButton]}
                onPress={() => router.push('/balances')}
              >
                <Text style={[styles.navButtonText, activeTab === 'balances' && styles.activeNavButtonText]}>Balances</Text>
              </TouchableOpacity>
            </ScrollView>

          {/* Tab Content */}
          {activeTab === 'settle-up' && renderSettleUpContent()}
          {activeTab === 'charts' && (
            <View style={styles.mainBody}>
              <Text style={styles.title}>Charts</Text>
              <Text style={styles.subtitle}>Charts content coming soon</Text>
            </View>
          )}
          {!['settle-up', 'charts'].includes(activeTab) && (
            <View style={styles.mainBody}>
              <Text style={styles.title}>You are all settled up</Text>
              <Text style={styles.subtitle}>Tap to show settled expenses</Text>

              {/* Geometric Checkmark */}
              <View style={styles.checkmarkContainer}>
                <View style={[styles.checkmarkPart, styles.checkmarkPart1]} />
                <View style={[styles.checkmarkPart, styles.checkmarkPart2]} />
                <View style={[styles.checkmarkPart, styles.checkmarkPart3]} />
                <View style={[styles.checkmarkPart, styles.checkmarkPart4]} />
                <View style={[styles.checkmarkPart, styles.checkmarkPart5]} />
              </View>
            </View>
          )}
        </ScrollView>

        {/* Floating Buttons */}
        <FabButtons
          onAddExpensePress={() => router.push('/add-expense')}
        />
      </SafeAreaView>
    </TabLayoutWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },

  header: {
    height: 60,
    backgroundColor: '#781D27',
    position: 'relative',
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 15,
    left: 20,
    padding: 8,
    zIndex: 5,
  },
  settingsButton: {
    position: 'absolute',
    top: 15,
    right: 20,
    padding: 8,
    zIndex: 5,
  },

  content: { flex: 1, backgroundColor: '#FFFFFF' },

  groupInfo: { alignItems: 'center', paddingVertical: 16 },
  iconContainer: {
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  iconBackground: {
    width: 64,
    height: 64,
    backgroundColor: '#781D27',
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  groupName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#222222',
    marginTop: 8,
    fontFamily: 'Poppins_600SemiBold',
  },
  subText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 4,
    fontFamily: 'Montserrat_400Regular',
  },

  navButtonsScrollView: {
    marginBottom: 16,
  },
  navButtonsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 8,
    justifyContent: 'flex-start',
  },
   navButton: {
     flexDirection: 'row',
     alignItems: 'center',
     justifyContent: 'center',
     backgroundColor: '#FFFFFF',
     paddingVertical: 6,
     paddingHorizontal: 10,
     borderRadius: 16,
     borderWidth: 1,
     borderColor: '#E5E7EB',
     shadowColor: '#000',
     shadowOpacity: 0.08,
     shadowRadius: 1,
     shadowOffset: { width: 0, height: 1 },
     elevation: 1,
     gap: 3,
     minWidth: 70,
     marginRight: 6,
   },
   navButtonText: {
     fontSize: 11,
     color: '#1F2937',
     fontWeight: '600',
     fontFamily: 'Poppins_600SemiBold',
   },
   activeNavButton: {
     backgroundColor: '#F59E0B',
     borderColor: '#F59E0B',
   },
   activeNavButtonText: {
     color: '#FFFFFF',
   },

   // Settle Up Content Styles
   settleUpContent: {
     paddingHorizontal: 20,
   },
   settleUpHeader: {
     alignItems: 'center',
     paddingVertical: 16,
     backgroundColor: '#FFFFFF',
   },
   settleUpTitle: {
     fontSize: 16,
     fontFamily: 'Montserrat_600SemiBold',
     color: '#1F2937',
     marginBottom: 6,
   },
   settleUpAmount: {
     fontSize: 28,
     fontWeight: '600',
     color: '#10B981',
     fontFamily: 'Poppins_600SemiBold',
   },
   expensesSection: {
     paddingBottom: 80,
   },
   expensesHeader: {
     fontSize: 16,
     fontFamily: 'Montserrat_600SemiBold',
     color: '#1F2937',
     marginBottom: 12,
   },
   expenseItem: {
     flexDirection: 'row',
     alignItems: 'flex-start',
     paddingVertical: 10,
     borderBottomWidth: 1,
     borderBottomColor: '#F3F4F6',
   },
   expenseLeft: {
     alignItems: 'center',
     width: 50,
     marginRight: 12,
   },
   expenseDate: {
     fontSize: 12,
     fontFamily: 'Montserrat_400Regular',
     color: '#6B7280',
     marginBottom: 4,
   },
   expenseCenter: {
     flex: 1,
   },
   expenseTitle: {
     fontSize: 16,
     fontFamily: 'Poppins_500Medium',
     color: '#1F2937',
     marginBottom: 4,
   },
   expensePaidBy: {
     fontSize: 14,
     fontFamily: 'Montserrat_400Regular',
     color: '#6B7280',
   },
   expenseRight: {
     alignItems: 'flex-end',
     width: 90,
   },
   expenseStatus: {
     fontSize: 12,
     fontFamily: 'Montserrat_400Regular',
     marginBottom: 2,
   },
   expenseAmount: {
     fontSize: 14,
     fontFamily: 'Poppins_500Medium',
   },
   settledMessage: {
     alignItems: 'center',
     paddingVertical: 16,
     marginTop: 16,
   },
   settledText: {
     fontSize: 14,
     fontFamily: 'Montserrat_400Regular',
     color: '#6B7280',
     textAlign: 'center',
     marginBottom: 8,
   },
   tapToShowText: {
     fontSize: 14,
     fontFamily: 'Montserrat_500Medium',
     color: '#10B981',
   },

  mainBody: { alignItems: 'center', marginTop: 32 },
  title: { fontSize: 20, fontWeight: '600', color: '#222', fontFamily: 'Poppins_600SemiBold' },
  subtitle: { fontSize: 14, color: '#777', marginTop: 4, marginBottom: 24, fontFamily: 'Montserrat_400Regular' },
  checkmarkContainer: {
    width: 100,
    height: 100,
    position: 'relative',
    marginTop: 16,
  },
  checkmarkPart: {
    position: 'absolute',
  },
  checkmarkPart1: {
    top: 20,
    left: 30,
    width: 40,
    height: 60,
    backgroundColor: '#8B5CF6',
    transform: [{ rotate: '45deg' }],
  },
  checkmarkPart2: {
    top: 40,
    left: 50,
    width: 30,
    height: 40,
    backgroundColor: '#7C3AED',
    transform: [{ rotate: '45deg' }],
  },
  checkmarkPart3: {
    top: 60,
    left: 70,
    width: 20,
    height: 30,
    backgroundColor: '#6D28D9',
    transform: [{ rotate: '45deg' }],
  },
  checkmarkPart4: {
    top: 10,
    left: 40,
    width: 25,
    height: 35,
    backgroundColor: '#A855F7',
    transform: [{ rotate: '45deg' }],
  },
  checkmarkPart5: {
    top: 30,
    left: 60,
    width: 35,
    height: 25,
    backgroundColor: '#9333EA',
    transform: [{ rotate: '45deg' }],
  },
});
