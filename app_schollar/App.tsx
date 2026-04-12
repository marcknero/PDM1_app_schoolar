import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider } from './src/contexts/AuthContext';
import { AppNavigator } from './src/navigation/AppNavigator';
import { colors } from './src/styles/theme';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.background }}>
      <SafeAreaProvider>
        <AuthProvider>
          <AppNavigator />
          <StatusBar style="dark" />
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}