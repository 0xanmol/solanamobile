import { Colors } from '@/constants/colors';
import { BorderRadius, Spacing } from '@/constants/spacing';
import { FontFamily, FontSize } from '@/constants/typography';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    backgroundColor: Colors.white,
  },
  backButton: {
    padding: Spacing.sm,
  },
  headerTitle: {
    fontSize: FontSize.lg,
    fontWeight: '600',
    color: Colors.textPrimary,
    fontFamily: FontFamily.montserratSemiBold,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
  },
  groupSection: {
    paddingVertical: Spacing.md,
    marginBottom: Spacing.lg,
  },
  groupInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  groupIcon: {
    width: 50,
    height: 50,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  groupIconText: {
    fontSize: FontSize.lg,
    color: Colors.white,
    fontFamily: FontFamily.poppinsSemiBold,
  },
  groupDetails: {
    flex: 1,
  },
  groupName: {
    fontSize: FontSize.xl,
    fontWeight: '600',
    color: Colors.textPrimary,
    fontFamily: FontFamily.poppinsSemiBold,
  },
  groupIdentifier: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontFamily: FontFamily.montserratRegular,
  },
  sectionTitle: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
    fontFamily: FontFamily.poppinsSemiBold,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.slate200,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  memberInitials: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.poppinsSemiBold,
    color: Colors.slate600,
  },
  memberName: {
    flex: 1,
    fontSize: FontSize.md,
    fontFamily: FontFamily.poppinsMedium,
    color: Colors.textPrimary,
  },
  memberRole: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontFamily: FontFamily.montserratRegular,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIcon: {
    marginRight: Spacing.md,
  },
  optionText: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.poppinsMedium,
    color: Colors.textPrimary,
  },
  optionDescription: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontFamily: FontFamily.montserratRegular,
    marginTop: 2,
  },
  actionRow: {
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.slate100,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  actionButtonText: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.poppinsMedium,
    color: Colors.textPrimary,
    marginLeft: Spacing.sm,
  },
  dangerButton: {
    backgroundColor: Colors.errorLight,
  },
  dangerButtonText: {
    color: Colors.error,
  },
  bottomSpacer: {
    height: Spacing['2xl'],
  },
});
