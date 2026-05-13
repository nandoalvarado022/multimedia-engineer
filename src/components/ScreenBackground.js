/**
 * Fondo decorativo cartoon con blobs de color (sin imágenes externas pesadas).
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '../styles/theme';

/**
 * @param {object} props
 * @param {import('react-native').StyleProp<import('react-native').ViewStyle>} [props.style]
 * @param {React.ReactNode} props.children
 */
export function ScreenBackground({ children, style }) {
  return (
    <View style={[styles.root, style]}>
      <View style={[styles.blob, styles.blobOrange]} />
      <View style={[styles.blob, styles.blobPurple]} />
      <View style={[styles.blob, styles.blobYellow]} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F7F8FC',
    overflow: 'hidden',
  },
  blob: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.35,
  },
  blobOrange: {
    width: 220,
    height: 220,
    backgroundColor: colors.orange,
    top: -40,
    right: -50,
  },
  blobPurple: {
    width: 280,
    height: 280,
    backgroundColor: colors.purple,
    bottom: -80,
    left: -90,
  },
  blobYellow: {
    width: 140,
    height: 140,
    backgroundColor: colors.yellow,
    top: '38%',
    left: -30,
  },
});
