/**
 * Sistema de audio centralizado con expo-av.
 *
 * Responsabilidades:
 * - Precargar sonidos cortos (Audio.Sound.createAsync) para latencia baja.
 * - Reproducir efectos sin bloquear la UI (async fire-and-forget).
 * - Gestionar música de fondo en bucle con volumen separado.
 *
 * Documentación expo-av: https://docs.expo.dev/versions/latest/sdk/av/
 *
 * Nota educativa: en producción real podrías usar Audio.setAudioModeAsync
 * para silenciar en modo hardware switch (iOS/Android).
 */

import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';
import { SOUND_ASSETS, MUSIC_ASSETS } from './soundAssets';

/** @type {Record<string, import('expo-av').Audio.Sound>} */
const soundCache = {};

/** @type {import('expo-av').Audio.Sound | null} */
let musicInstance = null;

/** Volumen objetivo de la música de menú (debe coincidir con createAsync en startBackgroundMusic) */
const BG_MUSIC_TARGET_VOL = 0.22;

/** @type {ReturnType<typeof setTimeout> | null} */
let duckRestoreTimer = null;

let initialized = false;

/**
 * Baja temporalmente la música cuando suena un clip largo (p. ej. ambiente) para que no tape el SFX.
 */
async function duckBackgroundMusicShort() {
  if (!musicInstance) return;
  try {
    const st = await musicInstance.getStatusAsync();
    if (!st.isLoaded || !st.isPlaying) return;
    await musicInstance.setVolumeAsync(0.06);
    if (duckRestoreTimer) clearTimeout(duckRestoreTimer);
    duckRestoreTimer = setTimeout(async () => {
      duckRestoreTimer = null;
      try {
        const st2 = await musicInstance?.getStatusAsync();
        if (musicInstance && st2?.isLoaded) {
          await musicInstance.setVolumeAsync(BG_MUSIC_TARGET_VOL);
        }
      } catch {
        /* noop */
      }
    }, 850);
  } catch {
    /* noop */
  }
}

/**
 * Configura modo de audio una vez (permite reproducir en silencio si el usuario lo pide más adelante).
 */
export async function initAudioMode() {
  if (initialized) return;
  initialized = true;
  /**
   * MixWithOthers / DuckOthers permiten que la música de menú y los SFX coexistan.
   * Sin mezcla explícita, iOS a veces silencia efectos cortos cuando ya hay otra pista en reproducción.
   */
  await Audio.setAudioModeAsync({
    allowsRecordingIOS: false,
    playsInSilentModeIOS: true,
    staysActiveInBackground: false,
    interruptionModeIOS: InterruptionModeIOS.MixWithOthers,
    interruptionModeAndroid: InterruptionModeAndroid.DuckOthers,
    shouldDuckAndroid: true,
    playThroughEarpieceAndroid: false,
  });
}

/**
 * Precarga efectos usados con frecuencia.
 */
export async function preloadCommonSounds() {
  await initAudioMode();
  const keys = ['button_click', 'success', 'error'];
  await Promise.all(keys.map((k) => loadSound(k)));
}

/** Precarga efectos usados en minijuegos (sin reproducirlos). */
export async function preloadMinigameSounds() {
  await initAudioMode();
  const keys = ['button_click', 'success', 'error', 'explosion', 'ambient_music_clip', 'victory', 'ui_click'];
  await Promise.all(keys.map((k) => loadSound(k)));
}

async function loadSound(key) {
  if (soundCache[key]) return soundCache[key];
  const uri = SOUND_ASSETS[key];
  if (!uri) return null;
  const { sound } = await Audio.Sound.createAsync(uri, { shouldPlay: false });
  soundCache[key] = sound;
  return sound;
}

/**
 * Reproduce un efecto por clave. Si no está en caché, carga bajo demanda.
 * @param {keyof typeof SOUND_ASSETS} key
 * @param {{ volume?: number; duckMusic?: boolean }} [opts]
 */
export async function playSoundEffect(key, opts = {}) {
  try {
    await initAudioMode();
    if (opts.duckMusic) {
      await duckBackgroundMusicShort();
    }
    let sound = soundCache[key];
    if (!sound) {
      sound = await loadSound(key);
    }
    if (!sound) return;
    const status = await sound.getStatusAsync();
    if (!status.isLoaded) return;

    await sound.setVolumeAsync(opts.volume ?? 1);

    /**
     * En Android/iOS, hacer seek al inicio mientras la pista sigue “activa” puede fallar en silencio.
     * Detener antes de rebobinar hace el reinicio fiable para clips repetidos (Audio Match).
     */
    if (status.isPlaying || (status.positionMillis ?? 0) > 0) {
      try {
        await sound.stopAsync();
      } catch {
        /* ya detenido */
      }
    }
    await sound.setPositionAsync(0);
    await sound.playAsync();
  } catch (e) {
    if (__DEV__) {
      console.warn('[AudioManager] playSoundEffect', key, e);
    }
  }
}

/**
 * Inicia música de menú en bucle (volumen bajo para no cansar).
 */
export async function startBackgroundMusic() {
  await initAudioMode();
  if (musicInstance) return;
  const { sound } = await Audio.Sound.createAsync(MUSIC_ASSETS.bg_music, {
    isLooping: true,
    volume: BG_MUSIC_TARGET_VOL,
    shouldPlay: true,
  });
  musicInstance = sound;
}

/**
 * Detiene y descarga música de fondo (útil al salir de la app en tareas avanzadas).
 */
export async function stopBackgroundMusic() {
  if (!musicInstance) return;
  try {
    await musicInstance.stopAsync();
    await musicInstance.unloadAsync();
  } finally {
    musicInstance = null;
  }
}

/**
 * Reproduce sonido de UI (wrapper semántico para efectos de botón).
 */
export function playButtonSound() {
  return playSoundEffect('button_click', { volume: 0.85 });
}
