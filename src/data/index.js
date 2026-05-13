/**
 * Capa de datos mock (simula un backend REST sin red).
 *
 * Los JSON se empaquetan con Metro mediante `require()`, igual que assets estáticos.
 * Ventajas para prototipo educativo: sin servidor, reproducible, fácil de versionar.
 */

/** Proyectos de clientes con diálogos y minijuego asociado */
export const projects = require('./projects.json');

/** Roles de ingeniería multimedia para la pantalla Roles */
export const roles = require('./roles.json');

/** Metadatos de minijuegos disponibles */
export const minigames = require('./minigames.json');

/** Catálogo documental de sonidos (referencia humana + archivos en assets) */
export const soundsCatalog = require('./sounds.json');

/** Logros falsos para gamificación y portfolio */
export const achievements = require('./achievements.json');

/** Escenarios para el minijuego UI Fixer */
export const uiFixerScenarios = require('./uiFixerScenarios.json');

/**
 * Busca un proyecto por id.
 * @param {string} id
 */
export function getProjectById(id) {
  return projects.find((p) => p.id === id) ?? null;
}

/**
 * Busca metadatos de minijuego por id.
 * @param {string} id
 */
export function getMinigameById(id) {
  return minigames.find((m) => m.id === id) ?? null;
}
