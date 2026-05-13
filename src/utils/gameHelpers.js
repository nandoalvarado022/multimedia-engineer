/**
 * Utilidades puras para puntuación y estrellas (sin dependencias de React).
 */

/**
 * Calcula estrellas (1-3) a partir de ratio correcto en quizzes.
 * @param {number} correct
 * @param {number} total
 */
export function starsFromAccuracy(correct, total) {
  if (total <= 0) return 1;
  const ratio = correct / total;
  if (ratio >= 1) return 3;
  if (ratio >= 0.66) return 2;
  return 1;
}

/**
 * Estrellas para Bug Smasher según bugs aplastados.
 * @param {number} smashed
 */
export function starsFromBugCount(smashed) {
  if (smashed >= 12) return 3;
  if (smashed >= 7) return 2;
  return 1;
}

/**
 * Multiplicador de recompensa por estrellas.
 * @param {number} stars
 */
export function rewardMultiplier(stars) {
  return stars === 3 ? 1.2 : stars === 2 ? 1 : 0.75;
}
