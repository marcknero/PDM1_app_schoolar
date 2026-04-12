import { StyleSheet } from 'react-native';

import { colors, radius, shadow, spacing } from './theme';

export const loginStyles = StyleSheet.create({
  heroArt: {
    height: 132,
    borderRadius: radius.xl,
    backgroundColor: colors.primaryDark,
    overflow: 'hidden',
    justifyContent: 'space-between',
    padding: spacing.lg,
    ...shadow,
  },
  heroGlowTop: {
    position: 'absolute',
    top: -54,
    right: -12,
    width: 160,
    height: 160,
    borderRadius: 160,
    backgroundColor: 'rgba(20, 184, 166, 0.34)',
  },
  heroGlowBottom: {
    position: 'absolute',
    bottom: -70,
    left: -30,
    width: 180,
    height: 180,
    borderRadius: 180,
    backgroundColor: 'rgba(167, 243, 208, 0.18)',
  },
  heroBadge: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    paddingHorizontal: spacing.md,
    paddingVertical: 7,
  },
  heroBadgeText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  heroNote: {
    color: 'rgba(255,255,255,0.86)',
    fontSize: 14,
    lineHeight: 20,
    maxWidth: 240,
  },
  formCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.lg,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow,
  },
  formIntro: {
    color: colors.textSoft,
    fontSize: 14,
    lineHeight: 20,
  },
});