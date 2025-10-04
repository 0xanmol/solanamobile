import 'package:flutter/material.dart';
import '../constants/coin_toss_constants.dart';

/// A widget that displays game messages like "You Won!" or "You Lost!"
class GameMessageWidget extends StatelessWidget {
  final String message;
  final bool isNarrow;

  const GameMessageWidget({
    super.key,
    required this.message,
    required this.isNarrow,
  });

  @override
  Widget build(BuildContext context) {
    if (message.isEmpty) {
      return const SizedBox.shrink();
    }

    return Container(
      padding: EdgeInsets.symmetric(
        horizontal: isNarrow ? CoinTossConstants.narrowPagePadding : CoinTossConstants.basePagePadding,
        vertical: isNarrow ? 10 : CoinTossConstants.baseSpacing,
      ),
      decoration: BoxDecoration(
        color: CoinTossConstants.amber300.withValues(alpha: CoinTossConstants.lightOpacity),
        borderRadius: BorderRadius.circular(CoinTossConstants.choiceButtonBorderRadius),
        border: Border.all(
          color: CoinTossConstants.amber300.withValues(alpha: 0.3),
          width: 1,
        ),
      ),
      child: Text(
        message,
        textAlign: TextAlign.center,
        maxLines: 2,
        overflow: TextOverflow.ellipsis,
        style: TextStyle(
          color: CoinTossConstants.white,
          fontSize: CoinTossConstants.getMessageFontSize(isNarrow),
          fontWeight: FontWeight.w600,
          letterSpacing: 1.0,
        ),
      ),
    );
  }
}
