/**
 * Ajustes accesibles: control simple del audio ambiente.
 *
 * Documentación: la música usa `expo-av` en AudioManager; silenciar aquí llama a
 * stopBackgroundMusic() desde HomeScreen cuando `musicMuted` cambia.
 */

import React from 'react';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ScreenBackground } from '../components/ScreenBackground';
import { GameButton } from '../components/GameButton';
import { colors, spacing } from '../styles/theme';
import { useAudioPrefs } from '../hooks/useAudioPrefs';

export function SettingsScreen() {
  const navigation = useNavigation();
  const { musicMuted, toggleMusicMuted } = useAudioPrefs();

  return (
    <ScreenBackground>
      <SafeAreaView style={styles.safe}>
        <GameButton label="← Volver" variant="ghost" onPress={() => navigation.goBack()} />
        <Text style={styles.title}>Ajustes del estudio</Text>
        <Text style={styles.sub}>Controla la música ambiental sin tocar código.</Text>

        <Pressable style={styles.row} onPress={toggleMusicMuted}>
          <View style={{ flex: 1 }}>
            <Text style={styles.rowTitle}>Música de fondo</Text>
            <Text style={styles.rowDesc}>Loop cartoon generado localmente (bg_music.wav).</Text>
          </View>
          <Switch value={!musicMuted} onValueChange={() => toggleMusicMuted()} trackColor={{ true: colors.mint }} />
        </Pressable>

        <View style={styles.box}>
          <Text style={styles.boxTitle}>Tip educativo</Text>
          <Text style={styles.boxBody}>
            Los estudios reales combinan pipelines de audio (middleware), sistema de preferencias de usuario y
            telemetría. Esta pantalla es una versión miniatura de ese patrón UX + estado global.
          </Text>
        </View>
      </SafeAreaView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    paddingHorizontal: spacing.md,
    gap: spacing.md,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.darkGray,
  },
  sub: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5C6178',
    marginBottom: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E8EAEF',
    gap: 12,
  },
  rowTitle: {
    fontWeight: '900',
    color: colors.darkGray,
    fontSize: 16,
  },
  rowDesc: {
    marginTop: 4,
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
    lineHeight: 17,
  },
  box: {
    marginTop: spacing.md,
    padding: spacing.md,
    borderRadius: 16,
    backgroundColor: '#FFF9E6',
    borderWidth: 2,
    borderColor: colors.yellow,
  },
  boxTitle: {
    fontWeight: '900',
    color: '#B8860B',
    marginBottom: 6,
  },
  boxBody: {
    fontSize: 13,
    color: colors.darkGray,
    lineHeight: 19,
    fontWeight: '600',
  },
});
