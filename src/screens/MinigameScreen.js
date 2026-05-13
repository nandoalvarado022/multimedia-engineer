/**
 * Contenedor de minijuegos: monta el componente correcto según `minigameId` del proyecto.
 *
 * Responsabilidades:
 * - Mostrar contexto del cliente (diálogo) para conectar narrativa con gameplay.
 * - Traducir resultados crudos del minijuego a estrellas / monedas / XP.
 * - Navegar a Results con un solo objeto `result` serializable.
 */

import React, { useCallback, useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ScreenBackground } from '../components/ScreenBackground';
import { GameButton } from '../components/GameButton';
import { EmptyState } from '../components/EmptyState';
import { colors, spacing } from '../styles/theme';
import { getProjectById, getMinigameById } from '../data';
import { SCREENS } from '../navigation/navigationConfig';
import { starsFromAccuracy, starsFromBugCount, rewardMultiplier } from '../utils/gameHelpers';
import { UIFixerGame } from '../games/UIFixerGame';
import { AudioMatchGame } from '../games/AudioMatchGame';
import { BugSmasherGame } from '../games/BugSmasherGame';

export function MinigameScreen() {
  const navigation = useNavigation();
  /** @type {{ params?: { projectId?: string }}} */
  const route = useRoute();
  const projectId = route.params?.projectId;

  const project = useMemo(() => (projectId ? getProjectById(projectId) : null), [projectId]);
  const minigameMeta = useMemo(
    () => (project?.minigameId ? getMinigameById(project.minigameId) : null),
    [project]
  );

  const goToResults = useCallback(
    (payload) => {
      if (!project || !minigameMeta) return;

      let stars = 1;
      let score = payload.score ?? 0;

      if (project.minigameId === 'bug-smasher') {
        stars = starsFromBugCount(payload.smashed ?? 0);
      } else {
        stars = starsFromAccuracy(payload.correct ?? 0, payload.total ?? 1);
      }

      const mult = rewardMultiplier(stars);
      const coinsEarned = Math.round(project.rewardCoins * mult);
      const xpEarned = Math.round(project.rewardXp * mult);
      const won = stars >= 2;

      navigation.navigate(SCREENS.RESULTS, {
        result: {
          projectId: project.id,
          minigameId: project.minigameId,
          stars,
          score,
          won,
          coinsEarned,
          xpEarned,
          correct: payload.correct,
          total: payload.total,
          smashed: payload.smashed,
        },
      });
    },
    [navigation, project, minigameMeta]
  );

  if (!project || !minigameMeta) {
    return (
      <ScreenBackground>
        <SafeAreaView style={styles.safe}>
          <EmptyState
            emoji="🤷"
            title="Proyecto no encontrado"
            description="Vuelve atrás y elige otro contrato."
          />
          <GameButton label="Volver" variant="primary" onPress={() => navigation.goBack()} />
        </SafeAreaView>
      </ScreenBackground>
    );
  }

  let body = null;
  if (project.minigameId === 'ui-fixer') {
    body = <UIFixerGame onComplete={goToResults} />;
  } else if (project.minigameId === 'audio-match') {
    body = <AudioMatchGame onComplete={goToResults} />;
  } else if (project.minigameId === 'bug-smasher') {
    body = <BugSmasherGame onComplete={goToResults} />;
  }

  return (
    <ScreenBackground>
      <SafeAreaView style={styles.safe}>
        <View style={styles.head}>
          <GameButton label="← Salir" variant="ghost" onPress={() => navigation.goBack()} />
          <Text style={styles.title}>
            {minigameMeta.emoji} {minigameMeta.title}
          </Text>
          <Text style={styles.role}>Rol: {minigameMeta.roleFocus}</Text>
          <View style={styles.bubble}>
            <Text style={styles.client}>{project.emoji} Cliente dice:</Text>
            <Text style={styles.line}>“{project.clientLine}”</Text>
          </View>
        </View>
        <ScrollView contentContainerStyle={styles.scroll}>{body}</ScrollView>
      </SafeAreaView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  head: {
    gap: 8,
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.darkGray,
  },
  role: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.purple,
  },
  bubble: {
    backgroundColor: '#FFF9E6',
    padding: 12,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.yellow,
  },
  client: {
    fontWeight: '800',
    color: '#B8860B',
    marginBottom: 4,
  },
  line: {
    fontStyle: 'italic',
    color: colors.darkGray,
    lineHeight: 20,
  },
  scroll: {
    paddingBottom: 40,
  },
});
