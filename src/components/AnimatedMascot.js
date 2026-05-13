/**
 * Mascota cartoon animada (emoji placeholder + animación bounce).
 * Sustituir por Lottie o sprites si el curso lo permite más adelante.
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { pulseAttention } from '../animations/presets';

/**
 * @param {object} props
 * @param {string} [props.emoji]
 * @param {string} [props.caption]
 */
export function AnimatedMascot({ emoji = '🎬', caption }) {
  return (
    <View style={styles.wrap}>
      <Animatable.View animation={pulseAttention} iterationCount="infinite" duration={2200} easing="ease-in-out">
        <View style={styles.circle}>
          <Text style={styles.emoji}>{emoji}</Text>
        </View>
      </Animatable.View>
      {caption ? <Text style={styles.caption}>{caption}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    gap: 8,
  },
  circle: {
    width: 112,
    height: 112,
    borderRadius: 56,
    backgroundColor: '#FFF4E6',
    borderWidth: 4,
    borderColor: '#FF8C42',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  emoji: {
    fontSize: 56,
  },
  caption: {
    fontWeight: '700',
    color: '#2D3142',
    textAlign: 'center',
    maxWidth: 260,
  },
});
