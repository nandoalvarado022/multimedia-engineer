/**
 * Barra de experiencia animada (progreso visual hacia el siguiente nivel ficticio).
 */

import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { colors, radius } from '../styles/theme';

const LEVEL_SIZE = 150;

/**
 * @param {object} props
 * @param {number} props.xp
 */
export function XPBar({ xp }) {
  const level = Math.floor(xp / LEVEL_SIZE) + 1;
  const progress = (xp % LEVEL_SIZE) / LEVEL_SIZE;
  const widthPct = useSharedValue(progress);

  useEffect(() => {
    widthPct.value = withSpring(progress);
  }, [progress, widthPct]);

  const barStyle = useAnimatedStyle(() => ({
    width: `${widthPct.value * 100}%`,
  }));

  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <Text style={styles.label}>⭐ XP</Text>
        <Text style={styles.level}>Nv. {level}</Text>
      </View>
      <View style={styles.track}>
        <Animated.View style={[styles.fill, barStyle]} />
      </View>
      <Text style={styles.caption}>
        {xp % LEVEL_SIZE}/{LEVEL_SIZE} hacia el siguiente nivel
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  label: {
    fontWeight: '800',
    color: colors.darkGray,
  },
  level: {
    fontWeight: '700',
    color: colors.purple,
  },
  track: {
    height: 14,
    borderRadius: radius.pill,
    backgroundColor: colors.lightGray,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.white,
  },
  fill: {
    height: '100%',
    borderRadius: radius.pill,
    backgroundColor: colors.mint,
  },
  caption: {
    marginTop: 4,
    fontSize: 11,
    color: '#5C6178',
    fontWeight: '600',
  },
});
