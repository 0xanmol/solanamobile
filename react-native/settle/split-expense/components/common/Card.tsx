import { Colors } from '@/constants/colors';
import { BorderRadius, Shadow, Spacing } from '@/constants/spacing';
import React from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    View,
    ViewStyle
} from 'react-native';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  variant?: 'elevated' | 'outlined' | 'flat';
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  onPress,
  variant = 'elevated',
}) => {
  const cardStyle = [
    styles.base,
    styles[variant],
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity
        style={cardStyle}
        onPress={onPress}
        activeOpacity={0.7}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={cardStyle}>{children}</View>;
};

const styles = StyleSheet.create({
  base: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
  },
  elevated: {
    ...Shadow.base,
  },
  outlined: {
    borderWidth: 1,
    borderColor: Colors.border,
  },
  flat: {
    // No additional styling
  },
});

