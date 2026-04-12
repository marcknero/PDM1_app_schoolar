import { StyleSheet } from 'react-native';

import { colors, radius, spacing } from './theme';

export const homeStyles = StyleSheet.create({
  quickActionList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  quickAction: {
    flexGrow: 1,
    minWidth: '48%',
  },
  scheduleItem: {
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: 4,
  },
  scheduleTime: {
    color: colors.accentDeep,
    fontSize: 13,
    fontWeight: '700',
  },
  scheduleTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  scheduleMeta: {
    color: colors.textSoft,
    fontSize: 13,
  },
  announcementItem: {
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  announcementTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  announcementText: {
    color: colors.textSoft,
    fontSize: 13,
    lineHeight: 19,
  },
  compactCard: {
    borderRadius: radius.md,
    padding: spacing.md,
    backgroundColor: '#f7fffe',
    borderWidth: 1,
    borderColor: colors.border,
  },
});