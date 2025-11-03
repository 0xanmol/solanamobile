import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { FontFamily, FontSize } from '@/constants/typography';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    ViewStyle,
} from 'react-native';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: keyof typeof MaterialIcons.glyphMap;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: ViewStyle;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  message,
  actionLabel,
  onAction,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      {icon && (
        <MaterialIcons name={icon} size={64} color={Colors.gray300} />
      )}
      <Text style={styles.title}>{title}</Text>
      {message && <Text style={styles.message}>{message}</Text>}
      {actionLabel && onAction && (
        <Button
          title={actionLabel}
          onPress={onAction}
          variant="primary"
          size="medium"
          style={styles.button}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing['2xl'],
    paddingVertical: Spacing['4xl'],
  },
  title: {
    fontSize: FontSize.xl,
    fontFamily: FontFamily.poppinsSemiBold,
    color: Colors.textPrimary,
    marginTop: Spacing.lg,
    textAlign: 'center',
  },
  message: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.montserratRegular,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
  button: {
    marginTop: Spacing.xl,
  },
});

