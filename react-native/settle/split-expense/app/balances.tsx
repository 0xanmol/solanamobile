import TabLayoutWrapper from '@/components/TabLayoutWrapper';
import { Colors } from '@/constants/colors';
import { styles } from '@/styles/balances.styles';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function BalancesScreen() {
  const router = useRouter();
  const [expandedItems, setExpandedItems] = useState<number[]>([1]); // First item expanded by default

  const toggleExpanded = (index: number) => {
    setExpandedItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const handleRemind = (debtor: string, creditor: string, amount: string) => {
    console.log(`Remind ${debtor} about ${amount} owed to ${creditor}`);
  };

  const handleSettleUp = (debtor: string, creditor: string, amount: string) => {
    console.log(`Settle up ${amount} between ${debtor} and ${creditor}`);
  };

  const balances = [
    {
      id: 0,
      type: 'gets_back',
      person: 'Saurav Verma',
      amount: '$3,231.00',
      color: '#10B981',
      avatar: 'teal',
    },
    {
      id: 1,
      type: 'owes',
      person: 'Saurav Meghwal',
      amount: '$3,231.00',
      creditor: 'Saurav Verma',
      color: '#F59E0B',
      avatar: 'orange',
      expanded: true,
    },
    {
      id: 2,
      type: 'owes',
      person: 'Saurav Meghwal',
      amount: '$3,231.00',
      color: '#F59E0B',
      avatar: 'orange',
      expanded: false,
    },
  ];

  const renderAvatar = (avatarType: string) => {
    return (
      <View style={[styles.avatar, { backgroundColor: avatarType === 'teal' ? '#10B981' : '#F59E0B' }]}>
        <View style={styles.avatarPattern}>
          <View style={[styles.pattern1, { backgroundColor: avatarType === 'teal' ? '#FFFFFF' : '#FFFFFF' }]} />
          <View style={[styles.pattern2, { backgroundColor: avatarType === 'teal' ? '#10B981' : '#F59E0B' }]} />
        </View>
      </View>
    );
  };

  const renderBalanceItem = (balance: any, index: number) => {
    const isExpanded = expandedItems.includes(index);
    
    return (
      <View key={balance.id} style={styles.balanceItem}>
        <View style={styles.balanceRow}>
          {renderAvatar(balance.avatar)}
          <View style={styles.balanceInfo}>
            {balance.type === 'gets_back' ? (
              <>
                <Text style={styles.balanceText}>{balance.person} gets back</Text>
                <Text style={[styles.balanceAmount, { color: Colors.success }]}>
                  {balance.amount} in total
                </Text>
              </>
            ) : (
              <>
                {isExpanded ? (
                  <>
                    <Text style={styles.balanceText}>
                      {balance.person} owes <Text style={{ color: Colors.success }}>{balance.amount}</Text> to {balance.creditor}
                    </Text>
                    <View style={styles.actionButtons}>
                      <TouchableOpacity 
                        style={styles.remindButton}
                        onPress={() => handleRemind(balance.person, balance.creditor, balance.amount)}
                      >
                        <Text style={styles.remindButtonText}>Remind...</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.settleButton}
                        onPress={() => handleSettleUp(balance.person, balance.creditor, balance.amount)}
                      >
                        <Text style={styles.settleButtonText}>Settle up</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                ) : (
                  <>
                    <Text style={styles.balanceText}>{balance.person} owes</Text>
                    <Text style={[styles.balanceAmount, { color: Colors.warning }]}>
                      {balance.amount} in total
                    </Text>
                  </>
                )}
              </>
            )}
          </View>
          <TouchableOpacity 
            style={styles.expandButton}
            onPress={() => toggleExpanded(index)}
          >
            <MaterialIcons 
              name={isExpanded ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
              size={24} 
              color={Colors.textSecondary} 
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <TabLayoutWrapper>
      <SafeAreaView style={styles.container} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={24} color={Colors.black} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Balances</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {balances.map((balance, index) => renderBalanceItem(balance, index))}
        </ScrollView>

        {/* Bottom Sheet */}
        <View style={styles.bottomSheet}>
          <View style={styles.bottomSheetHandle} />
          <View style={styles.bottomSheetContent}>
            <MaterialIcons name="check-circle" size={20} color={Colors.success} />
            <Text style={styles.bottomSheetText}>Simplify debts is turned on in this group.</Text>
          </View>
        </View>
      </SafeAreaView>
    </TabLayoutWrapper>
  );
}

