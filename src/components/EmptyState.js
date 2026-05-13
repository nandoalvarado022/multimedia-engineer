/**
 * Estado vacío amistoso cuando no hay datos que mostrar.
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../styles/theme';

/**
 * @param {object} props
 * @param {string} props.emoji
 * @param {string} props.title
 * @param {string} props.description
 */
export function EmptyState({ emoji, title, description }) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.desc}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    padding: 24,
    gap: 8,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.darkGray,
    textAlign: 'center',
  },
  desc: {
    fontSize: 14,
    color: '#5C6178',
    textAlign: 'center',
    lineHeight: 20,
  },
});
