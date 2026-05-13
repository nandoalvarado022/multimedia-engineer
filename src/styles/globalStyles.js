import { StyleSheet } from 'react-native';
import { colors, spacing } from './theme';

/** Estilos base reutilizables en pantallas (layout seguro + fondos). */
export const globalStyles = StyleSheet.create({
  flex1: { flex: 1 },
  row: { flexDirection: 'row', alignItems: 'center' },
  center: { justifyContent: 'center', alignItems: 'center' },
  padded: { padding: spacing.md },
  safeTop: { paddingTop: spacing.lg },
  cardSurface: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: spacing.md,
  },
});
