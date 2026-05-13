/**
 * Contador de monedas con icono emoji — visible en Home y resultados.
 */

import React from 'react';
import { StyleSheet, Text } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { colors, radius, shadows } from '../styles/theme';

/**
 * @param {object} props
 * @param {number} props.amount
 */
export function CoinCounter({ amount }) {
  return (
    <Animatable.View animation="pulse" iterationCount={1} duration={600} style={[styles.wrap, shadows.card]}>
      <Text style={styles.emoji}>🪙</Text>
      <Text style={styles.num}>{amount}</Text>
    </Animatable.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.pill,
    borderWidth: 2,
    borderColor: colors.yellow,
    gap: 6,
  },
  emoji: {
    fontSize: 18,
  },
  num: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.darkGray,
    minWidth: 36,
  },
});
