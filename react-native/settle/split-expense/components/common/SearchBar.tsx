import { Colors } from '@/constants/colors';
import { BorderRadius, Spacing } from '@/constants/spacing';
import { FontFamily, FontSize } from '@/constants/typography';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';
import {
    StyleSheet,
    TextInput,
    TextInputProps,
    View,
    ViewStyle,
} from 'react-native';

interface SearchBarProps extends TextInputProps {
  containerStyle?: ViewStyle;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  containerStyle,
  style,
  ...props
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <MaterialIcons name="search" size={20} color={Colors.gray400} style={styles.icon} />
      <TextInput
        style={[styles.input, style]}
        placeholderTextColor={Colors.textTertiary}
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius['2xl'],
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.lg,
  },
  icon: {
    marginRight: Spacing.sm,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: FontSize.md,
    fontFamily: FontFamily.poppinsRegular,
    color: Colors.textPrimary,
  },
});

