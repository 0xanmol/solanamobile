import { Colors } from '@/constants/colors';
import { BorderRadius, Shadow, Spacing } from '@/constants/spacing';
import { FontFamily, FontSize } from '@/constants/typography';
import React from 'react';
import {
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    TouchableOpacityProps,
    ViewStyle,
} from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  style,
  textStyle,
  ...props
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.base,
        styles[variant],
        styles[size],
        fullWidth && styles.fullWidth,
        style,
      ]}
      activeOpacity={0.8}
      {...props}
    >
      <Text style={[styles.text, styles[`${variant}Text`], styles[`${size}Text`], textStyle]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.lg,
    ...Shadow.sm,
  },
  fullWidth: {
    width: '100%',
  },
  
  // Variants
  primary: {
    backgroundColor: Colors.primary,
  },
  secondary: {
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  danger: {
    backgroundColor: Colors.error,
  },
  
  // Sizes
  small: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
  },
  medium: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
  },
  large: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing['2xl'],
  },
  
  // Text styles
  text: {
    fontFamily: FontFamily.poppinsSemiBold,
  },
  primaryText: {
    color: Colors.white,
  },
  secondaryText: {
    color: Colors.textPrimary,
  },
  outlineText: {
    color: Colors.primary,
  },
  dangerText: {
    color: Colors.white,
  },
  smallText: {
    fontSize: FontSize.sm,
  },
  mediumText: {
    fontSize: FontSize.md,
  },
  largeText: {
    fontSize: FontSize.lg,
  },
});

