import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface FabButtonsProps {
  onAddExpensePress?: () => void;
  isTabScreen?: boolean; // Whether this is on a screen with bottom tab bar
}

export default function FabButtons({ onAddExpensePress, isTabScreen = false }: FabButtonsProps) {
  const insets = useSafeAreaInsets();

  // For tab screens, add tab bar height (75). For others, just safe area.
  const bottomOffset = isTabScreen ? 12 + insets.bottom : 24 + insets.bottom;

  return (
    <View style={[styles.fabContainer, { bottom: bottomOffset }]} pointerEvents="box-none">
      <TouchableOpacity
        activeOpacity={0.8}
        style={[styles.fabLarge, styles.fabShadow]}
        onPress={onAddExpensePress}
      >
        <MaterialIcons name="receipt-long" size={22} color="#FFFFFF" />
        <Text style={styles.fabLargeText}>Add expense</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  fabContainer: {
    position: 'absolute',
    right: 16,
    gap: 8,
    alignItems: 'flex-end',
  },
  fabShadow: {
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  fabLarge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    borderRadius: 24,
    paddingHorizontal: 16,
    height: 48,
    gap: 8,
  },
  fabLargeText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});
