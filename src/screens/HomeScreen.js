/**
 * Pantalla principal del estudio.
 *
 * Aquí el jugador ve progreso (monedas, XP), la mascota animada y accede a:
 * - Selección de proyectos (flujo principal del “tycoon” ligero)
 * - Roles educativos
 * - Ajustes (audio)
 */

import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import { ScreenBackground } from '../components/ScreenBackground';
import { AnimatedMascot } from '../components/AnimatedMascot';
import { GameButton } from '../components/GameButton';
import { CoinCounter } from '../components/CoinCounter';
import { XPBar } from '../components/XPBar';
import { colors, spacing } from '../styles/theme';
import { SCREENS } from '../navigation/navigationConfig';
import { useGameProgress } from '../hooks/useGameProgress';
import { useAudioPrefs } from '../hooks/useAudioPrefs';
import { preloadCommonSounds, preloadMinigameSounds, startBackgroundMusic, stopBackgroundMusic } from '../audio/AudioManager';

export function HomeScreen() {
  const navigation = useNavigation();
  const { coins, xp } = useGameProgress();
  const { musicMuted } = useAudioPrefs();

  // Precarga una sola vez al entrar al hub principal
  useEffect(() => {
    let alive = true;
    (async () => {
      await preloadCommonSounds();
      await preloadMinigameSounds();
      if (!alive) return;
      if (!musicMuted) await startBackgroundMusic();
    })();
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- sólo arranque inicial
  }, []);

  useEffect(() => {
    if (musicMuted) stopBackgroundMusic();
    else startBackgroundMusic();
  }, [musicMuted]);

  return (
    <ScreenBackground>
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={styles.topRow}>
            <CoinCounter amount={coins} />
            <GameButton
              label="⚙️"
              variant="ghost"
              onPress={() => navigation.navigate(SCREENS.SETTINGS)}
            />
          </View>

          <Animatable.View animation="fadeInDown" duration={700} style={styles.hero}>
            <Text style={styles.brand}>Multimedia Tycoon</Text>
            <Text style={styles.subBrand}>Gestiona clientes, aprende roles, brilla con estilo cartoon 🍿</Text>
          </Animatable.View>

          <AnimatedMascot emoji="🦊" caption="Soy Pixel el Zorro — apruebo commits solo si traen snacks." />

          <View style={styles.xpWrap}>
            <XPBar xp={xp} />
          </View>

          <View style={styles.actions}>
            <GameButton
              emoji="🎮"
              label="¡A trabajar!"
              variant="primary"
              onPress={() => navigation.navigate(SCREENS.PROJECT_SELECTION)}
            />
            <GameButton
              emoji="🎓"
              label="Roles del multimedia"
              variant="secondary"
              onPress={() => navigation.navigate(SCREENS.ROLES)}
            />
          </View>

          <Text style={styles.footer}>Hecho con React Native + Expo · Prototipo educativo</Text>
        </ScrollView>
      </SafeAreaView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  scroll: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  hero: {
    alignItems: 'center',
    gap: 6,
  },
  brand: {
    fontSize: 26,
    fontWeight: '900',
    color: colors.darkGray,
    textAlign: 'center',
  },
  subBrand: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5C6178',
    textAlign: 'center',
    maxWidth: 320,
    lineHeight: 20,
  },
  xpWrap: {
    marginTop: 4,
  },
  actions: {
    gap: 12,
    marginTop: 8,
  },
  footer: {
    marginTop: spacing.lg,
    textAlign: 'center',
    fontSize: 11,
    color: '#8890A8',
    fontWeight: '600',
  },
});
