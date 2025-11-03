import TabLayoutWrapper from '@/components/TabLayoutWrapper';
import FabButtons from '@/components/fab-buttons';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import React, { useState, useMemo } from 'react';
import {
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ActivityItem {
  id: string;
  icon: React.ReactNode;
  tileColor: string;
  titleLine1: string;
  titleLine2?: string;
  meta: string;
}

const activities: ActivityItem[] = [
    {
      id: '1',
      icon: <MaterialIcons name="list" size={24} color="#ffffff" />,
      tileColor: '#781D27',
      titleLine1: 'You created the group "Uu3uu".',
      meta: 'Today, 2:54 am',
    },
    {
      id: '2',
      icon: <MaterialCommunityIcons name="silverware-variant" size={24} color="#ffffff" />,
      tileColor: '#DDEEE4',
      titleLine1: 'You added "Bought coffee" in "Jje".',
      titleLine2: 'You do not owe anything',
      meta: '6 days ago, 9:10 pm',
    },
    {
      id: '3',
      icon: <MaterialIcons name="description" size={24} color="#ffffff" />,
      tileColor: '#E5E7EB',
      titleLine1: 'You added "I3i3i" in "Jje".',
      titleLine2: 'You do not owe anything',
      meta: '6 days ago, 9:08 pm',
    },
    {
      id: '4',
      icon: <MaterialIcons name="home" size={24} color="#ffffff" />,
      tileColor: '#781D27',
      titleLine1: 'You created the group "Jje".',
      meta: '6 days ago, 9:08 pm',
    },
];

export default function ActivityScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const renderActivityItem = (activity: ActivityItem) => (
    <View
      key={activity.id}
      style={styles.row}
    >
      <View style={[styles.tile, { backgroundColor: activity.tileColor }]}> 
        {activity.icon}
        <View style={styles.quarterCircle}>
          <Image
            source={require('../../assets/images/android-icon-foreground.png')}
            style={styles.quarterCircleImage}
          />
        </View>
      </View>
      <View style={styles.rowTextWrap}>
        <Text style={styles.rowTitle}>{activity.titleLine1}</Text>
        {activity.titleLine2 ? (
          <Text style={styles.rowSubtle}>{activity.titleLine2}</Text>
        ) : null}
        <Text style={styles.rowMeta}>{activity.meta}</Text>
      </View>
    </View>
  );

  const filteredActivities = useMemo(() => {
    if (!searchQuery.trim()) {
      return activities;
    }
    const query = searchQuery.toLowerCase();
    return activities.filter(activity => 
      activity.titleLine1.toLowerCase().includes(query) ||
      activity.titleLine2?.toLowerCase().includes(query) ||
      activity.meta.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  return (
    <TabLayoutWrapper>
      <SafeAreaView style={[styles.container, { backgroundColor: '#FFFFFF' }]} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.title}>Activity</Text>
          <TouchableOpacity 
            style={styles.searchBtn}
            onPress={() => setShowSearchModal(true)}
          >
            <MaterialIcons name="search" size={24} color="#1F2937" />
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.content} 
          showsVerticalScrollIndicator={false}
        >
          {filteredActivities.map(renderActivityItem)}
        </ScrollView>

        <FabButtons
          onAddExpensePress={() => router.push('/add-expense')}
        />
      </SafeAreaView>

      {/* Search Modal */}
      <Modal
        visible={showSearchModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => {
          setShowSearchModal(false);
          setSearchQuery('');
        }}
      >
        <View style={styles.searchModalOverlay}>
          <View style={styles.searchModalContainer}>
            <View style={styles.searchModalHeader}>
              <Text style={styles.searchModalTitle}>Search Activity</Text>
              <TouchableOpacity onPress={() => {
                setShowSearchModal(false);
                setSearchQuery('');
              }}>
                <MaterialIcons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <View style={styles.searchInputContainer}>
              <MaterialIcons name="search" size={20} color="#6B7280" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search activity..."
                placeholderTextColor="#6B7280"
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <MaterialIcons name="clear" size={20} color="#6B7280" />
                </TouchableOpacity>
              )}
            </View>

            <ScrollView style={styles.searchResults}>
              {filteredActivities.length > 0 ? (
                filteredActivities.map(activity => (
                  <TouchableOpacity
                    key={activity.id}
                    style={styles.searchResultItem}
                    onPress={() => {
                      setShowSearchModal(false);
                      setSearchQuery('');
                    }}
                  >
                    {renderActivityItem(activity)}
                  </TouchableOpacity>
                ))
              ) : (
                <View style={styles.noResultsContainer}>
                  <Text style={styles.noResultsText}>No activities found</Text>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </TabLayoutWrapper>
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
    borderBottomColor: '#F3F4F6',
  },
  title: {
    fontSize: 28,
    color: '#1F2937',
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
    borderColor: '#FFFFFF',
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
    color: '#1F2937',
    fontFamily: 'Poppins_600SemiBold',
  },
  rowSubtle: {
    fontSize: 14,
    color: '#1F2937',
    marginTop: 2,
    fontFamily: 'Poppins_400Regular',
  },
  rowMeta: {
    marginTop: 4,
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'Montserrat_400Regular',
  },
  searchModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchModalContainer: {
    width: '90%',
    maxWidth: 500,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    maxHeight: '80%',
    paddingBottom: 20,
  },
  searchModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  searchModalTitle: {
    fontSize: 18,
    color: '#1F2937',
    fontFamily: 'Montserrat_600SemiBold',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 20,
    marginTop: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    fontFamily: 'Poppins_400Regular',
  },
  searchResults: {
    maxHeight: 400,
    marginTop: 16,
    paddingHorizontal: 20,
  },
  searchResultItem: {
    paddingVertical: 8,
  },
  noResultsContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 16,
    color: '#6B7280',
    fontFamily: 'Poppins_400Regular',
  },
});
