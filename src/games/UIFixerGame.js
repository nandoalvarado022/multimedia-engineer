/**
 * Minijuego 1 — UI Fixer
 * Rol enseñado: UI/UX Designer
 *
 * Mecánica: escenarios con tres opciones; solo una representa buenas prácticas.
 * Refuerza jerarquía visual, contraste, targets táctiles y pruebas con usuarios.
 */

import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { uiFixerScenarios } from '../data';
import { colors, radius, shadows } from '../styles/theme';
import { GameButton } from '../components/GameButton';
import { ScoreBoard } from '../components/ScoreBoard';
import { playSoundEffect } from '../audio/AudioManager';

const ROUNDS = 3;

function shuffle(array) {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * @param {object} props
 * @param {(payload: { correct: number; total: number; score: number }) => void} props.onComplete
 */
export function UIFixerGame({ onComplete }) {
  const rounds = useMemo(() => shuffle(uiFixerScenarios).slice(0, ROUNDS), []);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [feedback, setFeedback] = useState(/** @type {string | null} */ (null));
  const [busy, setBusy] = useState(false);

  const scenario = rounds[index];

  const shuffledChoices = useMemo(() => {
    if (!scenario) return [];
    return shuffle(scenario.choices);
  }, [scenario]);

  const handleChoice = async (isGood) => {
    if (busy) return;
    setBusy(true);

    let nextCorrect = correctCount;
    let nextScore = score;
    if (isGood) {
      await playSoundEffect('success');
      nextScore += 100;
      nextCorrect += 1;
      setScore(nextScore);
      setCorrectCount(nextCorrect);
      setFeedback('¡Brutal! Eso sí es pensar en usuarios 👏');
    } else {
      await playSoundEffect('error');
      setFeedback('Uy… ese cliente va a mandar el mensaje en MAYÚSCULAS 😅');
    }

    setTimeout(() => {
      setFeedback(null);
      if (index + 1 >= rounds.length) {
        onComplete({
          correct: nextCorrect,
          total: rounds.length,
          score: nextScore,
        });
      } else {
        setIndex((i) => i + 1);
      }
      setBusy(false);
    }, isGood ? 650 : 900);
  };

  if (!scenario) return null;

  return (
    <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      <ScoreBoard
        score={score}
        round={index + 1}
        totalRounds={rounds.length}
        hint="Elige la opción que mejor represente buenas prácticas UI/UX."
      />

      <Animatable.View animation="fadeInUp" duration={450} style={[styles.card, shadows.card]}>
        <View style={styles.badgeWrap}>
          <Text style={styles.badgeText}>Cliente en crisis</Text>
        </View>
        <Text style={styles.emoji}>{scenario.problemEmoji}</Text>
        <Text style={styles.problemTitle}>{scenario.problemTitle}</Text>
        <Text style={styles.question}>¿Qué harías para mejorarlo?</Text>
      </Animatable.View>

      <View style={styles.choices}>
        {shuffledChoices.map((c) => (
          <GameButton
            key={c.id}
            label={c.label}
            variant="primary"
            disabled={busy}
            onPress={() => handleChoice(c.isGood)}
          />
        ))}
      </View>

      {feedback ? (
        <Animatable.Text animation="bounceIn" style={styles.feedback}>
          {feedback}
        </Animatable.Text>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingBottom: 32,
    gap: 14,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: 18,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.lightGray,
  },
  badgeWrap: {
    alignSelf: 'center',
    backgroundColor: '#FFE8F0',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: radius.pill,
    marginBottom: 8,
  },
  badgeText: {
    fontWeight: '800',
    fontSize: 12,
    color: colors.pink,
  },
  emoji: {
    fontSize: 42,
    marginBottom: 6,
  },
  problemTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.darkGray,
    textAlign: 'center',
  },
  question: {
    marginTop: 10,
    fontSize: 15,
    fontWeight: '700',
    color: colors.purple,
    textAlign: 'center',
  },
  choices: {
    gap: 10,
  },
  feedback: {
    textAlign: 'center',
    fontWeight: '700',
    color: colors.darkGray,
    paddingHorizontal: 8,
    lineHeight: 22,
  },
});
