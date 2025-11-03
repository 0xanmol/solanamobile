import { Colors } from '@/constants/colors';
import { BorderRadius, Shadow, Spacing } from '@/constants/spacing';
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
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    backgroundColor: Colors.white,
  },
  closeIcon: {
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: FontSize.lg,
    fontWeight: '600',
    color: Colors.textPrimary,
    fontFamily: FontFamily.montserratSemiBold,
  },
  doneButton: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
  },
  doneText: {
    fontSize: FontSize.sm,
    color: Colors.primary,
    fontWeight: '600',
    fontFamily: FontFamily.poppinsSemiBold,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
  },
  groupTypeSection: {
    marginBottom: Spacing['2xl'],
  },
  sectionTitle: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
    fontFamily: FontFamily.poppinsSemiBold,
  },
  groupTypesRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    flexWrap: 'wrap',
  },
  groupTypeButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.slate50,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    minHeight: 80,
    maxWidth: 80,
    flex: 1,
    marginBottom: Spacing.sm,
  },
  groupTypeButtonSelected: {
    backgroundColor: Colors.primaryLight,
  },
  groupTypeIcon: {
    fontSize: FontSize.lg,
    marginBottom: Spacing.xs,
  },
  groupTypeLabel: {
    fontSize: FontSize.xs,
    color: Colors.textPrimary,
    textAlign: 'center',
    fontFamily: FontFamily.poppinsMedium,
  },
  groupNameSection: {
    marginBottom: Spacing['2xl'],
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingVertical: Spacing.sm,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    fontFamily: FontFamily.poppinsRegular,
  },
  tripDatesSection: {
    marginBottom: Spacing['2xl'],
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  switchLabel: {
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    fontFamily: FontFamily.poppinsMedium,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  dateLabel: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginRight: Spacing.sm,
    fontFamily: FontFamily.montserratRegular,
  },
  dateInput: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingVertical: Spacing.sm,
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
    fontFamily: FontFamily.poppinsRegular,
  },
  dateIcon: {
    marginLeft: Spacing.sm,
    color: Colors.textSecondary,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    flexDirection: 'row',
    gap: Spacing.md,
  },
  fabButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.base,
  },
  fabIcon: {
    color: Colors.white,
  },
});
