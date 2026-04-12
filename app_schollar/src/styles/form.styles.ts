import { StyleSheet } from 'react-native';

import { colors, radius, spacing } from './theme';

export const formStyles = StyleSheet.create({
  grid: {
    gap: spacing.md,
  },
  dualRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  footerHint: {
    color: colors.textSoft,
    fontSize: 12,
    lineHeight: 18,
  },
  rowFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
    alignItems: 'center',
  },
  summaryCard: {
    borderRadius: radius.lg,
    padding: spacing.md,
    backgroundColor: '#f7fffe',
    borderWidth: 1,
    borderColor: colors.border,
    gap: 6,
  },
  summaryTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  summaryText: {
    color: colors.textSoft,
    fontSize: 13,
    lineHeight: 19,
  },
});