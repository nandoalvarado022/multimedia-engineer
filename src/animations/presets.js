/**
 * Presets compartidos para react-native-animatable (animaciones declarativas).
 * Alternativa: react-native-reanimated para gestos complejos; aquí priorizamos simplicidad.
 */

/** Entrada suave de tarjetas */
export const fadeInUp = {
  from: { opacity: 0, translateY: 16 },
  to: { opacity: 1, translateY: 0 },
};

/** Pulso para llamar la atención en botones principales */
export const pulseAttention = {
  0: { scale: 1 },
  0.5: { scale: 1.04 },
  1: { scale: 1 },
};

/** Celebración rápida al ganar */
export const celebratePop = {
  0: { scale: 0.85, rotate: '-4deg' },
  0.5: { scale: 1.08, rotate: '4deg' },
  1: { scale: 1, rotate: '0deg' },
};
