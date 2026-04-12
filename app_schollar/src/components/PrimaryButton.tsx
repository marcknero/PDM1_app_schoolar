import React from 'react';
import { Pressable, Text, ViewStyle } from 'react-native';

import { componentStyles } from '../styles/components.styles';

type PrimaryButtonProps = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  style?: ViewStyle;
};

export function PrimaryButton({ label, onPress, variant = 'primary', disabled, style }: PrimaryButtonProps) {
  const buttonStyle = variant === 'secondary' ? componentStyles.buttonSecondary : componentStyles.button;
  const textStyle = variant === 'secondary' ? componentStyles.buttonTextSecondary : componentStyles.buttonText;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        buttonStyle,
        pressed && !disabled ? { opacity: 0.88, transform: [{ scale: 0.99 }] } : null,
        disabled ? { opacity: 0.6 } : null,
        style,
      ]}>
      <Text style={textStyle}>{label}</Text>
    </Pressable>
  );
}