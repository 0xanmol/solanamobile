import { Colors } from '@/constants/colors';
import { BorderRadius, Spacing } from '@/constants/spacing';
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

interface DropdownProps {
  label?: string;
  value: string;
  onPress: () => void;
  placeholder?: string;
  error?: string;
  containerStyle?: ViewStyle;
}

export const Dropdown: React.FC<DropdownProps> = ({
  label,
  value,
  onPress,
  placeholder = 'Select an option',
  error,
  containerStyle,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity
        style={[styles.dropdown, error && styles.dropdownError]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <Text style={[styles.value, !value && styles.placeholder]}>
          {value || placeholder}
        </Text>
        <MaterialIcons name="keyboard-arrow-down" size={20} color={Colors.gray500} />
      </TouchableOpacity>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.poppinsMedium,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.slate50,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  dropdownError: {
    borderColor: Colors.error,
  },
  value: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.poppinsRegular,
    color: Colors.textPrimary,
  },
  placeholder: {
    color: Colors.textTertiary,
  },
  errorText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.montserratRegular,
    color: Colors.error,
    marginTop: Spacing.xs,
  },
});

