/**
 * Minijuego 3 — Bug Smasher
 * Rol enseñado: Frontend Developer
 *
 * Parodia errores típicos del front (syntax, estado, componentes rotos).
 * Refuerza lectura rápida de mensajes de error y priorización bajo presión.
 */

import React, { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { colors, radius, shadows } from '../styles/theme';
import { ScoreBoard } from '../components/ScoreBoard';
import { playSoundEffect } from '../audio/AudioManager';

const START_SECONDS = 15;
const SPAWN_MS = 950;
const MAX_BUGS = 7;

const BUG_MESSAGES = [
  'SyntaxError: missing semicolon 😵',
  'undefined is not a function 🤔',
  'Cannot read property “style” of null 💅',
  'Broken button — onClick never fires 🖱️',
  'Warning: Maximum update depth exceeded 🌀',
  'merge conflict in package-lock 💀',
  '404: common sense not found 📭',
  'hydration mismatch — reality unstable 💧',
];

/**
 * @param {object} props
 * @param {(payload: { smashed: number; score: number }) => void} props.onComplete
 */
export function BugSmasherGame({ onComplete }) {
  const { width, height } = useWindowDimensions();
  const playableW = width - 24;
  const playableH = Math.min(height * 0.52, 340);

  const [timeLeft, setTimeLeft] = useState(START_SECONDS);
  const [score, setScore] = useState(0);
  const [smashed, setSmashed] = useState(0);
  /** @type {[{ id: number; left: number; top: number; label: string }]} */
  const [bugs, setBugs] = useState([]);
  const finishedRef = useRef(false);
  const nextBugId = useRef(1);

  // Cuenta atrás
  useEffect(() => {
    const id = setInterval(() => {
      setTimeLeft((t) => (t <= 1 ? 0 : t - 1));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  // Fin de partida exactamente una vez al llegar a 0s
  useEffect(() => {
    if (timeLeft !== 0 || finishedRef.current) return;
    finishedRef.current = true;
    onComplete({ smashed, score });
  }, [timeLeft, smashed, score, onComplete]);

  // Spawner — se detiene al terminar el tiempo
  useEffect(() => {
    if (timeLeft <= 0) return undefined;
    const id = setInterval(() => {
      setBugs((prev) => {
        if (prev.length >= MAX_BUGS) return prev;
        const nid = nextBugId.current++;
        const left = Math.random() * Math.max(playableW - 140, 12);
        const top = Math.random() * Math.max(playableH - 52, 12);
        const label = BUG_MESSAGES[Math.floor(Math.random() * BUG_MESSAGES.length)];
        return [...prev, { id: nid, left, top, label }];
      });
    }, SPAWN_MS);
    return () => clearInterval(id);
  }, [timeLeft, playableW, playableH]);

  const smashBug = (id) => {
    if (finishedRef.current || timeLeft <= 0) return;
    playSoundEffect('success');
    setSmashed((n) => n + 1);
    setScore((s) => s + 10);
    setBugs((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <View style={styles.wrap}>
      <ScoreBoard
        score={score}
        hint={`Tiempo: ${timeLeft}s · Aplasta los bugs antes de que el sprint explote.`}
      />

      <View style={[styles.arena, { width: playableW + 24, height: playableH }]}>
        <Text style={styles.arenaLabel}>Área de código (caótica)</Text>
        {bugs.map((b) => (
          <Pressable
            key={b.id}
            onPress={() => smashBug(b.id)}
            style={[styles.bug, shadows.card, { left: b.left, top: b.top }]}
          >
            <Animatable.View animation="swing" iterationCount="infinite" duration={1400}>
              <Text style={styles.bugEmoji}>🐛</Text>
              <Text style={styles.bugText}>{b.label}</Text>
            </Animatable.View>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 12,
    paddingBottom: 24,
  },
  arena: {
    alignSelf: 'center',
    backgroundColor: '#111827',
    borderRadius: radius.lg,
    borderWidth: 4,
    borderColor: colors.mint,
    overflow: 'hidden',
    position: 'relative',
    marginTop: 4,
  },
  arenaLabel: {
    position: 'absolute',
    top: 8,
    left: 12,
    zIndex: 2,
    color: '#9CA3AF',
    fontSize: 11,
    fontWeight: '700',
  },
  bug: {
    position: 'absolute',
    backgroundColor: colors.white,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: radius.sm,
    maxWidth: 200,
    borderWidth: 2,
    borderColor: colors.orange,
  },
  bugEmoji: {
    fontSize: 22,
    marginBottom: 2,
  },
  bugText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.darkGray,
  },
});
