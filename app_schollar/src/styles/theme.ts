import { DefaultTheme, Theme } from '@react-navigation/native';

export const colors = {
  background: '#eaf7f6',
  surface: '#ffffff',
  surfaceSoft: '#dff4f3',
  primary: '#0f766e',
  primaryDark: '#115e59',
  accent: '#14b8a6',
  accentSoft: '#a7f3d0',
  accentDeep: '#0ea5b7',
  text: '#083344',
  textSoft: '#476b77',
  border: 'rgba(8, 51, 68, 0.12)',
  white: '#ffffff',
  success: '#16a34a',
  warning: '#f59e0b',
  danger: '#dc2626',
};

export const spacing = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
};

export const radius = {
  sm: 14,
  md: 20,
  lg: 28,
  xl: 36,
};

export const shadow = {
  shadowColor: '#0f766e',
  shadowOffset: { width: 0, height: 10 },
  shadowOpacity: 0.12,
  shadowRadius: 24,
  elevation: 4,
};

export const navigationTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    background: colors.background,
    card: colors.surface,
    text: colors.text,
    border: colors.border,
    notification: colors.accentDeep,
  },
};