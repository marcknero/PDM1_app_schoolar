import { useFocusEffect } from '@react-navigation/native';
import * as NavigationBar from 'expo-navigation-bar';
import React from 'react';
import { Platform } from 'react-native';

export function useImmersiveMode(enabled: boolean) {
  useFocusEffect(
    React.useCallback(() => {
      if (!enabled || Platform.OS !== 'android') {
        return;
      }

      NavigationBar.setBehaviorAsync('overlay-swipe').catch(() => undefined);
      NavigationBar.setVisibilityAsync('hidden').catch(() => undefined);

      return () => {
        NavigationBar.setVisibilityAsync('visible').catch(() => undefined);
      };
    }, [enabled])
  );
}