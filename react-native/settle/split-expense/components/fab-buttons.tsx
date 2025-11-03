import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface FabButtonsProps {
  onAddExpensePress?: () => void;
}

export default function FabButtons({ onAddExpensePress }: FabButtonsProps) {
  return (
    <View style={styles.fabContainer} pointerEvents="box-none">
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
    bottom: 12,
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
