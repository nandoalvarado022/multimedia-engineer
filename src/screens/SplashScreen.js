/**
 * Pantalla de bienvenida animada.
 *
 * Propósito educativo / UX: marca la identidad del juego y da tiempo a precargar assets
 * mientras el estudiante asocia la app con un estudio multimedia divertido.
 */

import React, { useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import * as SplashScreenNative from 'expo-splash-screen';
import { ScreenBackground } from '../components/ScreenBackground';
import { colors } from '../styles/theme';
import { SCREENS } from '../navigation/navigationConfig';

SplashScreenNative.preventAutoHideAsync().catch(() => {});

export function SplashScreen() {
  const navigation = useNavigation();

  useEffect(() => {
    let cancelled = false;

    const boot = async () => {
      await SplashScreenNative.hideAsync().catch(() => {});
      await new Promise((r) => setTimeout(r, 2400));
      if (!cancelled) {
        navigation.replace(SCREENS.HOME);
      }
    };

    boot();
    return () => {
      cancelled = true;
    };
  }, [navigation]);

  return (
    <ScreenBackground style={styles.screen}>
      <Animatable.View animation="bounceIn" duration={900} style={styles.logoWrap}>
        <Text style={styles.logoEmoji}>🎬</Text>
        <Text style={styles.title}>Multimedia Tycoon</Text>
        <Text style={styles.tagline}>¡Tu estudio, tus decisiones, tus bugs!</Text>
      </Animatable.View>
      <Animatable.Text animation="pulse" iterationCount="infinite" style={styles.loading}>
        Cargando paletas y pistas de audio…
      </Animatable.Text>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  screen: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  logoWrap: {
    alignItems: 'center',
    gap: 8,
    marginBottom: 28,
  },
  logoEmoji: {
    fontSize: 72,
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.darkGray,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.purple,
    textAlign: 'center',
    maxWidth: 280,
  },
  loading: {
    marginTop: 12,
    fontSize: 13,
    fontWeight: '600',
    color: '#5C6178',
  },
});
