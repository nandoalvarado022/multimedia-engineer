/**
 * Mapa de claves lógicas → `require()` de archivos WAV locales.
 * Expo empaqueta estos archivos; expo-av reproduce la URI resultante.
 *
 * Convención: nombres en snake_case coinciden con sounds.json para documentación cruzada.
 */

export const SOUND_ASSETS = {
  button_click: require('../assets/sounds/button_click.wav'),
  success: require('../assets/sounds/success.wav'),
  error: require('../assets/sounds/error.wav'),
  explosion: require('../assets/sounds/explosion.wav'),
  ambient_music_clip: require('../assets/sounds/ambient_music.wav'),
  victory: require('../assets/sounds/victory.wav'),
  /** Para Audio Match: el “clic” de interfaz es distinto al botón genérico si se desea */
  ui_click: require('../assets/sounds/button_click.wav'),
};

/** Identificadores reproducibles como música en bucle */
export const MUSIC_ASSETS = {
  bg_music: require('../assets/sounds/bg_music.wav'),
};
