/**
 * Tema visual tipo Duolingo / indie mobile: formas redondeadas y paleta vibrante.
 * Centralizar colores evita “magic strings” y facilita mantener coherencia cartoon.
 */

export const colors = {
  orange: '#FF8C42',
  purple: '#7B68EE',
  yellow: '#FFD93D',
  white: '#FFFFFF',
  darkGray: '#2D3142',
  lightGray: '#E8EAEF',
  mint: '#7DDFC3',
  pink: '#FF6B9D',
  overlay: 'rgba(45, 49, 66, 0.45)',
};

export const spacing = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 22,
  xl: 32,
};

export const radius = {
  sm: 12,
  md: 18,
  lg: 26,
  pill: 999,
};

export const shadows = {
  /** Sombra suave para tarjetas flotantes */
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
};

export const typography = {
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.darkGray,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.darkGray,
  },
  body: {
    fontSize: 15,
    color: colors.darkGray,
    lineHeight: 22,
  },
  caption: {
    fontSize: 12,
    color: '#5C6178',
  },
};
