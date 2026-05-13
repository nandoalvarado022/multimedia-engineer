/**
 * Pantalla de resultados: feedback animado, recompensas y logros falsos.
 *
 * Conecta el rendimiento del minijuego con monedas/XP del estado global y desbloquea
 * achievements definidos en achievements.json para motivación tipo videojuego.
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import { ScreenBackground } from '../components/ScreenBackground';
import { GameButton } from '../components/GameButton';
import { ModalReward } from '../components/ModalReward';
import { colors, spacing } from '../styles/theme';
import { achievements as achievementsCatalog } from '../data';
import { SCREENS } from '../navigation/navigationConfig';
import { useGameProgress } from '../hooks/useGameProgress';
import { playSoundEffect } from '../audio/AudioManager';

export function ResultsScreen() {
  const navigation = useNavigation();
  /** @type {{ params?: { result?: Record<string, unknown> }}} */
  const route = useRoute();
  const result = route.params?.result;

  const { addCoins, addXp, unlockAchievement, coins } = useGameProgress();
  const [rewardOpen, setRewardOpen] = useState(false);
  const rewardsApplied = useRef(false);

  const summary = useMemo(() => {
    if (!result) return null;
    return {
      stars: result.stars ?? 1,
      won: Boolean(result.won),
      coinsEarned: result.coinsEarned ?? 0,
      xpEarned: result.xpEarned ?? 0,
      minigameId: result.minigameId,
      correct: result.correct,
      total: result.total,
      smashed: result.smashed,
    };
  }, [result]);

  useEffect(() => {
    if (!summary || rewardsApplied.current) return;
    rewardsApplied.current = true;

    const applyRewards = async () => {
      addCoins(summary.coinsEarned);
      addXp(summary.xpEarned);

      unlockAchievement('first-contract');

      if (summary.minigameId === 'ui-fixer' && summary.stars === 3) {
        unlockAchievement('ui-guru');
      }
      if (summary.minigameId === 'audio-match' && summary.correct === summary.total) {
        unlockAchievement('golden-ears');
      }
      if (summary.minigameId === 'bug-smasher' && (summary.smashed ?? 0) >= 10) {
        unlockAchievement('bug-whisperer');
      }
      if (coins + summary.coinsEarned >= 500) {
        unlockAchievement('studio-mogul');
      }

      if (summary.won) {
        await playSoundEffect('victory');
      } else {
        await playSoundEffect('success');
      }
      setRewardOpen(true);
    };

    applyRewards();
  }, [summary, addCoins, addXp, unlockAchievement, coins]);

  if (!summary) {
    return (
      <ScreenBackground>
        <SafeAreaView style={styles.safe}>
          <Text style={styles.missing}>Sin datos de partida — vuelve a jugar.</Text>
          <GameButton label="Inicio" variant="primary" onPress={() => navigation.navigate(SCREENS.HOME)} />
        </SafeAreaView>
      </ScreenBackground>
    );
  }

  const starLine = '⭐'.repeat(Math.min(3, summary.stars));

  return (
    <ScreenBackground>
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <Animatable.View animation="bounceIn" duration={800} style={styles.hero}>
            <Text style={styles.emoji}>{summary.won ? '🏆' : '🛠️'}</Text>
            <Text style={styles.title}>{summary.won ? '¡Contrato salvado!' : 'Casi… reintentemos'}</Text>
            <Text style={styles.stars}>{starLine}</Text>
            <Text style={styles.meta}>
              +{summary.coinsEarned} monedas · +{summary.xpEarned} XP
            </Text>
          </Animatable.View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Estrella del estudio dice:</Text>
            <Text style={styles.cardBody}>
              {summary.won
                ? 'Tu cliente ya no amenaza con cambiar de estudio. ¡Bien hecho!'
                : 'Nadie nació sabiendo Flexbox. Dale otra oportunidad al minijuego.'}
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Logros (mock)</Text>
            {achievementsCatalog.slice(0, 4).map((a) => (
              <Text key={a.id} style={styles.achRow}>
                {a.emoji} {a.title}
              </Text>
            ))}
            <Text style={styles.hint}>Los logros reales se desbloquean al cumplir condiciones en partida.</Text>
          </View>

          <View style={styles.actions}>
            <GameButton
              label="Reintentar"
              variant="secondary"
              onPress={() => {
                const pid = result?.projectId;
                if (pid) navigation.replace(SCREENS.MINIGAME, { projectId: pid });
              }}
            />
            <GameButton
              label="Volver al estudio"
              variant="primary"
              onPress={() =>
                navigation.reset({
                  index: 0,
                  routes: [{ name: SCREENS.HOME }],
                })
              }
            />
          </View>
        </ScrollView>

        <ModalReward
          visible={rewardOpen}
          onClose={() => setRewardOpen(false)}
          stars={summary.stars}
          title={summary.won ? 'Recompensa desbloqueada' : 'Progreso registrado'}
          subtitle={`Sumaste ${summary.coinsEarned} monedas y ${summary.xpEarned} XP.`}
        />
      </SafeAreaView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  scroll: {
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
  hero: {
    alignItems: 'center',
    gap: 6,
    marginTop: spacing.sm,
  },
  emoji: {
    fontSize: 56,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.darkGray,
    textAlign: 'center',
  },
  stars: {
    fontSize: 28,
    letterSpacing: 6,
  },
  meta: {
    fontWeight: '800',
    color: colors.orange,
    fontSize: 16,
  },
  card: {
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#E8EAEF',
    gap: 8,
  },
  cardTitle: {
    fontWeight: '900',
    color: colors.purple,
    fontSize: 15,
  },
  cardBody: {
    fontSize: 14,
    color: '#4B5068',
    lineHeight: 20,
    fontWeight: '600',
  },
  achRow: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.darkGray,
  },
  hint: {
    fontSize: 11,
    color: '#8890A8',
    fontStyle: 'italic',
    marginTop: 4,
  },
  actions: {
    gap: 12,
    marginTop: 8,
  },
  missing: {
    textAlign: 'center',
    marginBottom: 12,
    fontWeight: '700',
    color: colors.darkGray,
  },
});
