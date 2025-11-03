import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { FontFamily, FontSize } from '@/constants/typography';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  rightComponent?: React.ReactNode;
  style?: ViewStyle;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showBackButton = true,
  onBackPress,
  rightComponent,
  style,
}) => {
  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  return (
    <View style={[styles.container, style]}>
      {showBackButton ? (
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color={Colors.black} />
        </TouchableOpacity>
      ) : (
        <View style={styles.spacer} />
      )}
      
      <Text style={styles.title}>{title}</Text>
      
      {rightComponent || <View style={styles.spacer} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.slate100,
    backgroundColor: Colors.white,
  },
  backButton: {
    padding: Spacing.sm - 2,
  },
  title: {
    fontSize: FontSize.lg,
    fontFamily: FontFamily.montserratSemiBold,
    color: Colors.black,
  },
  spacer: {
    width: 32,
  },
});

