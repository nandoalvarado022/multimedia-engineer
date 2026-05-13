/**
 * Panel compacto de puntuación en vivo durante minijuegos.
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, shadows } from '../styles/theme';

/**
 * @param {object} props
 * @param {number} props.score
 * @param {number} [props.round]
 * @param {number} [props.totalRounds]
 * @param {string} [props.hint]
 */
export function ScoreBoard({ score, round, totalRounds, hint }) {
  return (
    <View style={[styles.wrap, shadows.card]}>
      <Text style={styles.scoreLabel}>Puntos</Text>
      <Text style={styles.scoreValue}>{score}</Text>
      {round != null && totalRounds != null ? (
        <Text style={styles.meta}>
          Ronda {round}/{totalRounds}
        </Text>
      ) : null}
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 2,
    borderColor: colors.purple,
    minWidth: 120,
  },
  scoreLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#5C6178',
    textTransform: 'uppercase',
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.darkGray,
  },
  meta: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: '600',
    color: colors.purple,
  },
  hint: {
    marginTop: 6,
    fontSize: 11,
    color: '#5C6178',
    fontStyle: 'italic',
  },
});
