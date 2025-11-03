import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { FontFamily, FontSize } from '@/constants/typography';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },

  header: {
    height: 60,
    backgroundColor: '#781D27',
    position: 'relative',
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 15,
    left: 20,
    padding: 8,
    zIndex: 5,
  },
  settingsButton: {
    position: 'absolute',
    top: 15,
    right: 20,
    padding: 8,
    zIndex: 5,
  },

  content: { flex: 1, backgroundColor: Colors.white },

  groupInfo: { alignItems: 'center', paddingVertical: Spacing.md },
  iconContainer: {
    shadowColor: Colors.black,
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  iconBackground: {
    width: 64,
    height: 64,
    backgroundColor: '#781D27',
    borderRadius: 14,
    borderWidth: 2,
    borderColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  groupName: {
    fontSize: FontSize['2xl'],
    fontWeight: '600',
    color: '#222222',
    marginTop: Spacing.sm,
    fontFamily: FontFamily.poppinsSemiBold,
  },
  subText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    fontFamily: FontFamily.montserratRegular,
  },

  navButtonsScrollView: {
    marginBottom: Spacing.md,
  },
  navButtonsContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
    justifyContent: 'flex-start',
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    paddingVertical: 6,
    paddingHorizontal: Spacing.sm,
    borderRadius: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.black,
    shadowOpacity: 0.08,
    shadowRadius: 1,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
    gap: 3,
    minWidth: 70,
    marginRight: 6,
  },
  navButtonText: {
    fontSize: 11,
    color: Colors.textPrimary,
    fontWeight: '600',
    fontFamily: FontFamily.poppinsSemiBold,
  },
  activeNavButton: {
    backgroundColor: Colors.warning,
    borderColor: Colors.warning,
  },
  activeNavButtonText: {
    color: Colors.white,
  },

  // Settle Up Content Styles
  settleUpContent: {
    paddingHorizontal: Spacing.lg,
  },
  settleUpHeader: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
    backgroundColor: Colors.white,
  },
  settleUpTitle: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.montserratSemiBold,
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  settleUpAmount: {
    fontSize: FontSize['3xl'],
    fontWeight: '600',
    color: Colors.success,
    fontFamily: FontFamily.poppinsSemiBold,
  },
  expensesSection: {
    paddingBottom: 80,
  },
  expensesHeader: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.montserratSemiBold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  expenseItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  expenseLeft: {
    alignItems: 'center',
    width: 50,
    marginRight: Spacing.sm,
  },
  expenseDate: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.montserratRegular,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  expenseCenter: {
    flex: 1,
  },
  expenseTitle: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.poppinsMedium,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  expensePaidBy: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.montserratRegular,
    color: Colors.textSecondary,
  },
  expenseRight: {
    alignItems: 'flex-end',
    width: 90,
  },
  expenseStatus: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.montserratRegular,
    marginBottom: 2,
  },
  expenseAmount: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.poppinsMedium,
  },
  settledMessage: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
    marginTop: Spacing.md,
  },
  settledText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.montserratRegular,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  tapToShowText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.montserratMedium,
    color: Colors.success,
  },

  mainBody: { alignItems: 'center', marginTop: Spacing['2xl'] },
  title: { fontSize: FontSize.xl, fontWeight: '600', color: '#222', fontFamily: FontFamily.poppinsSemiBold },
  subtitle: { fontSize: FontSize.sm, color: '#777', marginTop: 4, marginBottom: Spacing['2xl'], fontFamily: FontFamily.montserratRegular },
  checkmarkContainer: {
    width: 100,
    height: 100,
    position: 'relative',
    marginTop: Spacing.md,
  },
  checkmarkPart: {
    position: 'absolute',
  },
  checkmarkPart1: {
    top: 20,
    left: 30,
    width: 40,
    height: 60,
    backgroundColor: '#8B5CF6',
    transform: [{ rotate: '45deg' }],
  },
  checkmarkPart2: {
    top: 40,
    left: 50,
    width: 30,
    height: 40,
    backgroundColor: '#7C3AED',
    transform: [{ rotate: '45deg' }],
  },
  checkmarkPart3: {
    top: 60,
    left: 70,
    width: 20,
    height: 30,
    backgroundColor: '#6D28D9',
    transform: [{ rotate: '45deg' }],
  },
  checkmarkPart4: {
    top: 10,
    left: 40,
    width: 25,
    height: 35,
    backgroundColor: '#A855F7',
    transform: [{ rotate: '45deg' }],
  },
  checkmarkPart5: {
    top: 30,
    left: 60,
    width: 35,
    height: 25,
    backgroundColor: '#9333EA',
    transform: [{ rotate: '45deg' }],
  },
});
