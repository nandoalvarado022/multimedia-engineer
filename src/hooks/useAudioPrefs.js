/**
 * Preferencias simples de audio (silenciar música) compartidas entre pantallas.
 * Sin persistencia — suficiente para prototipo; AsyncStorage sería el siguiente paso.
 */

import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

const AudioPrefsContext = createContext(null);

export function AudioPrefsProvider({ children }) {
  const [musicMuted, setMusicMuted] = useState(false);

  const toggleMusicMuted = useCallback(() => {
    setMusicMuted((m) => !m);
  }, []);

  const value = useMemo(
    () => ({
      musicMuted,
      setMusicMuted,
      toggleMusicMuted,
    }),
    [musicMuted, toggleMusicMuted]
  );

  return <AudioPrefsContext.Provider value={value}>{children}</AudioPrefsContext.Provider>;
}

export function useAudioPrefs() {
  const ctx = useContext(AudioPrefsContext);
  if (!ctx) {
    throw new Error('useAudioPrefs debe usarse dentro de AudioPrefsProvider');
  }
  return ctx;
}
