import FabButtons from '@/components/fab-buttons';
import TabLayoutWrapper from '@/components/TabLayoutWrapper';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import React, { useState, useCallback } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getGroup, Group } from '@/apis/groups';
import { getExpenses, Expense } from '@/apis/expenses';
import { getBalances, Balance } from '@/apis/balances';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

export default function GroupDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [activeTab, setActiveTab] = useState('settle-up');
  const [group, setGroup] = useState<Group | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [balances, setBalances] = useState<Balance[]>([]);
  const [userBalance, setUserBalance] = useState<number>(0);

  const fetchData = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const userJson = await AsyncStorage.getItem('user_data');
      let user = null;
      if (userJson) {
        user = JSON.parse(userJson);
        setCurrentUser(user);
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

      // Fetch balances for this group
      const balancesResponse = await getBalances(id as string);
      if (balancesResponse && balancesResponse.success && Array.isArray(balancesResponse.data)) {
        setBalances(balancesResponse.data);

        // Calculate user's balance in this group
        // Note: Backend returns balances where userId is the OTHER person
        // type 'owes' = current user owes, 'gets_back' = current user is owed
        let balance = 0;
        balancesResponse.data.forEach((b: Balance) => {
          if (b.type === 'owes') {
            balance -= b.amount;
          } else if (b.type === 'gets_back') {
            balance += b.amount;
          }
        });
        setUserBalance(balance);
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
        <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
          <ActivityIndicator size="large" color={colors.tint} />
        </View>
      </TabLayoutWrapper>
    );
  }

  if (!group) {
    return (
      <TabLayoutWrapper>
        <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
          <Text style={{ color: colors.text }}>Group not found.</Text>
        </View>
      </TabLayoutWrapper>
    );
  }

  const renderSettleUpContent = () => {
    return (
      <View style={styles.settleUpContent}>
        {expenses.length === 0 ? (
          <View style={styles.settledMessage}>
            <Text style={[styles.settledText, { color: colors.icon }]}>You are all settled up in this group.</Text>
          </View>
        ) : (
          <View style={styles.expensesSection}>
            <Text style={[styles.expensesHeader, { color: colors.text }]}>October 2025</Text>
            {expenses.map((expense) => {
              if (!currentUser) return null;

              const userPaid = expense.paid_by === currentUser.id;
              const userIsParticipant = expense.participants?.some(p => p.user_id === currentUser.id);
              let status = '';
              let amount = 0;
              let statusColor = colors.icon;

              if (userPaid) {
                status = 'you lent';
                statusColor = colors.success;
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
                <View key={expense.id} style={[styles.expenseItem, { borderBottomColor: colors.border }]}>
                  <View style={styles.expenseLeft}>
                    <Text style={[styles.expenseDate, { color: colors.icon }]}>{new Date(expense.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</Text>
                    <MaterialIcons name="receipt" size={20} color={colors.icon} />
                  </View>
                  <View style={styles.expenseCenter}>
                    <Text style={[styles.expenseTitle, { color: colors.text }]}>{expense.description}</Text>
                    <Text style={[styles.expensePaidBy, { color: colors.icon }]}>{userPaid ? `You paid ${expense.amount.toFixed(2)}` : `${expense.paid_by_name} paid ${expense.amount.toFixed(2)}`}</Text>
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
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
         <View style={styles.header}><TouchableOpacity style={styles.backButton} onPress={() => router.back()}><MaterialIcons name="arrow-back" size={24} color="#FFFFFF" /></TouchableOpacity><TouchableOpacity style={styles.settingsButton} onPress={() => router.push(`/group-settings?groupId=${id}`)}><MaterialIcons name="settings" size={24} color="#FFFFFF" /></TouchableOpacity></View>
        <ScrollView style={[styles.content, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
          <View style={styles.groupInfo}>
            <View style={styles.iconContainer}><View style={[styles.iconBackground, { backgroundColor: group.color || '#781D27', borderColor: colors.background }]}><MaterialIcons name={group.type === 'home' ? 'home' : group.type === 'trip' ? 'flight' : group.type === 'couple' ? 'favorite' : 'list'} size={40} color="#FFFFFF" /></View></View>
            <Text style={[styles.groupName, { color: colors.text }]}>{group.name}</Text>
            <Text style={[styles.subText, { color: colors.icon }]}>
              {userBalance === 0
                ? '🎉 You are all settled up in this group.'
                : userBalance < 0
                ? `You owe ${Math.abs(userBalance).toFixed(2)} in this group`
                : `You are owed ${userBalance.toFixed(2)} in this group`}
            </Text>
          </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.navButtonsScrollView} contentContainerStyle={styles.navButtonsContainer}>
              <TouchableOpacity style={[styles.navButton, { backgroundColor: colors.background, borderColor: colors.border }, activeTab === 'settle-up' && styles.activeNavButton]} onPress={() => setActiveTab('settle-up')}><Text style={[styles.navButtonText, { color: colors.text }, activeTab === 'settle-up' && styles.activeNavButtonText]}>Settle up</Text></TouchableOpacity>
                            <TouchableOpacity
                              style={[styles.navButton, { backgroundColor: colors.background, borderColor: colors.border }, activeTab === 'balances' && styles.activeNavButton]}
                              onPress={() => router.push({ pathname: '/balances', params: { groupId: id } })}
                            ><Text style={[styles.navButtonText, { color: colors.text }, activeTab === 'balances' && styles.activeNavButtonText]}>Balances</Text></TouchableOpacity>
            </ScrollView>
          {activeTab === 'settle-up' && renderSettleUpContent()}
        </ScrollView>
                <FabButtons
                  onAddExpensePress={() => router.push({ pathname: '/add-expense', params: { groupId: id } })}
                  isTabScreen={false}
                />
      </SafeAreaView>
    </TabLayoutWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: { height: 60, backgroundColor: '#781D27', position: 'relative', justifyContent: 'center' },
  backButton: { position: 'absolute', top: 15, left: 20, padding: 8, zIndex: 5 },
  settingsButton: { position: 'absolute', top: 15, right: 20, padding: 8, zIndex: 5 },
  content: { flex: 1 },
  groupInfo: { alignItems: 'center', paddingVertical: 16 },
  iconContainer: { shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 5, elevation: 4 },
  iconBackground: { width: 64, height: 64, borderRadius: 14, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  groupName: { fontSize: 24, fontWeight: '600', marginTop: 8, fontFamily: 'Poppins_600SemiBold' },
  subText: { fontSize: 14, textAlign: 'center', marginTop: 4, fontFamily: 'Montserrat_400Regular' },
  navButtonsScrollView: { marginBottom: 16 },
  navButtonsContainer: { flexDirection: 'row', paddingHorizontal: 20, gap: 8, justifyContent: 'flex-start' },
   navButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 16, borderWidth: 1, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 1, shadowOffset: { width: 0, height: 1 }, elevation: 1, gap: 3, minWidth: 70, marginRight: 6 },
   navButtonText: { fontSize: 11, fontWeight: '600', fontFamily: 'Poppins_600SemiBold' },
   activeNavButton: { backgroundColor: '#F59E0B', borderColor: '#F59E0B' },
   activeNavButtonText: { color: '#FFFFFF' },
   settleUpContent: { paddingHorizontal: 20 },
   settleUpHeader: { alignItems: 'center', paddingVertical: 16 },
   settleUpTitle: { fontSize: 16, fontFamily: 'Montserrat_600SemiBold', marginBottom: 6 },
   settleUpAmount: { fontSize: 28, fontWeight: '600', fontFamily: 'Poppins_600SemiBold' },
   expensesSection: { paddingBottom: 80 },
   expensesHeader: { fontSize: 16, fontFamily: 'Montserrat_600SemiBold', marginBottom: 12 },
   expenseItem: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 10, borderBottomWidth: 1 },
   expenseLeft: { alignItems: 'center', width: 50, marginRight: 12 },
   expenseDate: { fontSize: 12, fontFamily: 'Montserrat_400Regular', marginBottom: 4 },
   expenseCenter: { flex: 1 },
   expenseTitle: { fontSize: 16, fontFamily: 'Poppins_500Medium', marginBottom: 4 },
   expensePaidBy: { fontSize: 14, fontFamily: 'Montserrat_400Regular' },
   expenseRight: { alignItems: 'flex-end', width: 90 },
   expenseStatus: { fontSize: 12, fontFamily: 'Montserrat_400Regular', marginBottom: 2 },
   expenseAmount: { fontSize: 14, fontFamily: 'Poppins_500Medium' },
   settledMessage: { alignItems: 'center', paddingVertical: 16, marginTop: 16 },
   settledText: { fontSize: 14, fontFamily: 'Montserrat_400Regular', textAlign: 'center', marginBottom: 8 },
   tapToShowText: { fontSize: 14, fontFamily: 'Montserrat_500Medium' },
});