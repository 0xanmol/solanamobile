import 'package:flutter/material.dart';
import '../constants/coin_toss_constants.dart';

/// A prominent toss button widget for executing the coin toss
class TossButtonWidget extends StatelessWidget {
  final VoidCallback onPressed;
  final double height;

  const TossButtonWidget({
    super.key,
    required this.onPressed,
    required this.height,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      height: height,
      child: DecoratedBox(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(CoinTossConstants.tossButtonBorderRadius),
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              CoinTossConstants.amber400,
              CoinTossConstants.amber600,
              CoinTossConstants.amber800,
            ],
          ),
          boxShadow: [
            BoxShadow(
              color: CoinTossConstants.amber300.withValues(alpha: CoinTossConstants.shadowOpacity),
              blurRadius: 15,
              spreadRadius: 2,
              offset: const Offset(0, 6),
            ),
          ],
        ),
        child: ElevatedButton(
          onPressed: onPressed,
          style: ElevatedButton.styleFrom(
            backgroundColor: Colors.transparent,
            shadowColor: Colors.transparent,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(CoinTossConstants.tossButtonBorderRadius),
            ),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: const [
              Icon(
                CoinTossConstants.tossIcon,
                size: CoinTossConstants.tossButtonIconSize,
                color: CoinTossConstants.black,
              ),
              SizedBox(width: CoinTossConstants.baseSpacing),
              Text(
                CoinTossConstants.tossButtonText,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.w900,
                  letterSpacing: 2.0,
                  color: CoinTossConstants.black,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
