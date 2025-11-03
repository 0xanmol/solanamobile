import { Colors } from '@/constants/colors';
import { BorderRadius, Spacing } from '@/constants/spacing';
import { FontFamily, FontSize } from '@/constants/typography';
import React from 'react';
import {
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    ViewStyle,
} from 'react-native';

interface PillProps {
  label: string;
  onPress?: () => void;
  variant?: 'default' | 'primary' | 'success' | 'error' | 'warning';
  size?: 'small' | 'medium';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Pill: React.FC<PillProps> = ({
  label,
  onPress,
  variant = 'default',
  size = 'medium',
  style,
  textStyle,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.base,
        styles[variant],
        styles[size],
        style,
      ]}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <Text style={[styles.text, styles[`${variant}Text`], styles[`${size}Text`], textStyle]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius['2xl'],
  },
  
  // Variants
  default: {
    backgroundColor: Colors.slate100,
  },
  primary: {
    backgroundColor: Colors.primaryLight,
  },
  success: {
    backgroundColor: Colors.successLight,
  },
  error: {
    backgroundColor: Colors.errorLight,
  },
  warning: {
    backgroundColor: Colors.warningLight,
  },
  
  // Sizes
  small: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
  },
  medium: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
  },
  
  // Text styles
  text: {
    fontFamily: FontFamily.poppinsMedium,
  },
  defaultText: {
    color: Colors.textPrimary,
  },
  primaryText: {
    color: Colors.primary,
  },
  successText: {
    color: Colors.success,
  },
  errorText: {
    color: Colors.error,
  },
  warningText: {
    color: Colors.warning,
  },
  smallText: {
    fontSize: FontSize.xs,
  },
  mediumText: {
    fontSize: FontSize.sm,
  },
});

