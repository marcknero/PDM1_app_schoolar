import { StyleSheet } from 'react-native';

import { colors, radius, spacing } from './theme';

export const reportStyles = StyleSheet.create({
  reportHero: {
    padding: spacing.lg,
    borderRadius: radius.xl,
    backgroundColor: colors.primaryDark,
    gap: spacing.sm,
  },
  reportHeroTitle: {
    color: colors.white,
    fontSize: 26,
    lineHeight: 32,
    fontWeight: '800',
  },
  reportHeroText: {
    color: 'rgba(255,255,255,0.86)',
    fontSize: 14,
    lineHeight: 20,
  },
  gradeList: {
    gap: spacing.sm,
  },
  gradeRow: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#f7fffe',
    padding: spacing.md,
    gap: 10,
  },
  gradeRowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
  },
  gradeSubject: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
    flex: 1,
  },
  gradeValue: {
    color: colors.primaryDark,
    fontSize: 16,
    fontWeight: '800',
  },
  progressTrack: {
    height: 10,
    borderRadius: 999,
    overflow: 'hidden',
    backgroundColor: 'rgba(15, 118, 110, 0.12)',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: colors.accent,
  },
  gradeMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  gradeMetaText: {
    color: colors.textSoft,
    fontSize: 12,
    fontWeight: '600',
  },
  resultTile: {
    flex: 1,
    minWidth: '48%',
    borderRadius: radius.md,
    backgroundColor: '#f7fffe',
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: 6,
  },
  resultTitle: {
    color: colors.textSoft,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    fontWeight: '700',
  },
  resultValue: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
  },
  resultSubvalue: {
    color: colors.textSoft,
    fontSize: 12,
    lineHeight: 18,
  },
});