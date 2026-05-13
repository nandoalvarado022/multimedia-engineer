/**
 * Tarjeta educativa para un rol de ingeniería multimedia (pantalla Roles).
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { fadeInUp } from '../animations/presets';
import { colors, radius, shadows } from '../styles/theme';

/**
 * @param {object} props
 * @param {object} props.role — objeto desde roles.json
 * @param {number} [props.index] — para stagger animation
 */
export function RoleCard({ role, index = 0 }) {
  const difficultyPct = Math.min(100, Math.round((role.difficulty / 5) * 100));

  return (
    <Animatable.View
      animation={fadeInUp}
      delay={index * 80}
      duration={500}
      style={[styles.card, shadows.card]}
    >
      <View style={styles.header}>
        <Text style={styles.emoji}>{role.emoji}</Text>
        <View style={styles.headerText}>
          <Text style={styles.title}>{role.title}</Text>
          <Text style={styles.desc}>{role.shortDescription}</Text>
        </View>
      </View>

      <Text style={styles.sectionLabel}>Herramientas típicas</Text>
      <Text style={styles.tools}>{role.tools.join(' · ')}</Text>

      <View style={styles.funny}>
        <Text style={styles.funnyLabel}>Dato divertido</Text>
        <Text style={styles.funnyText}>{role.funnyFact}</Text>
      </View>

      <Text style={styles.sectionLabel}>Dificultad de skill</Text>
      <View style={styles.barTrack}>
        <View style={[styles.barFill, { width: `${difficultyPct}%` }]} />
      </View>
      <Text style={styles.diffCaption}>{role.difficulty}/5 — curva de aprendizaje</Text>
    </Animatable.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: 16,
    marginBottom: 14,
    borderWidth: 2,
    borderColor: colors.lightGray,
  },
  header: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 10,
  },
  emoji: {
    fontSize: 40,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.darkGray,
  },
  desc: {
    marginTop: 4,
    fontSize: 14,
    color: '#4B5068',
    lineHeight: 20,
  },
  sectionLabel: {
    marginTop: 10,
    fontSize: 12,
    fontWeight: '800',
    color: colors.purple,
    textTransform: 'uppercase',
  },
  tools: {
    marginTop: 4,
    fontSize: 13,
    color: colors.darkGray,
    fontWeight: '600',
  },
  funny: {
    marginTop: 12,
    padding: 10,
    borderRadius: radius.sm,
    backgroundColor: '#FFF9E6',
    borderWidth: 1,
    borderColor: colors.yellow,
  },
  funnyLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#B8860B',
    marginBottom: 4,
  },
  funnyText: {
    fontSize: 13,
    color: colors.darkGray,
    fontStyle: 'italic',
    lineHeight: 18,
  },
  barTrack: {
    marginTop: 6,
    height: 12,
    borderRadius: radius.pill,
    backgroundColor: colors.lightGray,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: colors.orange,
    borderRadius: radius.pill,
  },
  diffCaption: {
    marginTop: 4,
    fontSize: 11,
    fontWeight: '600',
    color: '#5C6178',
  },
});
