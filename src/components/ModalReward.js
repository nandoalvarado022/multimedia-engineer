/**
 * Modal de recompensa con animación de celebración y estrellas.
 */

import React from 'react';
import { Modal, Pressable, StyleSheet, Text } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { celebratePop } from '../animations/presets';
import { colors, radius } from '../styles/theme';
import { GameButton } from './GameButton';

/**
 * @param {object} props
 * @param {boolean} props.visible
 * @param {() => void} props.onClose
 * @param {number} props.stars — 0-3
 * @param {string} props.title
 * @param {string} [props.subtitle]
 */
export function ModalReward({ visible, onClose, stars, title, subtitle }) {
  const starText = '⭐'.repeat(Math.min(3, Math.max(0, stars)));

  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          <Animatable.View animation={celebratePop} duration={700} style={styles.card}>
            <Text style={styles.emoji}>🎉</Text>
            <Text style={styles.title}>{title}</Text>
            {subtitle ? <Text style={styles.sub}>{subtitle}</Text> : null}
            <Text style={styles.stars}>{starText}</Text>
            <GameButton label="¡Genial!" onPress={onClose} variant="primary" />
          </Animatable.View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(45,49,66,0.55)',
    justifyContent: 'center',
    padding: 24,
  },
  sheet: {
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  card: {
    backgroundColor: colors.white,
    padding: 22,
    borderRadius: radius.lg,
    alignItems: 'center',
    gap: 10,
    borderWidth: 3,
    borderColor: colors.yellow,
  },
  emoji: {
    fontSize: 48,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.darkGray,
    textAlign: 'center',
  },
  sub: {
    fontSize: 14,
    color: '#5C6178',
    textAlign: 'center',
    lineHeight: 20,
  },
  stars: {
    fontSize: 28,
    letterSpacing: 4,
    marginVertical: 6,
  },
});
