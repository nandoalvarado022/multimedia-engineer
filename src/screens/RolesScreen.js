/**
 * Biblioteca educativa de roles de ingeniería multimedia.
 *
 * Cada tarjeta resume herramientas reales y un “funny fact” para humanizar la profesión.
 * Esto complementa los minijuegos: aquí se lee el contexto, allí se practica la intuición.
 */

import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ScreenBackground } from '../components/ScreenBackground';
import { RoleCard } from '../components/RoleCard';
import { GameButton } from '../components/GameButton';
import { colors, spacing } from '../styles/theme';
import { roles } from '../data';

export function RolesScreen() {
  const navigation = useNavigation();

  return (
    <ScreenBackground>
      <SafeAreaView style={styles.safe}>
        <GameButton label="← Volver al estudio" variant="ghost" onPress={() => navigation.goBack()} />
        <Text style={styles.title}>Roles del multimedia engineer</Text>
        <Text style={styles.sub}>
          Estos perfiles conviven en estudios de videojuegos, streaming, apps musicales y más. Ninguno trabaja
          solo: la magia está en el equipo.
        </Text>
        <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
          {roles.map((role, index) => (
            <RoleCard key={role.id} role={role} index={index} />
          ))}
          <View style={styles.note}>
            <Text style={styles.noteTitle}>¿Por qué importa?</Text>
            <Text style={styles.noteBody}>
              La ingeniería multimedia une técnica y narrativa. Entender roles ayuda a estudiantes a elegir
              especialización y a comunicarse mejor en proyectos grupales.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  title: {
    marginTop: spacing.sm,
    fontSize: 22,
    fontWeight: '900',
    color: colors.darkGray,
  },
  sub: {
    marginTop: 6,
    marginBottom: spacing.md,
    fontSize: 14,
    fontWeight: '600',
    color: '#5C6178',
    lineHeight: 20,
  },
  list: {
    paddingBottom: spacing.xl,
  },
  note: {
    marginTop: spacing.sm,
    padding: spacing.md,
    backgroundColor: '#F0F4FF',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#D7E3FF',
  },
  noteTitle: {
    fontWeight: '900',
    color: colors.purple,
    marginBottom: 6,
  },
  noteBody: {
    fontSize: 13,
    color: colors.darkGray,
    lineHeight: 19,
    fontWeight: '600',
  },
});
