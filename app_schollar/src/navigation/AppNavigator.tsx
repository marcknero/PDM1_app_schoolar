import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

import { useAuth } from '../contexts/AuthContext';
import { HomeScreen } from '../screens/HomeScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { ReportScreen } from '../screens/ReportScreen';
import { StudentRegistrationScreen } from '../screens/StudentRegistrationScreen';
import { SubjectRegistrationScreen } from '../screens/SubjectRegistrationScreen';
import { TeacherRegistrationScreen } from '../screens/TeacherRegistrationScreen';
import { colors, navigationTheme, spacing } from '../styles/theme';
import { MainTabParamList, RootStackParamList } from './types';

const RootStack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function LoadingScreen() {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.background,
        gap: spacing.md,
      }}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={{ color: colors.text, fontSize: 16, fontWeight: '600' }}>Preparando ambiente...</Text>
    </View>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textSoft,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: 66,
          paddingTop: 8,
          paddingBottom: 10,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
        },
        tabBarIcon: ({ color, size }) => {
          const icons: Record<keyof MainTabParamList, keyof typeof Ionicons.glyphMap> = {
            Home: 'grid-outline',
            Students: 'school-outline',
            Teachers: 'people-outline',
            Subjects: 'book-outline',
            Report: 'bar-chart-outline',
          };

          return <Ionicons name={icons[route.name as keyof MainTabParamList]} size={size} color={color} />;
        },
      })}>
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Início' }} />
      <Tab.Screen name="Students" component={StudentRegistrationScreen} options={{ title: 'Alunos' }} />
      <Tab.Screen name="Teachers" component={TeacherRegistrationScreen} options={{ title: 'Professores' }} />
      <Tab.Screen name="Subjects" component={SubjectRegistrationScreen} options={{ title: 'Disciplinas' }} />
      <Tab.Screen name="Report" component={ReportScreen} options={{ title: 'Boletim' }} />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  const { isAuthenticated, isBootstrapping } = useAuth();

  if (isBootstrapping) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer theme={navigationTheme}>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <RootStack.Screen name="Main" component={MainTabs} />
        ) : (
          <RootStack.Screen name="Login" component={LoginScreen} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}