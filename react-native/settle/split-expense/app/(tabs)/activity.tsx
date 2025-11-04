import TabLayoutWrapper from '@/components/TabLayoutWrapper';
import FabButtons from '@/components/fab-buttons';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter, useFocusEffect } from 'expo-router';
import React, { useState, useMemo, useCallback } from 'react';
import { getActivity } from '@/apis/activity';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    ActivityIndicator,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
}

interface FormattedActivity {
  id: string;
  icon: React.ReactNode;
  tileColor: string;
  titleLine1: string;
  titleLine2?: string;
  meta: string;
  rawActivity: Activity;
}

export default function ActivityScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activities, setActivities] = useState<Activity[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const formatTimeAgo = (dateString: string) => {
    // SQLite stores timestamps in UTC, so we need to treat them as UTC
    // Add 'Z' suffix if not present to ensure UTC parsing
    const utcDateString = dateString.endsWith('Z') ? dateString : `${dateString}Z`;
    const date = new Date(utcDateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined });
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'group_created':
        return <MaterialIcons name="group-add" size={24} color="#ffffff" />;
      case 'expense_added':
        return <MaterialIcons name="receipt" size={24} color="#ffffff" />;
      case 'expense_edited':
        return <MaterialIcons name="edit" size={24} color="#ffffff" />;
      case 'payment_made':
        return <MaterialIcons name="payment" size={24} color="#ffffff" />;
      case 'member_added':
        return <MaterialIcons name="person-add" size={24} color="#ffffff" />;
      case 'member_left':
        return <MaterialIcons name="person-remove" size={24} color="#ffffff" />;
      default:
        return <MaterialIcons name="info" size={24} color="#ffffff" />;
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

  useFocusEffect(
    useCallback(() => {
      const fetchActivities = async () => {
        setLoading(true);
        try {
          const userJson = await AsyncStorage.getItem('user_data');
          const user = userJson ? JSON.parse(userJson) : null;
          setCurrentUser(user);

          const response = await getActivity();
          if (response && response.success && Array.isArray(response.data)) {
            setActivities(response.data);
          } else {
            console.warn('Could not fetch activities');
            setActivities([]);
          }
        } catch (error) {
          console.error('Error fetching activities:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchActivities();
    }, [])
  );

  const formattedActivities = useMemo(() => {
    return activities.map((activity): FormattedActivity => {
      const isCurrentUser = activity.user_id === currentUser?.id;
      const userName = isCurrentUser ? 'You' : activity.user_name;

      let titleLine1 = activity.description;
      let titleLine2: string | undefined;

      // Format based on activity type
      if (activity.type === 'expense_added' && activity.expense_description) {
        titleLine1 = `${userName} added "${activity.expense_description}"${activity.group_name ? ` in "${activity.group_name}"` : ''}`;
        if (activity.expense_amount) {
          titleLine2 = `Amount: $${activity.expense_amount.toFixed(2)}`;
        }
      } else if (activity.type === 'group_created' && activity.group_name) {
        titleLine1 = `${userName} created the group "${activity.group_name}"`;
      } else if (activity.type === 'payment_made' && activity.amount) {
        titleLine2 = `Amount: $${activity.amount.toFixed(2)}`;
      }

      return {
        id: activity.id,
        icon: getActivityIcon(activity.type),
        tileColor: getActivityColor(activity.type),
        titleLine1,
        titleLine2,
        meta: formatTimeAgo(activity.created_at),
        rawActivity: activity,
      };
    });
  }, [activities, currentUser]);

  const renderActivityItem = (activity: FormattedActivity) => (
    <TouchableOpacity
      key={activity.id}
      style={styles.row}
      onPress={() => router.push({
        pathname: '/activity-detail/[id]',
        params: {
          id: activity.id,
          activityData: JSON.stringify(activity.rawActivity)
        }
      })}
    >
      <View style={[styles.tile, { backgroundColor: activity.tileColor }]}>
        {activity.icon}
        <View style={[styles.quarterCircle, { borderColor: colors.background }]}>
          <Image
            source={require('../../assets/images/android-icon-foreground.png')}
            style={styles.quarterCircleImage}
          />
        </View>
      </View>
      <View style={styles.rowTextWrap}>
        <Text style={[styles.rowTitle, { color: colors.text }]}>{activity.titleLine1}</Text>
        {activity.titleLine2 ? (
          <Text style={[styles.rowSubtle, { color: colors.text }]}>{activity.titleLine2}</Text>
        ) : null}
        <Text style={[styles.rowMeta, { color: colors.icon }]}>{activity.meta}</Text>
      </View>
    </TouchableOpacity>
  );

  const filteredActivities = useMemo(() => {
    if (!searchQuery.trim()) {
      return formattedActivities;
    }
    const query = searchQuery.toLowerCase();
    return formattedActivities.filter(activity =>
      activity.titleLine1.toLowerCase().includes(query) ||
      activity.titleLine2?.toLowerCase().includes(query) ||
      activity.meta.toLowerCase().includes(query)
    );
  }, [searchQuery, formattedActivities]);

  if (loading) {
    return (
      <TabLayoutWrapper>
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>Activity</Text>
          </View>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.tint} />
          </View>
        </SafeAreaView>
      </TabLayoutWrapper>
    );
  }

  return (
    <TabLayoutWrapper>
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Text style={[styles.title, { color: colors.text }]}>Activity</Text>
          <TouchableOpacity
            style={styles.searchBtn}
            onPress={() => {
              setShowSearchBar(!showSearchBar);
              if (showSearchBar) {
                setSearchQuery('');
              }
            }}
          >
            <MaterialIcons name={showSearchBar ? "close" : "search"} size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Inline Search Bar */}
          {showSearchBar && (
            <View style={[styles.inlineSearchContainer, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
              <MaterialIcons name="search" size={20} color={colors.icon} />
              <TextInput
                style={[styles.inlineSearchInput, { color: colors.text }]}
                placeholder="Search activity..."
                placeholderTextColor={colors.icon}
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <MaterialIcons name="clear" size={20} color={colors.icon} />
                </TouchableOpacity>
              )}
            </View>
          )}

          {filteredActivities.length > 0 ? (
            filteredActivities.map(renderActivityItem)
          ) : (
            <View style={styles.emptyContainer}>
              <MaterialIcons name={searchQuery.trim() ? "search-off" : "history"} size={64} color={colors.icon} />
              <Text style={[styles.emptyText, { color: colors.text }]}>
                {searchQuery.trim() ? 'No activity found' : 'No activity yet'}
              </Text>
              <Text style={[styles.emptySubtext, { color: colors.icon }]}>
                {searchQuery.trim() ? 'Try a different search term' : 'Your group and expense activity will appear here'}
              </Text>
            </View>
          )}
        </ScrollView>

        <FabButtons
          onAddExpensePress={() => router.push('/add-expense')}
          isTabScreen={true}
        />
      </SafeAreaView>
    </TabLayoutWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 80,
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 20,
    fontFamily: 'Poppins_600SemiBold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: 'Montserrat_400Regular',
    textAlign: 'center',
    lineHeight: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Montserrat_600SemiBold',
  },
  searchBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  inlineSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    marginBottom: 16,
    borderWidth: 1,
  },
  inlineSearchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  tile: {
    width: 60,
    height: 60,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  quarterCircle: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#0F766E',
    overflow: 'hidden',
    borderWidth: 1,
  },
  quarterCircleImage: {
    width: '100%',
    height: '100%',
  },
  rowTextWrap: {
    flex: 1,
    paddingLeft: 12,
  },
  rowTitle: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
  },
  rowSubtle: {
    fontSize: 14,
    marginTop: 2,
    fontFamily: 'Poppins_400Regular',
  },
  rowMeta: {
    marginTop: 4,
    fontSize: 12,
    fontFamily: 'Montserrat_400Regular',
  },
});
