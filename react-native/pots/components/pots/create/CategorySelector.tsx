import React from 'react'
import { View, StyleSheet, ScrollView, TouchableOpacity, Text } from 'react-native'
import { AppText } from '@/components/app-text'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { PotCategory } from '@/store/app-store'

interface CategorySelectorProps {
  category: PotCategory
  palette: any
  cardStyle: any
  onCategoryChange: (category: PotCategory) => void
}

const CATEGORIES = [
  { value: 'Goal' as PotCategory, icon: 'flag', label: 'Goal', color: '#22E1A2' },
  { value: 'Emergency' as PotCategory, icon: 'emergency', label: 'Emergency', color: '#FF6B6B' },
  { value: 'Bills' as PotCategory, icon: 'receipt', label: 'Bills', color: '#4ECDC4' },
  { value: 'Events' as PotCategory, icon: 'event', label: 'Events', color: '#FFD93D' },
  { value: 'Others' as PotCategory, icon: 'category', label: 'Others', color: '#95A5A6' },
] as const

export function CategorySelector({ category, palette, cardStyle, onCategoryChange }: CategorySelectorProps) {
  return (
    <View style={[styles.categorySection, cardStyle]}>
      <AppText style={[styles.categorySectionLabel, { color: palette.label }]}>Category *</AppText>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryScrollContent}
        style={styles.categoryScroll}
      >
        {CATEGORIES.map((cat) => {
          const isSelected = category === cat.value
          return (
            <TouchableOpacity
              key={cat.value}
              onPress={() => onCategoryChange(cat.value)}
              style={[
                styles.categoryOption,
                {
                  backgroundColor: isSelected ? `${cat.color}15` : palette.surfaceMuted,
                  borderColor: isSelected ? cat.color : palette.border,
                  borderWidth: isSelected ? 2 : 1,
                },
              ]}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.categoryIcon,
                  {
                    backgroundColor: isSelected ? cat.color : palette.surfaceMuted,
                  },
                ]}
              >
                <MaterialIcons
                  name={cat.icon as any}
                  size={20}
                  color={isSelected ? '#FFFFFF' : palette.textSecondary}
                />
              </View>
              <AppText
                style={[
                  styles.categoryLabel,
                  {
                    color: isSelected ? palette.text : palette.textSecondary,
                    fontWeight: isSelected ? '600' : '500',
                  },
                ]}
              >
                {cat.label}
              </AppText>
            </TouchableOpacity>
          )
        })}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  categorySection: {
    borderRadius: 22,
    padding: 14,
    gap: 10,
    borderWidth: 1,
  },
  categorySectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  categoryScroll: {
    marginHorizontal: -14,
  },
  categoryScrollContent: {
    paddingHorizontal: 14,
    gap: 10,
  },
  categoryOption: {
    width: 80,
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 12,
    gap: 6,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryLabel: {
    fontSize: 11,
  },
})

