/**
 * Botón grande estilo cartoon con sombra y feedback háptico opcional.
 */

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors, radius, shadows } from '../styles/theme';
import { playButtonSound } from '../audio/AudioManager';

/**
 * @param {object} props
 * @param {string} props.label
 * @param {() => void} props.onPress
 * @param {'primary'|'secondary'|'ghost'} [props.variant]
 * @param {boolean} [props.disabled]
 * @param {string} [props.emoji]
 */
export function GameButton({ label, onPress, variant = 'primary', disabled, emoji }) {
  const palette =
    variant === 'primary'
      ? { bg: colors.orange, fg: colors.white, border: '#E56F20' }
      : variant === 'secondary'
        ? { bg: colors.purple, fg: colors.white, border: '#5E4BD9' }
        : { bg: colors.white, fg: colors.darkGray, border: colors.lightGray };

  const handlePress = async () => {
    if (disabled) return;
    await playButtonSound();
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      /* noop */
    }
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.wrapper,
        shadows.card,
        {
          backgroundColor: palette.bg,
          borderColor: palette.border,
          opacity: disabled ? 0.45 : pressed ? 0.92 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        },
      ]}
    >
      <View style={styles.inner}>
        {emoji ? <Text style={styles.emoji}>{emoji}</Text> : null}
        <Text style={[styles.label, { color: palette.fg }]}>{label}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: radius.md,
    borderWidth: 3,
    paddingVertical: 14,
    paddingHorizontal: 18,
    minHeight: 52,
    justifyContent: 'center',
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  emoji: {
    fontSize: 20,
  },
  label: {
    fontSize: 17,
    fontWeight: '800',
    textAlign: 'center',
  },
});
