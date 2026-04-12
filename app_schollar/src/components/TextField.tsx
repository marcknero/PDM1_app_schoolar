import React from 'react';
import { Text, TextInput, TextInputProps, View } from 'react-native';

import { componentStyles } from '../styles/components.styles';

type TextFieldProps = TextInputProps & {
  label: string;
  helperText?: string;
};

export function TextField({ label, helperText, style, ...props }: TextFieldProps) {
  return (
    <View style={componentStyles.inputGroup}>
      <Text style={componentStyles.label}>{label}</Text>
      <TextInput
        placeholderTextColor="#6b8791"
        style={[componentStyles.input, props.multiline ? componentStyles.inputMultiline : null, style]}
        {...props}
      />
      {helperText ? <Text style={componentStyles.helperText}>{helperText}</Text> : null}
    </View>
  );
}