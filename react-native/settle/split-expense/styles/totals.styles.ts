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
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  backButton: {
    padding: Spacing.sm,
    marginRight: Spacing.sm,
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: FontSize.xl,
    fontFamily: FontFamily.montserratSemiBold,
    color: Colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.montserratRegular,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  infoButton: {
    padding: Spacing.sm,
    marginLeft: Spacing.sm,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
  },
  chartContainer: {
    height: 180,
    marginBottom: Spacing['2xl'],
    position: 'relative',
    justifyContent: 'flex-end',
    backgroundColor: Colors.slate50,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
  },
  chartGrid: {
    position: 'absolute',
    top: Spacing.md,
    left: Spacing.md,
    right: Spacing.md,
    bottom: Spacing.md,
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
  },
  gridLine: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    borderStyle: 'dashed',
  },
  barsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: '100%',
    paddingHorizontal: Spacing.lg,
  },
  barWrapper: {
    alignItems: 'center',
    width: 50,
  },
  bar: {
    width: 30,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.sm,
  },
  barLow: {
    height: 20,
    backgroundColor: Colors.gray300,
  },
  barHigh: {
    height: 120,
    backgroundColor: Colors.success,
  },
  barLabel: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.montserratRegular,
    color: Colors.textSecondary,
  },
  summarySection: {
    marginBottom: Spacing['2xl'],
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  summaryLabel: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.poppinsMedium,
    color: Colors.textPrimary,
    marginRight: Spacing.sm,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.success,
    marginRight: Spacing.sm,
  },
  amountText: {
    fontSize: FontSize['3xl'],
    fontFamily: FontFamily.poppinsSemiBold,
    color: Colors.success,
  },
  sharePercentage: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.montserratRegular,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
    marginLeft: Spacing.md,
  },
  proUsersSection: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    marginTop: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  proUsersText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.montserratRegular,
    color: Colors.textTertiary,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  bottomBarButton: {
    borderRadius: BorderRadius['2xl'],
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    backgroundColor: 'transparent',
  },
  bottomBarButtonSelected: {
    backgroundColor: Colors.borderLight,
  },
  bottomBarButtonText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.poppinsMedium,
    color: Colors.textSecondary,
  },
  bottomBarButtonTextSelected: {
    color: Colors.textPrimary,
  },
  bottomBarDateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Spacing.sm,
  },
  bottomBarDateText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.poppinsMedium,
    color: Colors.textPrimary,
    marginRight: 4,
  },
  datePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  datePickerTitle: {
    fontSize: FontSize.lg,
    fontFamily: FontFamily.montserratSemiBold,
    color: Colors.textPrimary,
  },
  datePickerContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  datePickerOption: {
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  datePickerOptionText: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.poppinsRegular,
    color: Colors.textPrimary,
  },
  modalCloseButton: {
    alignSelf: 'flex-end',
    padding: 4,
    marginBottom: Spacing.md,
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
  modalMessage: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.montserratRegular,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: Spacing['2xl'],
  },
  modalActionButton: {
    marginTop: Spacing.md,
  },
});
