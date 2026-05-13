/**
 * Estado de carga genérico (precarga de audio, assets, etc.).
 */

import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { colors } from '../styles/theme';

/**
 * @param {object} props
 * @param {boolean} props.visible
 * @param {string} [props.message]
 */
export function LoadingOverlay({ visible, message }) {
  if (!visible) return null;
  return (
    <View style={styles.overlay}>
      <ActivityIndicator size="large" color={colors.purple} />
      {message ? <Text style={styles.msg}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 50,
    gap: 12,
  },
  msg: {
    fontWeight: '700',
    color: colors.darkGray,
  },
});
