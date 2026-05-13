/**
 * Estado global de progresión (monedas, XP, logros).
 * Patrón: React Context + useReducer para mantener la lógica predecible y testeable.
 *
 * En una app real podrías hidratar desde AsyncStorage o una API; aquí es 100% local.
 */

import React, { createContext, useCallback, useContext, useMemo, useReducer } from 'react';

const GameContext = createContext(null);

const initialState = {
  coins: 120,
  xp: 0,
  unlockedAchievements: /** @type {string[]} */ ([]),
};

function gameReducer(state, action) {
  switch (action.type) {
    case 'ADD_COINS':
      return { ...state, coins: state.coins + action.amount };
    case 'ADD_XP':
      return { ...state, xp: state.xp + action.amount };
    case 'UNLOCK_ACHIEVEMENT':
      if (state.unlockedAchievements.includes(action.id)) return state;
      return {
        ...state,
        unlockedAchievements: [...state.unlockedAchievements, action.id],
      };
    case 'RESET_PROGRESS':
      return { ...initialState };
    default:
      return state;
  }
}

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const addCoins = useCallback((amount) => {
    dispatch({ type: 'ADD_COINS', amount: Math.max(0, Math.round(amount)) });
  }, []);

  const addXp = useCallback((amount) => {
    dispatch({ type: 'ADD_XP', amount: Math.max(0, Math.round(amount)) });
  }, []);

  const unlockAchievement = useCallback((id) => {
    dispatch({ type: 'UNLOCK_ACHIEVEMENT', id });
  }, []);

  const resetProgress = useCallback(() => {
    dispatch({ type: 'RESET_PROGRESS' });
  }, []);

  const value = useMemo(
    () => ({
      coins: state.coins,
      xp: state.xp,
      unlockedAchievements: state.unlockedAchievements,
      addCoins,
      addXp,
      unlockAchievement,
      resetProgress,
    }),
    [state, addCoins, addXp, unlockAchievement, resetProgress]
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGameProgress() {
  const ctx = useContext(GameContext);
  if (!ctx) {
    throw new Error('useGameProgress debe usarse dentro de GameProvider');
  }
  return ctx;
}
