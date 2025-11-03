import { Colors } from '@/constants/colors';
import { BorderRadius } from '@/constants/spacing';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';

interface CheckboxProps {
  checked: boolean;
  onPress: () => void;
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onPress,
  size = 'medium',
  style,
}) => {
  const sizeMap = {
    small: 16,
    medium: 18,
    large: 20,
  };
  
  const iconSizeMap = {
    small: 12,
    medium: 14,
    large: 16,
  };
  
  const checkboxSize = sizeMap[size];
  const iconSize = iconSizeMap[size];

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <View
        style={[
          styles.checkbox,
          checked && styles.checked,
          { width: checkboxSize, height: checkboxSize },
          style,
        ]}
      >
        {checked && (
          <MaterialIcons name="check" size={iconSize} color={Colors.white} />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  checkbox: {
    borderWidth: 2,
    borderColor: Colors.gray300,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checked: {
    backgroundColor: Colors.blue,
    borderColor: Colors.blue,
  },
});

