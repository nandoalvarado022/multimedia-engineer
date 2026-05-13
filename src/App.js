/**
 * Raíz de la aplicación: proveedores + navegación.
 *
 * Orden importante:
 * 1. GestureHandlerRootView — requerido por React Navigation / gestos.
 * 2. SafeAreaProvider — áreas seguras en notch / home indicator.
 * 3. GameProvider — economía ligera del juego (monedas, XP, logros).
 * 4. AudioPrefsProvider — preferencia de música silenciada.
 * 5. RootNavigator — stack principal documentado en navigation/RootNavigator.js
 */

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './navigation/RootNavigator';
import { GameProvider } from './hooks/useGameProgress';
import { AudioPrefsProvider } from './hooks/useAudioPrefs';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <GameProvider>
          <AudioPrefsProvider>
            <StatusBar style="dark" />
            <RootNavigator />
          </AudioPrefsProvider>
        </GameProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
