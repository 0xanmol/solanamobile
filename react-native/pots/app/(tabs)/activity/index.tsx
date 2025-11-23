import React, { useMemo, useCallback, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  Text,
  Platform,
} from 'react-native';
import { useAppStore } from '@/store/app-store';
import { useWalletUi } from '@/components/solana/use-wallet-ui';
import { AppText } from '@/components/app-text';
import { AppPage } from '@/components/app-page';
import { useScrollContext } from '@/components/tab-bar/scroll-context';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ellipsify } from '@/utils/ellipsify';
import { useRouter } from 'expo-router';
import type { Activity } from '@/store/app-store';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '@/hooks/use-app-theme';
import { Animated } from 'react-native';
import { Fonts } from '@/constants/fonts';

export default function ActivityScreen() {
  const { palette, isDark } = useAppTheme();
  const { scrollY, handleScroll } = useScrollContext();

  const [searchQuery, setSearchQuery] = useState('');
  const { account } = useWalletUi();
  const { activities, getFriendByAddress } = useAppStore();
  const router = useRouter();

  /* ---------- ICON HELPERS (COLORS & TYPES) ---------- */
  const getActivityIcon = useCallback((type: string) => {
    switch (type) {
      case 'pot_created': return 'savings';
      case 'contribution': return 'account-balance-wallet';
      case 'release': return 'check-circle';
      case 'friend_added': return 'person-add';
      default: return 'notifications';
    }
  }, []);

  const getActivityColor = useCallback((type: string) => {
    switch (type) {
      case 'pot_created':
      case 'contribution': return palette.accent;
      case 'release':
      case 'friend_added': return palette.accentSecondary;
      default: return palette.textSecondary;
    }
  }, [palette]);

  /* ---------- MESSAGE BUILDER ---------- */
  const getActivityMessage = useCallback((activity: Activity) => {
    const friend = activity.friendAddress ? getFriendByAddress(activity.friendAddress) : null;
    const friendName = friend?.displayName || (activity.friendAddress ? ellipsify(activity.friendAddress, 8) : null);
    const userName = activity.userName || (activity.userId ? ellipsify(activity.userId, 8) : 'Someone');

    switch (activity.type) {
      case 'pot_created': return { primary: `${userName} created`, secondary: activity.potName || 'a pot' };
      case 'contribution': return { primary: `${userName} contributed`, secondary: `${activity.amount?.toFixed(2)} ${activity.currency} to ${activity.potName || 'a pot'}` };
      case 'release': return { primary: `${userName} released`, secondary: activity.potName || 'a pot' };
      case 'friend_added': return { primary: `${userName} added`, secondary: friendName || 'a friend' };
      default: return { primary: 'Unknown activity', secondary: '' };
    }
  }, [getFriendByAddress]);

  /* ---------- FILTER RELEVANT ACTIVITIES ---------- */
  const relevantActivities = useMemo(() => {
    if (!account) return activities;

    const userPots = useAppStore.getState().getUserPots(account.address);
    const userFriends = useAppStore.getState().friends;

    return activities.filter((a) => {
      const isUserPot = userPots.some((p) => p.id === a.potId);
      const isUserFriend = userFriends.some((f) => f.address === a.userId || f.address === a.friendAddress);
      return isUserPot || isUserFriend || a.userId === account.address;
    });
  }, [account, activities]);

  /* ---------- SEARCH FILTER ---------- */
  const filteredActivities = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return relevantActivities;
    return relevantActivities.filter((a) => {
      const msg = getActivityMessage(a);
      return (
        msg.primary.toLowerCase().includes(q) ||
        msg.secondary.toLowerCase().includes(q) ||
        (a.potName?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [relevantActivities, searchQuery, getActivityMessage]);

  /* ---------- GROUP BY DATE (STRICT iOS STYLE) ---------- */
  const grouped = useMemo(() => {
    if (filteredActivities.length === 0) return [];

    const sorted = [...filteredActivities].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const weekAgo = new Date(today);
    weekAgo.setDate(today.getDate() - 7);

    const groups: { label: string; list: Activity[] }[] = [];
    let current: { label: string; list: Activity[] } | null = null;

    sorted.forEach((a) => {
      const d = new Date(a.timestamp);
      let label = '';

      if (d >= today) label = 'Today';
      else if (d >= yesterday) label = 'Yesterday';
      else if (d >= weekAgo) label = 'This week';
      else label = d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

      if (!current || current.label !== label) {
        if (current) groups.push(current);
        current = { label, list: [] };
      }
      current.list.push(a);
    });

    if (current) groups.push(current);
    return groups;
  }, [filteredActivities]);

  /* ---------- TIME FORMAT ---------- */
  const formatTime = useCallback((d: Date) => {
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const mins = Math.floor(diff / 60000);
    const hrs = Math.floor(mins / 60);
    const days = Math.floor(hrs / 24);

    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m`;
    if (hrs < 24) return `${hrs}h`;
    if (days < 7) return `${days}d`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }, []);

  /* ---------- RENDER ---------- */
  return (
    <AppPage>
      <LinearGradient
        colors={palette.gradient}
        locations={isDark ? [0, 0.55, 1] : [0, 0.5, 1]}
        style={s.gradient}
      >
      <Animated.ScrollView
        style={s.container}
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[1]}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false, listener: handleScroll }
        )}
      >

        {/* Header */}
        <View style={s.header}>
          <Pressable onPress={() => router.back()} style={({ pressed }) => [s.navBtn, { opacity: pressed ? 0.5 : 1 }]}> 
              <MaterialIcons name="chevron-left" size={20} color={palette.text} />
          </Pressable>

            <AppText style={[s.headerTitle, { color: palette.text }]}>Activity</AppText>

          <View style={s.navBtn} />
        </View>

        {/* SEARCH BAR */}
          <View style={[s.stickyHeader, { backgroundColor: 'transparent' }]}>
            <View style={[s.searchBox, { backgroundColor: palette.surfaceMuted, borderColor: palette.border }]}>
              <MaterialIcons name="search" size={18} color={palette.textSecondary} />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search..."
                placeholderTextColor={palette.textSecondary}
                style={[s.searchInput, { color: palette.text }]}
              keyboardAppearance={isDark ? 'dark' : 'light'}
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => setSearchQuery('')}>
                  <MaterialIcons name="close" size={16} color={palette.textSecondary} />
              </Pressable>
            )}
          </View>
        </View>

        {/* EMPTY STATE */}
        {grouped.length === 0 && (
          <View style={s.emptyWrap}>
              <MaterialIcons name="notifications" size={36} color={palette.textSecondary} />
              <AppText style={[s.emptyTitle, { color: palette.text }]}>No activity yet</AppText>
              <AppText style={[s.emptySubtitle, { color: palette.textSecondary }]}>Activity will appear here.</AppText>
              </View>
        )}

        {/* LIST */}
        {grouped.map((g) => (
          <View key={g.label}>
              <AppText style={[s.sectionLabel, { color: palette.textSecondary }]}>{g.label}</AppText>

            {g.list.map((a) => {
              const msg = getActivityMessage(a);
              const icon = getActivityIcon(a.type);
              const col = getActivityColor(a.type);
              const cardBackground = isDark ? palette.surface : '#FFFFFF';

              return (
                <View key={a.id} style={s.rowWrapper}>
                  <Pressable
                    style={({ pressed }) => [
                      s.row,
                        {
                        backgroundColor: pressed
                          ? isDark
                            ? 'rgba(255,255,255,0.08)'
                            : 'rgba(0,0,0,0.05)'
                          : cardBackground,
                        },
                    ]}
                  >
                    <MaterialIcons name={icon} size={22} color={col} style={s.rowIcon} />

                    <View style={s.rowContent}>
                        <AppText numberOfLines={1} style={[s.rowTitle, { color: palette.text }]}>
                        {a.potName || msg.primary}
                </AppText>
                        <AppText numberOfLines={1} style={[s.rowSubtitle, { color: palette.textSecondary }]}> 
                        {msg.secondary || msg.primary}
                </AppText>
              </View>

                      <AppText style={[s.rowTime, { color: palette.textSecondary }]}>{formatTime(new Date(a.timestamp))}</AppText>
                  </Pressable>
                </View>
              );
            })}

            {/* Spacing between groups */}
            <View style={s.groupSpacer} />
          </View>
        ))}

      </Animated.ScrollView>
      </LinearGradient>
    </AppPage>
  );
}

/* Styles */
const s = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  content: {
    paddingTop: 12,
    paddingBottom: 120,
  },
  header: {
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between',
    paddingHorizontal:16,
    paddingBottom:8,
  },
  navBtn:{
    width:36,
    height:36,
    justifyContent:'center',
    alignItems:'center',
  },
  headerTitle:{
    fontSize:20,
    fontFamily:'IBMPlexSans-SemiBold',
  },
  stickyHeader:{
    paddingHorizontal:16,
    paddingTop:4,
    paddingBottom:8,
    zIndex:5,
  },
  searchBox:{
    flexDirection:'row',
    alignItems:'center',
    paddingHorizontal:12,
    paddingVertical:10,
    borderRadius:14,
    gap:8,
    borderWidth:1,
  },
  searchInput:{
    flex:1,
    fontSize:15,
    fontFamily:Fonts.body,
  },
  emptyWrap:{
    alignItems:'center',
    marginTop:32,
    gap:8,
  },
  emptyTitle:{
    fontSize:17,
    fontFamily:'IBMPlexSans-SemiBold',
  },
  emptySubtitle:{
    fontSize:14,
    fontFamily:Fonts.body,
    textAlign:'center',
    lineHeight:20,
  },
  sectionLabel:{
    paddingHorizontal:16,
    paddingTop:24,
    paddingBottom:6,
    fontSize:13,
    fontFamily:'IBMPlexSans-SemiBold',
    textTransform:'uppercase',
    letterSpacing:0.4,
  },
  rowWrapper:{
    paddingHorizontal:16,
    paddingBottom:10,
  },
  row:{
    flexDirection:'row',
    alignItems:'center',
    paddingHorizontal:16,
    paddingVertical:12,
    borderRadius:16,
  },
  rowIcon:{
    marginRight:12,
  },
  rowContent:{
    flex:1,
    minWidth:0,
  },
  rowTitle:{
    fontSize:16,
    fontFamily:'IBMPlexSans-Medium',
    marginBottom:2,
  },
  rowSubtitle:{
    fontSize:13,
    fontFamily:Fonts.body,
  },
  rowTime:{
    fontSize:12,
    fontFamily:Fonts.body,
    marginLeft:8,
  },
  groupSpacer:{
    height:24,
  },
});
