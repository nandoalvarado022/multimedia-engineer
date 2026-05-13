/**
 * Lista de proyectos de clientes (datos mock en projects.json).
 *
 * Cada tarjeta muestra el tipo de producto multimedia y una línea de diálogo divertida.
 * Al elegir un proyecto se navega al minijuego asociado vía `minigameId`.
 */

import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import { ScreenBackground } from '../components/ScreenBackground';
import { GameButton } from '../components/GameButton';
import { EmptyState } from '../components/EmptyState';
import { LoadingOverlay } from '../components/LoadingOverlay';
import { colors, radius, shadows, spacing } from '../styles/theme';
import { projects } from '../data';
import { SCREENS } from '../navigation/navigationConfig';

export function ProjectSelectionScreen() {
  const navigation = useNavigation();
  const loading = false;

  const renderItem = ({ item, index }) => (
    <Animatable.View animation="fadeInUp" delay={index * 70} duration={500}>
      <Pressable
        onPress={() => navigation.navigate(SCREENS.MINIGAME, { projectId: item.id })}
        style={({ pressed }) => [
          styles.card,
          shadows.card,
          {
            borderColor: item.accentColor,
            opacity: pressed ? 0.92 : 1,
            transform: [{ scale: pressed ? 0.98 : 1 }],
          },
        ]}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.emoji}>{item.emoji}</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardType}>{item.type.replace('_', ' ')}</Text>
          </View>
        </View>
        <Text style={styles.dialogue}>“{item.clientLine}”</Text>
        <Text style={styles.reward}>🪙 +{item.rewardCoins} · XP +{item.rewardXp}</Text>
      </Pressable>
    </Animatable.View>
  );

  return (
    <ScreenBackground>
      <SafeAreaView style={styles.safe}>
        <LoadingOverlay visible={loading} message="Preparando contratos…" />
        <View style={styles.header}>
          <GameButton label="← Volver" variant="ghost" onPress={() => navigation.goBack()} />
          <Text style={styles.screenTitle}>Contratos abiertos</Text>
          <Text style={styles.screenSub}>Elige un cliente — cada uno entrena un rol distinto.</Text>
        </View>

        {projects.length === 0 ? (
          <EmptyState
            emoji="📭"
            title="No hay proyectos"
            description="Revisa src/data/projects.json o inventa nuevos clientes creativos."
          />
        ) : (
          <FlatList
            data={projects}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />
        )}
      </SafeAreaView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  header: {
    marginBottom: spacing.sm,
    gap: 6,
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.darkGray,
  },
  screenSub: {
    fontSize: 14,
    color: '#5C6178',
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  list: {
    paddingBottom: spacing.xl,
    gap: 12,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 3,
    marginBottom: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    marginBottom: 8,
  },
  emoji: {
    fontSize: 36,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: colors.darkGray,
  },
  cardType: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.purple,
    textTransform: 'uppercase',
  },
  dialogue: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#4B5068',
    lineHeight: 20,
    marginBottom: 8,
  },
  reward: {
    fontWeight: '800',
    color: colors.orange,
    fontSize: 13,
  },
});
