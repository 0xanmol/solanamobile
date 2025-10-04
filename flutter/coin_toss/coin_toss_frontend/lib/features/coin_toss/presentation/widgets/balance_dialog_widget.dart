import 'package:flutter/material.dart';
import '../constants/coin_toss_constants.dart';

/// A dialog widget for displaying the player's balance
class BalanceDialogWidget extends StatelessWidget {
  final double balance;
  final String Function(double) formatSol;

  const BalanceDialogWidget({
    super.key,
    required this.balance,
    required this.formatSol,
  });

  @override
  Widget build(BuildContext context) {
    return Dialog(
      backgroundColor: CoinTossConstants.grey900,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(CoinTossConstants.choiceButtonBorderRadius),
      ),
      child: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(CoinTossConstants.choiceButtonBorderRadius),
          border: Border.all(
            color: CoinTossConstants.amber300.withValues(alpha: 0.3),
            width: 1,
          ),
          gradient: LinearGradient(
            colors: [
              CoinTossConstants.black.withValues(alpha: 0.6),
              CoinTossConstants.black.withValues(alpha: 0.4),
            ],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(
                  CoinTossConstants.balanceIcon,
                  color: CoinTossConstants.amber400,
                ),
                const SizedBox(width: CoinTossConstants.smallSpacing),
                const Text(
                  CoinTossConstants.balanceDialogTitle,
                  style: TextStyle(
                    color: CoinTossConstants.white,
                    fontWeight: FontWeight.w800,
                    fontSize: 18,
                  ),
                ),
              ],
            ),
            const SizedBox(height: CoinTossConstants.baseSpacing),
            SelectableText(
              '${formatSol(balance)} SOL',
              style: const TextStyle(
                color: CoinTossConstants.white,
                fontSize: 16,
                fontWeight: FontWeight.w600,
              ),
            ),
            const SizedBox(height: 16),
            Align(
              alignment: Alignment.centerRight,
              child: ElevatedButton(
                onPressed: () => Navigator.of(context).maybePop(),
                style: ElevatedButton.styleFrom(
                  backgroundColor: CoinTossConstants.amber500,
                  foregroundColor: CoinTossConstants.black,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(10),
                  ),
                ),
                child: const Text(
                  CoinTossConstants.okButtonText,
                  style: TextStyle(fontWeight: FontWeight.w800),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
