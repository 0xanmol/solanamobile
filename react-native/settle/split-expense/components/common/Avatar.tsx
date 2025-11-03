import { Colors } from '@/constants/colors';
import { FontFamily } from '@/constants/typography';
import { getInitials } from '@/utils/formatters';
import React from 'react';
import {
    Image,
    StyleSheet,
    Text,
    View,
    ViewStyle,
} from 'react-native';

interface AvatarProps {
  name: string;
  uri?: string;
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  style?: ViewStyle;
}

export const Avatar: React.FC<AvatarProps> = ({
  name,
  uri,
  size = 'medium',
  style,
}) => {
  const initials = getInitials(name);
  
  const sizeMap = {
    small: 32,
    medium: 44,
    large: 64,
    xlarge: 80,
  };
  
  const fontSizeMap = {
    small: 12,
    medium: 16,
    large: 24,
    xlarge: 32,
  };
  
  const avatarSize = sizeMap[size];
  const fontSize = fontSizeMap[size];

  return (
    <View
      style={[
        styles.container,
        { width: avatarSize, height: avatarSize, borderRadius: avatarSize / 2 },
        style,
      ]}
    >
      {uri ? (
        <Image
          source={{ uri }}
          style={[styles.image, { width: avatarSize, height: avatarSize, borderRadius: avatarSize / 2 }]}
        />
      ) : (
        <Text style={[styles.initials, { fontSize }]}>{initials}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.slate200,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  initials: {
    fontFamily: FontFamily.poppinsSemiBold,
    color: Colors.slate600,
  },
});

