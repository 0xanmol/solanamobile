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
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.slate100,
  },
  backButton: {
    padding: 6,
  },
  headerTitle: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.montserratSemiBold,
    color: Colors.slate900,
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
  },
  balanceItem: {
    marginBottom: Spacing.sm,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: Spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarPattern: {
    width: 28,
    height: 28,
    position: 'relative',
  },
  pattern1: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  pattern2: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: Colors.white,
  },
  balanceInfo: {
    flex: 1,
  },
  balanceText: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.poppinsMedium,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.poppinsMedium,
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: Spacing.sm,
    gap: Spacing.sm,
  },
  remindButton: {
    flex: 1,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.success,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
  },
  remindButtonText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.poppinsMedium,
    color: Colors.success,
  },
  settleButton: {
    flex: 1,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.success,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
  },
  settleButtonText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.poppinsMedium,
    color: Colors.success,
  },
  expandButton: {
    padding: Spacing.sm,
    marginLeft: Spacing.sm,
  },
  bottomSheet: {
    backgroundColor: Colors.slate50,
    borderTopLeftRadius: BorderRadius['2xl'],
    borderTopRightRadius: BorderRadius['2xl'],
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  bottomSheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.gray300,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: Spacing.md,
  },
  bottomSheetContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bottomSheetText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.montserratRegular,
    color: Colors.textPrimary,
    marginLeft: Spacing.sm,
  },
});
