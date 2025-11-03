import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { FontFamily, FontSize } from '@/constants/typography';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';

interface ListItemProps {
  title: string;
  subtitle?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onPress?: () => void;
  showChevron?: boolean;
  style?: ViewStyle;
}

export const ListItem: React.FC<ListItemProps> = ({
  title,
  subtitle,
  leftIcon,
  rightIcon,
  onPress,
  showChevron = false,
  style,
}) => {
  const content = (
    <View style={[styles.container, style]}>
      {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
      
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {subtitle && (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        )}
      </View>
      
      {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
      {showChevron && !rightIcon && (
        <MaterialIcons name="chevron-right" size={20} color={Colors.gray400} />
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  leftIcon: {
    marginRight: Spacing.md,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.poppinsMedium,
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.montserratRegular,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  rightIcon: {
    marginLeft: Spacing.md,
  },
});

