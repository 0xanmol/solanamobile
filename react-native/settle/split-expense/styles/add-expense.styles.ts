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
  saveButton: {
    padding: Spacing.sm,
  },
  saveText: {
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
  amountSection: {
    marginBottom: Spacing['2xl'],
  },
  amountInput: {
    fontSize: FontSize['4xl'],
    fontWeight: '600',
    color: Colors.textPrimary,
    textAlign: 'center',
    fontFamily: FontFamily.poppinsSemiBold,
  },
  withRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.lg,
  },
  fieldIconBox: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.slate100,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.sm,
  },
  textInput: {
    flex: 1,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    paddingVertical: Spacing.md,
    fontFamily: FontFamily.poppinsRegular,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  paidByRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  paidByLabel: {
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    marginRight: Spacing.md,
    fontFamily: FontFamily.poppinsMedium,
  },
  pill: {
    backgroundColor: Colors.slate100,
    borderRadius: BorderRadius['2xl'],
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    ...Shadow.sm,
  },
  pillText: {
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
    fontFamily: FontFamily.poppinsMedium,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing['2xl'],
  },
  quickIconBox: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.slate100,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.sm,
  },
  calendarIcon: {
    color: Colors.textSecondary,
  },
  noteIcon: {
    color: Colors.textSecondary,
  },
  splitSection: {
    marginTop: 'auto',
    paddingBottom: Spacing['2xl'],
  },
  splitLabel: {
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
    fontFamily: FontFamily.poppinsMedium,
  },
  splitPills: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  splitPill: {
    backgroundColor: Colors.slate100,
    borderRadius: BorderRadius['2xl'],
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    ...Shadow.sm,
  },
  splitPillSelected: {
    backgroundColor: Colors.primary,
  },
  splitPillText: {
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
    fontFamily: FontFamily.poppinsMedium,
  },
  splitPillTextSelected: {
    color: Colors.white,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing['2xl'],
    width: '90%',
    maxWidth: 400,
    ...Shadow.base,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  modalTitle: {
    fontSize: FontSize.lg,
    fontFamily: FontFamily.montserratSemiBold,
    color: Colors.textPrimary,
    marginLeft: Spacing.sm,
  },
  modalCloseButton: {
    alignSelf: 'flex-end',
    padding: 4,
    marginBottom: Spacing.md,
  },
  modalContent: {
    marginBottom: Spacing['2xl'],
  },
  personRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  personAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.slate200,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  personInitials: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.poppinsSemiBold,
    color: Colors.slate600,
  },
  personName: {
    flex: 1,
    fontSize: FontSize.md,
    fontFamily: FontFamily.poppinsMedium,
    color: Colors.textPrimary,
  },
  personCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  personCheckboxSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  selectedItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginTop: Spacing.sm,
  },
  selectedItem: {
    backgroundColor: Colors.primaryLight,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedItemText: {
    fontSize: FontSize.xs,
    color: Colors.primary,
    fontFamily: FontFamily.poppinsMedium,
    marginRight: Spacing.xs,
  },
  selectedItemRemove: {
    fontSize: FontSize.xs,
    color: Colors.primary,
  },
});
