/**
 * Minijuego 2 — Audio Match
 * Rol enseñado: Audio Designer
 *
 * El jugador escucha un clip y lo asocia con etiquetas de diseño sonoro (SFX vs música).
 * Los assets son WAV locales cargados vía AudioManager + soundAssets.js.
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { InteractionManager, Platform, StyleSheet, Text, View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { colors, radius, shadows } from '../styles/theme';
import { GameButton } from '../components/GameButton';
import { ScoreBoard } from '../components/ScoreBoard';
import { initAudioMode, playSoundEffect } from '../audio/AudioManager';

/** Etiquetas visibles para el jugador — orden no implica la respuesta correcta */
const OPTIONS = [
  { id: 'explosion', label: 'Explosión 💥', soundKey: 'explosion' },
  { id: 'click', label: 'Clic de botón 🖱️', soundKey: 'ui_click' },
  { id: 'ambient', label: 'Música ambiental 🌙', soundKey: 'ambient_music_clip' },
  { id: 'victory', label: 'Fanfarria victoria 🏆', soundKey: 'victory' },
];

const TOTAL_ROUNDS = 4;

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * @param {object} props
 * @param {(payload: { correct: number; total: number; score: number }) => void} props.onComplete
 */
export function AudioMatchGame({ onComplete }) {
  const sequence = useMemo(() => {
    const rounds = [];
    for (let i = 0; i < TOTAL_ROUNDS; i++) {
      rounds.push(pickRandom(OPTIONS));
    }
    return rounds;
  }, []);

  const [roundIndex, setRoundIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [feedback, setFeedback] = useState(/** @type {string | null} */ (null));
  const [busy, setBusy] = useState(false);

  const current = sequence[roundIndex];

  const playClip = useCallback(async () => {
    if (!current) return;
    await initAudioMode();
    /** duckMusic: baja un momento el loop del menú para que el clip del minijuego destaque */
    await playSoundEffect(current.soundKey, { volume: 1, duckMusic: true });
  }, [current]);

  const submitAnswer = async (soundKey) => {
    if (busy || !current) return;
    setBusy(true);
    const ok = soundKey === current.soundKey;

    let nextCorrect = correct;
    let nextScore = score;
    if (ok) {
      await playSoundEffect('success');
      nextCorrect += 1;
      nextScore += 125;
      setScore(nextScore);
      setCorrect(nextCorrect);
      setFeedback('¡Identificado! Oídos nivel estudio 🎧');
    } else {
      await playSoundEffect('error');
      setFeedback('Casi… vuelve a escuchar el clip 🙉');
    }

    setTimeout(() => {
      setFeedback(null);
      if (roundIndex + 1 >= sequence.length) {
        onComplete({
          correct: nextCorrect,
          total: sequence.length,
          score: nextScore,
        });
      } else {
        setRoundIndex((r) => r + 1);
      }
      setBusy(false);
    }, ok ? 700 : 950);
  };

  /**
   * Auto-play tras la transición de pantalla.
   * En web muchos navegadores bloquean audio sin gesto del usuario: ahí no intentamos autoplay.
   */
  useEffect(() => {
    if (Platform.OS === 'web') return undefined;

    let cancelled = false;
    InteractionManager.runAfterInteractions(() => {
      setTimeout(async () => {
        if (!cancelled) await playClip();
      }, 280);
    });

    return () => {
      cancelled = true;
    };
  }, [roundIndex, playClip]);

  /** Baraja nueva cada ronda para no memorizar posiciones en pantalla */
  const shuffledOptions = useMemo(() => {
    void roundIndex;
    const opts = [...OPTIONS];
    for (let i = opts.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [opts[i], opts[j]] = [opts[j], opts[i]];
    }
    return opts;
  }, [roundIndex]);

  if (!current) return null;

  return (
    <View style={styles.wrap}>
      <ScoreBoard
        score={score}
        round={roundIndex + 1}
        totalRounds={sequence.length}
        hint="Escucha con atención y elige la etiqueta correcta."
      />

      <Animatable.View animation="fadeIn" duration={400} style={[styles.panel, shadows.card]}>
        <Text style={styles.title}>¿Qué escuchas?</Text>
        <Text style={styles.sub}>Ronda {roundIndex + 1} de {sequence.length}</Text>
        <GameButton label="🔊 Escuchar / repetir clip" variant="secondary" onPress={playClip} disabled={busy} />
        {Platform.OS === 'web' ? (
          <Text style={styles.webHint}>
            En el navegador, pulsa el botón para escuchar: el autoplay suele estar bloqueado.
          </Text>
        ) : null}
      </Animatable.View>

      <View style={styles.grid}>
        {shuffledOptions.map((opt) => (
          <GameButton
            key={opt.id}
            label={opt.label}
            variant="primary"
            disabled={busy}
            onPress={() => submitAnswer(opt.soundKey)}
          />
        ))}
      </View>

      {feedback ? (
        <Animatable.Text animation="rubberBand" style={styles.feedback}>
          {feedback}
        </Animatable.Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 14,
    paddingBottom: 24,
  },
  panel: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: 16,
    borderWidth: 2,
    borderColor: colors.lightGray,
    gap: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.darkGray,
    textAlign: 'center',
  },
  sub: {
    textAlign: 'center',
    fontWeight: '600',
    color: '#5C6178',
    marginBottom: 4,
  },
  grid: {
    gap: 10,
  },
  feedback: {
    textAlign: 'center',
    fontWeight: '700',
    color: colors.darkGray,
    paddingHorizontal: 8,
  },
  webHint: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    fontWeight: '600',
    lineHeight: 17,
  },
});
