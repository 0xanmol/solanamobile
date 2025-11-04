import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Clipboard from 'expo-clipboard';
import Toast from 'react-native-toast-message';

interface Activity {
  id: string;
  type: string;
  description: string;
  user_name: string;
  group_name?: string;
  expense_description?: string;
  expense_amount?: number;
  amount?: number;
  created_at: string;
  user_id: string;
  transaction_signature?: string;
  from_user_name?: string;
  to_user_name?: string;
}

export default function ActivityDetailScreen() {
  const router = useRouter();
  const { id, activityData } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [activity, setActivity] = useState<Activity | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const userJson = await AsyncStorage.getItem('user_data');
        if (userJson) {
          setCurrentUser(JSON.parse(userJson));
        }

        if (activityData && typeof activityData === 'string') {
          const parsedActivity = JSON.parse(activityData);
          setActivity(parsedActivity);
        }
      } catch (error) {
        console.error('Error loading activity data:', error);
      }
    };

    loadData();
  }, [activityData]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'group_created':
        return 'group-add';
      case 'expense_added':
        return 'receipt';
      case 'expense_edited':
        return 'edit';
      case 'payment_made':
        return 'payment';
      case 'member_added':
        return 'person-add';
      case 'member_left':
        return 'person-remove';
      default:
        return 'info';
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'group_created':
        return '#781D27';
      case 'expense_added':
        return '#10B981';
      case 'expense_edited':
        return '#F59E0B';
      case 'payment_made':
        return '#8B5CF6';
      case 'member_added':
        return '#3B82F6';
      case 'member_left':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const formatDate = (dateString: string) => {
    const utcDateString = dateString.endsWith('Z') ? dateString : `${dateString}Z`;
    const date = new Date(utcDateString);
    return date.toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const openTransactionInExplorer = () => {
    if (activity?.transaction_signature) {
      const explorerUrl = `https://explorer.solana.com/tx/${activity.transaction_signature}?cluster=devnet`;
      Linking.openURL(explorerUrl).catch(() => {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Could not open Solana Explorer',
        });
      });
    }
  };

  const copyTransactionSignature = async () => {
    if (activity?.transaction_signature) {
      try {
        await Clipboard.setStringAsync(activity.transaction_signature);
        Toast.show({
          type: 'success',
          text1: 'Copied!',
          text2: 'Transaction hash copied to clipboard',
        });
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to copy transaction hash',
        });
      }
    }
  };

  if (!activity) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Activity Details</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.loadingContainer}>
          <Text style={{ color: colors.text }}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const isCurrentUser = currentUser && activity.user_id === currentUser.id;
  const userName = isCurrentUser ? 'You' : activity.user_name;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Activity Details</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Activity Icon Header */}
        <View style={styles.iconHeader}>
          <View style={[styles.iconContainer, { backgroundColor: getActivityColor(activity.type) }]}>
            <MaterialIcons name={getActivityIcon(activity.type)} size={48} color="#FFFFFF" />
          </View>
        </View>

        {/* Activity Type */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.icon }]}>Activity Type</Text>
          <Text style={[styles.sectionContent, { color: colors.text }]}>
            {activity.type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
          </Text>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.icon }]}>Description</Text>
          <Text style={[styles.sectionContent, { color: colors.text }]}>
            {activity.description}
          </Text>
        </View>

        {/* User */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.icon }]}>Performed By</Text>
          <Text style={[styles.sectionContent, { color: colors.text }]}>{userName}</Text>
        </View>

        {/* Group Name (if exists) */}
        {activity.group_name && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.icon }]}>Group</Text>
            <Text style={[styles.sectionContent, { color: colors.text }]}>{activity.group_name}</Text>
          </View>
        )}

        {/* Expense Description (if exists) */}
        {activity.expense_description && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.icon }]}>Expense</Text>
            <Text style={[styles.sectionContent, { color: colors.text }]}>{activity.expense_description}</Text>
          </View>
        )}

        {/* Amount */}
        {(activity.amount || activity.expense_amount) && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.icon }]}>Amount</Text>
            <Text style={[styles.amountText, { color: activity.type === 'payment_made' ? colors.success : colors.text }]}>
              ${(activity.amount || activity.expense_amount)?.toFixed(2)} USD
            </Text>
          </View>
        )}

        {/* Date and Time */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.icon }]}>Date & Time</Text>
          <Text style={[styles.sectionContent, { color: colors.text }]}>
            {formatDate(activity.created_at)}
          </Text>
        </View>

        {/* Transaction Signature (if exists) */}
        {activity.transaction_signature && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.icon }]}>Transaction Hash</Text>
            <TouchableOpacity
              style={[styles.signatureContainer, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
              onPress={copyTransactionSignature}
            >
              <Text style={[styles.signatureText, { color: colors.text }]} numberOfLines={1} ellipsizeMode="middle">
                {activity.transaction_signature}
              </Text>
              <MaterialIcons name="content-copy" size={20} color={colors.icon} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.explorerButton, { backgroundColor: colors.tint }]}
              onPress={openTransactionInExplorer}
            >
              <MaterialIcons name="open-in-new" size={20} color="#FFFFFF" />
              <Text style={styles.explorerButtonText}>View on Solana Explorer</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
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
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Montserrat_600SemiBold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  iconHeader: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: 'Montserrat_600SemiBold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  sectionContent: {
    fontSize: 16,
    fontFamily: 'Poppins_500Medium',
    lineHeight: 24,
  },
  amountText: {
    fontSize: 28,
    fontFamily: 'Poppins_700Bold',
  },
  signatureContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
  },
  signatureText: {
    flex: 1,
    fontSize: 12,
    fontFamily: 'Montserrat_400Regular',
    marginRight: 8,
  },
  explorerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  explorerButtonText: {
    fontSize: 14,
    fontFamily: 'Poppins_600SemiBold',
    color: '#FFFFFF',
  },
});
