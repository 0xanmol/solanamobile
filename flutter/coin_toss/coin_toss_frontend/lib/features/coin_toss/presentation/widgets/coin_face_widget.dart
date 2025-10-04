import 'package:flutter/material.dart';
import '../constants/coin_toss_constants.dart';

/// A widget that displays a coin face (heads or tails) with proper styling
class CoinFaceWidget extends StatelessWidget {
  final bool isHeads;
  final double size;

  const CoinFaceWidget({
    super.key,
    required this.isHeads,
    required this.size,
  });

  @override
  Widget build(BuildContext context) {
    final double borderWidth = CoinTossConstants.baseBorderWidth * (size / CoinTossConstants.baseCoinSize);
    final double fontSize = CoinTossConstants.baseFontSize * (size / CoinTossConstants.baseCoinSize);

    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        gradient: LinearGradient(
          colors: isHeads
              ? [CoinTossConstants.amber300, CoinTossConstants.amber600, CoinTossConstants.amber800]
              : [CoinTossConstants.grey400, CoinTossConstants.grey600, CoinTossConstants.grey800],
          stops: const [0.0, 0.6, 1.0],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        boxShadow: [
          BoxShadow(
            color: (isHeads ? CoinTossConstants.amber300 : CoinTossConstants.grey400).withValues(
              alpha: CoinTossConstants.shadowOpacity,
            ),
            blurRadius: CoinTossConstants.baseBlurRadius * (size / CoinTossConstants.baseCoinSize),
            spreadRadius: CoinTossConstants.baseSpreadRadius * (size / CoinTossConstants.baseCoinSize),
            offset: Offset(0, CoinTossConstants.baseShadowOffset * (size / CoinTossConstants.baseCoinSize)),
          ),
          BoxShadow(
            color: CoinTossConstants.black.withValues(alpha: CoinTossConstants.shadowOpacity),
            blurRadius: CoinTossConstants.secondaryBlurRadius * (size / CoinTossConstants.baseCoinSize),
            spreadRadius: CoinTossConstants.secondarySpreadRadius * (size / CoinTossConstants.baseCoinSize),
            offset: Offset(0, CoinTossConstants.secondaryShadowOffset * (size / CoinTossConstants.baseCoinSize)),
          ),
        ],
        border: Border.all(
          color: isHeads ? CoinTossConstants.amber100 : CoinTossConstants.grey300,
          width: borderWidth,
        ),
      ),
      child: Center(
        child: Text(
          isHeads ? 'H' : 'T',
          style: TextStyle(
            fontSize: fontSize,
            color: CoinTossConstants.white,
            fontWeight: FontWeight.w900,
            shadows: const [
              Shadow(
                color: CoinTossConstants.black54,
                blurRadius: 12,
                offset: Offset(3, 3),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
