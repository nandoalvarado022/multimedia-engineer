/**
 * Navegación principal: Stack nativo (historial lineal simple, ideal para flujo de juego).
 *
 * Flujo típico:
 * Splash → Home → (ProjectSelection | Roles | Settings)
 * ProjectSelection → Minigame → Results → Home o repetir Minigame
 */

import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors } from '../styles/theme';
import { SCREENS } from './navigationConfig';

import { SplashScreen } from '../screens/SplashScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { ProjectSelectionScreen } from '../screens/ProjectSelectionScreen';
import { MinigameScreen } from '../screens/MinigameScreen';
import { ResultsScreen } from '../screens/ResultsScreen';
import { RolesScreen } from '../screens/RolesScreen';
import { SettingsScreen } from '../screens/SettingsScreen';

const Stack = createNativeStackNavigator();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.white,
    primary: colors.purple,
  },
};

export function RootNavigator() {
  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        initialRouteName={SCREENS.SPLASH}
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: { backgroundColor: '#F7F8FC' },
        }}
      >
        <Stack.Screen name={SCREENS.SPLASH} component={SplashScreen} />
        <Stack.Screen name={SCREENS.HOME} component={HomeScreen} />
        <Stack.Screen name={SCREENS.PROJECT_SELECTION} component={ProjectSelectionScreen} />
        <Stack.Screen name={SCREENS.MINIGAME} component={MinigameScreen} />
        <Stack.Screen name={SCREENS.RESULTS} component={ResultsScreen} />
        <Stack.Screen name={SCREENS.ROLES} component={RolesScreen} />
        <Stack.Screen name={SCREENS.SETTINGS} component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
