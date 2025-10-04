import 'package:flutter/material.dart';
import '../constants/coin_toss_constants.dart';

/// A choice button widget for selecting heads or tails
class ChoiceButtonWidget extends StatelessWidget {
  final String label;
  final IconData icon;
  final bool isSelected;
  final bool isDisabled;
  final VoidCallback onPressed;
  final double height;

  const ChoiceButtonWidget({
    super.key,
    required this.label,
    required this.icon,
    required this.isSelected,
    required this.isDisabled,
    required this.onPressed,
    required this.height,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      height: height,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(CoinTossConstants.choiceButtonBorderRadius),
        gradient: isSelected
            ? LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [CoinTossConstants.amber400, CoinTossConstants.amber600],
              )
            : LinearGradient(
                colors: [
                  CoinTossConstants.grey700.withValues(alpha: 0.8),
                  CoinTossConstants.grey800.withValues(alpha: 0.8),
                ],
              ),
        boxShadow: isSelected
            ? [
                BoxShadow(
                  color: CoinTossConstants.amber300.withValues(alpha: CoinTossConstants.shadowOpacity),
                  blurRadius: 12,
                  spreadRadius: 2,
                  offset: const Offset(0, 4),
                ),
              ]
            : [
                BoxShadow(
                  color: CoinTossConstants.black.withValues(alpha: 0.2),
                  blurRadius: 8,
                  offset: const Offset(0, 4),
                ),
              ],
        border: Border.all(
          color: isSelected ? CoinTossConstants.amber200 : Colors.transparent,
          width: CoinTossConstants.choiceButtonBorderWidth,
        ),
      ),
      child: ElevatedButton(
        onPressed: isDisabled ? null : onPressed,
        style: ElevatedButton.styleFrom(
          backgroundColor: Colors.transparent,
          shadowColor: Colors.transparent,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(CoinTossConstants.choiceButtonBorderRadius),
          ),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              icon,
              size: height * CoinTossConstants.choiceButtonIconSizeMultiplier,
              color: isSelected ? CoinTossConstants.black : CoinTossConstants.white,
            ),
            const SizedBox(width: CoinTossConstants.baseSpacing),
            Flexible(
              child: Text(
                label,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: TextStyle(
                  fontSize: height * CoinTossConstants.choiceButtonFontSizeMultiplier,
                  fontWeight: FontWeight.w700,
                  letterSpacing: 1.0,
                  color: isSelected ? CoinTossConstants.black : CoinTossConstants.white,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
