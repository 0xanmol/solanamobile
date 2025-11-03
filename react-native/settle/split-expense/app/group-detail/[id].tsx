import FabButtons from '@/components/fab-buttons';
import TabLayoutWrapper from '@/components/TabLayoutWrapper';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import React, { useState, useCallback } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getGroup, Group } from '@/apis/groups';
import { getExpenses, Expense } from '@/apis/expenses';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function GroupDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState('settle-up');
  const [group, setGroup] = useState<Group | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  const fetchData = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const userJson = await AsyncStorage.getItem('user_data');
      if (userJson) {
        setCurrentUser(JSON.parse(userJson));
      }

      const groupResponse = await getGroup(id as string);
      if (groupResponse && groupResponse.success) {
        setGroup(groupResponse.data);
      } else {
        console.error("Failed to fetch group:", groupResponse?.message);
      }

      const expensesResponse = await getExpenses(id as string);
      if (expensesResponse && expensesResponse.success && Array.isArray(expensesResponse.data)) {
        setExpenses(expensesResponse.data);
      } else {
        console.error("Failed to fetch expenses or data is not in expected format:", expensesResponse);
      }
    } catch (error) {
      console.error("Error fetching group details:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  if (loading || !currentUser) {
    return (
      <TabLayoutWrapper>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#781D27" />
        </View>
      </TabLayoutWrapper>
    );
  }

  if (!group) {
    return (
      <TabLayoutWrapper>
        <View style={styles.loadingContainer}>
          <Text>Group not found.</Text>
        </View>
      </TabLayoutWrapper>
    );
  }

  const renderSettleUpContent = () => {
    return (
      <View style={styles.settleUpContent}>
        {expenses.length === 0 ? (
          <View style={styles.settledMessage}>
            <Text style={styles.settledText}>You are all settled up in this group.</Text>
          </View>
        ) : (
          <View style={styles.expensesSection}>
            <Text style={styles.expensesHeader}>October 2025</Text>
            {expenses.map((expense) => {
              if (!currentUser) return null;

              const userPaid = expense.paid_by === currentUser.id;
              const userIsParticipant = expense.participants?.some(p => p.user_id === currentUser.id);
              let status = '';
              let amount = 0;
              let statusColor = '#6B7280';

              if (userPaid) {
                status = 'you lent';
                statusColor = '#10B981';
                const userShare = expense.participants.find(p => p.user_id === currentUser.id)?.share || 0;
                amount = expense.amount - userShare;
              } else if (userIsParticipant) {
                status = 'you borrowed';
                statusColor = '#F59E0B';
                amount = expense.participants.find(p => p.user_id === currentUser.id)?.share || 0;
              } else {
                return null;
              }

              return (
                <View key={expense.id} style={styles.expenseItem}>
                  <View style={styles.expenseLeft}>
                    <Text style={styles.expenseDate}>{new Date(expense.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</Text>
                    <MaterialIcons name="receipt" size={20} color="#6B7280" />
                  </View>
                  <View style={styles.expenseCenter}>
                    <Text style={styles.expenseTitle}>{expense.description}</Text>
                    <Text style={styles.expensePaidBy}>{userPaid ? `You paid ${expense.amount.toFixed(2)}` : `${expense.paid_by_name} paid ${expense.amount.toFixed(2)}`}</Text>
                  </View>
                  <View style={styles.expenseRight}>
                    <Text style={[styles.expenseStatus, { color: statusColor }]}>{status}</Text>
                    <Text style={[styles.expenseAmount, { color: statusColor }]}>{`${amount.toFixed(2)}`}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </View>
    );
  };

  return (
    <TabLayoutWrapper>
      <SafeAreaView style={styles.container} edges={['top']}>
         <View style={styles.header}><TouchableOpacity style={styles.backButton} onPress={() => router.back()}><MaterialIcons name="arrow-back" size={24} color="#FFFFFF" /></TouchableOpacity><TouchableOpacity style={styles.settingsButton} onPress={() => router.push('/group-settings')}><MaterialIcons name="settings" size={24} color="#FFFFFF" /></TouchableOpacity></View>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.groupInfo}>
            <View style={styles.iconContainer}><View style={[styles.iconBackground, { backgroundColor: group.color || '#781D27' }]}><MaterialIcons name={group.type === 'home' ? 'home' : group.type === 'trip' ? 'flight' : group.type === 'couple' ? 'favorite' : 'list'} size={40} color="#FFFFFF" /></View></View>
            <Text style={styles.groupName}>{group.name}</Text>
            <Text style={styles.subText}>🎉 You are all settled up in this group.</Text>
          </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.navButtonsScrollView} contentContainerStyle={styles.navButtonsContainer}>
              <TouchableOpacity style={[styles.navButton, activeTab === 'settle-up' && styles.activeNavButton]} onPress={() => setActiveTab('settle-up')}><Text style={[styles.navButtonText, activeTab === 'settle-up' && styles.activeNavButtonText]}>Settle up</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.navButton, activeTab === 'charts' && styles.activeNavButton]} onPress={() => setActiveTab('charts')}><MaterialIcons name="diamond" size={20} color="#8B5CF6" /><Text style={[styles.navButtonText, activeTab === 'charts' && styles.activeNavButtonText]}>Charts</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.navButton, activeTab === 'balances' && styles.activeNavButton]} onPress={() => router.push('/balances')}><Text style={[styles.navButtonText, activeTab === 'balances' && styles.activeNavButtonText]}>Balances</Text></TouchableOpacity>
            </ScrollView>
          {activeTab === 'settle-up' && renderSettleUpContent()}
          {activeTab === 'charts' && (<View style={styles.mainBody}><Text style={styles.title}>Charts</Text><Text style={styles.subtitle}>Charts content coming soon</Text></View>)}
          {!['settle-up', 'charts'].includes(activeTab) && (<View style={styles.mainBody}><Text style={styles.title}>You are all settled up</Text><Text style={styles.subtitle}>Tap to show settled expenses</Text><View style={styles.checkmarkContainer}><View style={[styles.checkmarkPart, styles.checkmarkPart1]} /><View style={[styles.checkmarkPart, styles.checkmarkPart2]} /><View style={[styles.checkmarkPart, styles.checkmarkPart3]} /><View style={[styles.checkmarkPart, styles.checkmarkPart4]} /><View style={[styles.checkmarkPart, styles.checkmarkPart5]} /></View></View>)}
        </ScrollView>
                <FabButtons
                  onAddExpensePress={() => router.push({ pathname: '/add-expense', params: { groupId: id } })}
                />
      </SafeAreaView>
    </TabLayoutWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: { height: 60, backgroundColor: '#781D27', position: 'relative', justifyContent: 'center' },
  backButton: { position: 'absolute', top: 15, left: 20, padding: 8, zIndex: 5 },
  settingsButton: { position: 'absolute', top: 15, right: 20, padding: 8, zIndex: 5 },
  content: { flex: 1, backgroundColor: '#FFFFFF' },
  groupInfo: { alignItems: 'center', paddingVertical: 16 },
  iconContainer: { shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 5, elevation: 4 },
  iconBackground: { width: 64, height: 64, backgroundColor: '#781D27', borderRadius: 14, borderWidth: 2, borderColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  groupName: { fontSize: 24, fontWeight: '600', color: '#222222', marginTop: 8, fontFamily: 'Poppins_600SemiBold' },
  subText: { fontSize: 14, color: '#6B7280', textAlign: 'center', marginTop: 4, fontFamily: 'Montserrat_400Regular' },
  navButtonsScrollView: { marginBottom: 16 },
  navButtonsContainer: { flexDirection: 'row', paddingHorizontal: 20, gap: 8, justifyContent: 'flex-start' },
   navButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 16, borderWidth: 1, borderColor: '#E5E7EB', shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 1, shadowOffset: { width: 0, height: 1 }, elevation: 1, gap: 3, minWidth: 70, marginRight: 6 },
   navButtonText: { fontSize: 11, color: '#1F2937', fontWeight: '600', fontFamily: 'Poppins_600SemiBold' },
   activeNavButton: { backgroundColor: '#F59E0B', borderColor: '#F59E0B' },
   activeNavButtonText: { color: '#FFFFFF' },
   settleUpContent: { paddingHorizontal: 20 },
   settleUpHeader: { alignItems: 'center', paddingVertical: 16, backgroundColor: '#FFFFFF' },
   settleUpTitle: { fontSize: 16, fontFamily: 'Montserrat_600SemiBold', color: '#1F2937', marginBottom: 6 },
   settleUpAmount: { fontSize: 28, fontWeight: '600', color: '#10B981', fontFamily: 'Poppins_600SemiBold' },
   expensesSection: { paddingBottom: 80 },
   expensesHeader: { fontSize: 16, fontFamily: 'Montserrat_600SemiBold', color: '#1F2937', marginBottom: 12 },
   expenseItem: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
   expenseLeft: { alignItems: 'center', width: 50, marginRight: 12 },
   expenseDate: { fontSize: 12, fontFamily: 'Montserrat_400Regular', color: '#6B7280', marginBottom: 4 },
   expenseCenter: { flex: 1 },
   expenseTitle: { fontSize: 16, fontFamily: 'Poppins_500Medium', color: '#1F2937', marginBottom: 4 },
   expensePaidBy: { fontSize: 14, fontFamily: 'Montserrat_400Regular', color: '#6B7280' },
   expenseRight: { alignItems: 'flex-end', width: 90 },
   expenseStatus: { fontSize: 12, fontFamily: 'Montserrat_400Regular', marginBottom: 2 },
   expenseAmount: { fontSize: 14, fontFamily: 'Poppins_500Medium' },
   settledMessage: { alignItems: 'center', paddingVertical: 16, marginTop: 16 },
   settledText: { fontSize: 14, fontFamily: 'Montserrat_400Regular', color: '#6B7280', textAlign: 'center', marginBottom: 8 },
   tapToShowText: { fontSize: 14, fontFamily: 'Montserrat_500Medium', color: '#10B981' },
  mainBody: { alignItems: 'center', marginTop: 32 },
  title: { fontSize: 20, fontWeight: '600', color: '#222', fontFamily: 'Poppins_600SemiBold' },
  subtitle: { fontSize: 14, color: '#777', marginTop: 4, marginBottom: 24, fontFamily: 'Montserrat_400Regular' },
  checkmarkContainer: { width: 100, height: 100, position: 'relative', marginTop: 16 },
  checkmarkPart: { position: 'absolute' },
  checkmarkPart1: { top: 20, left: 30, width: 40, height: 60, backgroundColor: '#8B5CF6', transform: [{ rotate: '45deg' }] },
  checkmarkPart2: { top: 40, left: 50, width: 30, height: 40, backgroundColor: '#7C3AED', transform: [{ rotate: '45deg' }] },
  checkmarkPart3: { top: 60, left: 70, width: 20, height: 30, backgroundColor: '#6D28D9', transform: [{ rotate: '45deg' }] },
  checkmarkPart4: { top: 10, left: 40, width: 25, height: 35, backgroundColor: '#A855F7', transform: [{ rotate: '45deg' }] },
  checkmarkPart5: { top: 30, left: 60, width: 35, height: 25, backgroundColor: '#9333EA', transform: [{ rotate: '45deg' }] },
});