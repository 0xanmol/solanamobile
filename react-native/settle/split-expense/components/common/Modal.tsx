import { Colors } from '@/constants/colors';
import { BorderRadius, Spacing } from '@/constants/spacing';
import React from 'react';
import {
    Modal as RNModal,
    ModalProps as RNModalProps,
    StyleSheet,
    TouchableOpacity,
    ViewStyle
} from 'react-native';

interface ModalProps extends RNModalProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  variant?: 'center' | 'bottom' | 'full';
  containerStyle?: ViewStyle;
}

export const Modal: React.FC<ModalProps> = ({
  visible,
  onClose,
  children,
  variant = 'center',
  containerStyle,
  ...props
}) => {
  return (
    <RNModal
      visible={visible}
      transparent
      animationType={variant === 'bottom' ? 'slide' : 'fade'}
      onRequestClose={onClose}
      {...props}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity
          style={[
            styles.container,
            styles[variant],
            containerStyle,
          ]}
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
        >
          {children}
        </TouchableOpacity>
      </TouchableOpacity>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: Colors.white,
    maxWidth: '90%',
  },
  center: {
    borderRadius: BorderRadius.xl,
    padding: Spacing['2xl'],
    maxHeight: '80%',
  },
  bottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    padding: Spacing.xl,
    maxHeight: '90%',
  },
  full: {
    flex: 1,
    width: '100%',
    maxWidth: '100%',
    maxHeight: '100%',
    borderRadius: 0,
  },
});

