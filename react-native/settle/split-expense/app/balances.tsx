import TabLayoutWrapper from '@/components/TabLayoutWrapper';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, useFocusEffect, useLocalSearchParams } from 'expo-router';
import React, { useState, useCallback, useMemo } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getBalances, settleUp, Balance } from '@/apis/balances';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getSolToUsdRate, convertUsdToSol } from '@/solana/transaction';
import { useConnection, useAuthorization } from '@/components/providers';
import { useMWAWallet } from '@/components/hooks';
import { Transaction, SystemProgram, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import Toast from 'react-native-toast-message';

export default function BalancesScreen() {
  const router = useRouter();
  const { groupId } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  // Solana hooks
  const connection = useConnection();
  const wallet = useMWAWallet();
  const { authorization } = useAuthorization();

  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [balances, setBalances] = useState<Balance[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [settlingId, setSettlingId] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const userJson = await AsyncStorage.getItem('user_data');
      setCurrentUser(userJson ? JSON.parse(userJson) : null);

      console.log('📊 Fetching balances for groupId:', groupId);
      const response = await getBalances(groupId as string | undefined);
      console.log('📊 Balances API response:', JSON.stringify(response, null, 2));

      if (response.success) {
        console.log('📊 Setting balances:', response.data.length, 'items');
        setBalances(response.data);
        // Expand the first 'owes' type by default if it exists
        const firstOwes = response.data.find(b => b.type === 'owes');
        if (firstOwes) {
          setExpandedItems([firstOwes.id]);
        }
      } else {
        console.error("Failed to fetch balances:", response.message);
      }
    } catch (error) {
      console.error("Error fetching balances:", error);
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  const { youOwe, owedToYou, totalYouOwe, totalOwedToYou, netBalance } = useMemo(() => {
    const youOwe = balances.filter(b => b.type === 'owes');
    const owedToYou = balances.filter(b => b.type === 'gets_back');

    const totalYouOwe = youOwe.reduce((sum, b) => sum + b.amount, 0);
    const totalOwedToYou = owedToYou.reduce((sum, b) => sum + b.amount, 0);

    const netBalance = totalOwedToYou - totalYouOwe;

    return { youOwe, owedToYou, totalYouOwe, totalOwedToYou, netBalance };
  }, [balances]);

  const handleSettleUp = async (
    debtorId: string,
    creditorId: string,
    amount: number,
    recipientPubkey: string,
    balanceId: string
  ) => {
    // Prevent multiple simultaneous settlements
    if (settlingId) {
      Toast.show({
        type: 'info',
        text1: 'Please wait',
        text2: 'A settlement is already in progress',
      });
      return;
    }

    // Check wallet connection
    if (!wallet || !authorization) {
      Toast.show({
        type: 'error',
        text1: 'Wallet Not Connected',
        text2: 'Please reconnect your wallet and try again',
        visibilityTime: 4000,
      });
      return;
    }

    setSettlingId(balanceId);

    try {
      // Step 1: Get SOL price and convert USD to SOL
      console.log('Getting SOL price...');
      const solPriceInUsd = await getSolToUsdRate();
      if (!solPriceInUsd) {
        throw new Error('Could not determine SOL to USD conversion rate.');
      }

      const amountInSol = convertUsdToSol(amount, solPriceInUsd);
      const lamports = Math.floor(amountInSol * LAMPORTS_PER_SOL);

      console.log('Sending SOL transaction...', {
        recipientPubkey,
        amountUSD: amount,
        amountSOL: amountInSol,
        lamports
      });

      // Step 2: Build transaction
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();

      const transaction = new Transaction({
        feePayer: wallet.publicKey,
        blockhash,
        lastValidBlockHeight,
      }).add(
        SystemProgram.transfer({
          fromPubkey: wallet.publicKey,
          toPubkey: new PublicKey(recipientPubkey),
          lamports,
        })
      );

      // Step 3: Sign and send transaction
      const signature = await wallet.signAndSendTransaction(transaction);
      console.log('Transaction sent:', signature);

      // Step 4: Confirm transaction
      const confirmation = await connection.confirmTransaction({
        signature,
        blockhash,
        lastValidBlockHeight,
      });

      if (confirmation.value.err) {
        throw new Error('Transaction failed: ' + JSON.stringify(confirmation.value.err));
      }

      console.log('Transaction confirmed:', signature);

      // Step 5: Record settlement in backend with transaction signature
      const settlementData = {
        from: debtorId,
        to: creditorId,
        amount,
        groupId: groupId as string | undefined,
        transactionSignature: signature
      };
      console.log('Sending settlement to backend:', settlementData);

      const result = await settleUp(settlementData);

      if (result.success) {
        Toast.show({
          type: 'success',
          text1: 'Settlement Complete! 🎉',
          text2: `Payment of $${amount.toFixed(2)} sent successfully`,
          visibilityTime: 3000,
        });
        // Refresh balances to show updated state
        fetchData();
      } else {
        Toast.show({
          type: 'error',
          text1: 'Warning',
          text2: `Transaction sent but failed to record: ${result.message}`,
          visibilityTime: 4000,
        });
        // Still refresh to see if backend state changed
        fetchData();
      }
    } catch (error: any) {
      console.error('Settlement error:', error);

      let errorMessage = 'Please try again';
      if (error.message) {
        if (error.message.includes('User declined') || error.message.includes('User rejected')) {
          errorMessage = 'Transaction was declined';
        } else if (error.message.includes('Insufficient funds')) {
          errorMessage = 'Insufficient SOL balance for this transaction';
        } else {
          errorMessage = error.message;
        }
      }

      Toast.show({
        type: 'error',
        text1: 'Settlement Failed',
        text2: errorMessage,
        visibilityTime: 4000,
      });
    } finally {
      setSettlingId(null);
    }
  };

  const renderSummary = () => (
    <View style={[newStyles.summaryContainer, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
      <View style={newStyles.summaryBox}>
        <Text style={[newStyles.summaryLabel, { color: colors.icon }]}>You owe</Text>
        <Text style={[newStyles.summaryAmount, { color: colors.error }]}>${totalYouOwe.toFixed(2)}</Text>
      </View>
      <View style={newStyles.summaryBox}>
        <Text style={[newStyles.summaryLabel, { color: colors.icon }]}>You are owed</Text>
        <Text style={[newStyles.summaryAmount, { color: colors.success }]}>${totalOwedToYou.toFixed(2)}</Text>
      </View>
      <View style={newStyles.summaryBox}>
        <Text style={[newStyles.summaryLabel, { color: colors.icon }]}>Net balance</Text>
        <Text style={[newStyles.summaryAmount, { color: netBalance < 0 ? colors.error : colors.success }]}>
          {netBalance < 0 ? '-' : ''}${Math.abs(netBalance).toFixed(2)}
        </Text>
      </View>
    </View>
  );

  const renderBalanceRow = (balance: Balance) => {
    const isOwedToYou = balance.type === 'gets_back';
    if (!currentUser) return null;

    const isSettling = settlingId === balance.id;

    return (
      <View key={balance.id} style={[newStyles.balanceRow, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <View style={newStyles.balanceInfo}>
          {isOwedToYou ? (
            <Text style={[newStyles.balanceText, { color: colors.text }]}>
              <Text style={newStyles.bold}>{balance.userName}</Text> owes you <Text style={[newStyles.bold, { color: colors.success }]}>{balance.amount.toFixed(2)} USD</Text>
            </Text>
          ) : (
            <Text style={[newStyles.balanceText, { color: colors.text }]}>
              You owe <Text style={newStyles.bold}>{balance.userName}</Text> <Text style={[newStyles.bold, { color: colors.error }]}>{balance.amount.toFixed(2)} USD</Text>
            </Text>
          )}
        </View>
        {/* Only show settle button when YOU owe someone */}
        {!isOwedToYou && (
          <TouchableOpacity
            style={[newStyles.settleButton, { backgroundColor: colors.success }, isSettling && newStyles.settleButtonDisabled]}
            onPress={() => handleSettleUp(
              currentUser.id,      // debtor (you)
              balance.userId,      // creditor (person you owe)
              balance.amount,
              balance.userPubkey,  // recipient pubkey
              balance.id
            )}
            disabled={isSettling || settlingId !== null}
          >
            {isSettling ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={newStyles.settleButtonText}>Settle up</Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    );
  };

  if (loading) {
    return <View style={[newStyles.loadingContainer, { backgroundColor: colors.background }]}><ActivityIndicator size="large" color={colors.tint} /></View>;
  }

  return (
    <TabLayoutWrapper>
      <SafeAreaView style={[newStyles.container, { backgroundColor: colors.cardBackground }]} edges={['top']}>
        <View style={[newStyles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
          <TouchableOpacity style={newStyles.backButton} onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[newStyles.headerTitle, { color: colors.text }]}>Balances</Text>
          <View style={{ width: 40 }} />
        </View>

        {renderSummary()}

        <ScrollView style={newStyles.content} showsVerticalScrollIndicator={false}>
          {balances.length === 0 ? (
            <View style={newStyles.emptyStateContainer}>
              <Text style={[newStyles.emptyStateText, { color: colors.icon }]}>You are all settled up.</Text>
            </View>
          ) : (
            <>
              {youOwe.length > 0 && (
                <View style={newStyles.section}>
                  <Text style={[newStyles.sectionHeader, { color: colors.icon }]}>YOU OWE</Text>
                  {youOwe.map(renderBalanceRow)}
                </View>
              )}
              {owedToYou.length > 0 && (
                <View style={newStyles.section}>
                  <Text style={[newStyles.sectionHeader, { color: colors.icon }]}>YOU ARE OWED</Text>
                  {owedToYou.map(renderBalanceRow)}
                </View>
              )}
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </TabLayoutWrapper>
  );
}

const newStyles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1 },
  headerTitle: { fontSize: 20, fontFamily: 'Montserrat_600SemiBold' },
  backButton: { padding: 8 },
  summaryContainer: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 16, borderBottomWidth: 1 },
  summaryBox: { alignItems: 'center' },
  summaryLabel: { fontSize: 14, marginBottom: 4, fontFamily: 'Montserrat_500Medium' },
  summaryAmount: { fontSize: 20, fontFamily: 'Poppins_600SemiBold' },
  green: { },
  red: { },
  content: { flex: 1 },
  section: { marginTop: 16 },
  sectionHeader: { fontSize: 12, fontFamily: 'Montserrat_600SemiBold', paddingHorizontal: 20, marginBottom: 8 },
  balanceRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12, borderBottomWidth: 1 },
  balanceInfo: { flex: 1 },
  balanceText: { fontSize: 16 },
  bold: { fontFamily: 'Poppins_600SemiBold' },
  settleButton: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  settleButtonDisabled: { opacity: 0.6 },
  settleButtonText: { color: '#FFFFFF', fontSize: 14, fontFamily: 'Poppins_500Medium' },
  emptyStateContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 100 },
  emptyStateText: { fontSize: 18 },
});
