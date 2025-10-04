import 'package:flutter/material.dart';
import '../constants/coin_toss_constants.dart';

/// A compact stats row widget displaying balance, wins, and games played
class StatsRowWidget extends StatelessWidget {
  final String balanceText;
  final String winsText;
  final String playedText;
  final bool isNarrow;

  const StatsRowWidget({
    super.key,
    required this.balanceText,
    required this.winsText,
    required this.playedText,
    required this.isNarrow,
  });

  @override
  Widget build(BuildContext context) {
    final TextStyle valueStyle = TextStyle(
      color: CoinTossConstants.white,
      fontWeight: FontWeight.w700,
      fontSize: CoinTossConstants.getValueFontSize(isNarrow),
    );
    
    final TextStyle labelStyle = TextStyle(
      color: CoinTossConstants.white70,
      fontWeight: FontWeight.w500,
      fontSize: CoinTossConstants.getLabelFontSize(isNarrow),
      letterSpacing: CoinTossConstants.baseLabelLetterSpacing,
    );

    return Container(
      height: CoinTossConstants.getStatsHeight(isNarrow),
      padding: const EdgeInsets.symmetric(horizontal: CoinTossConstants.statsPadding),
      decoration: BoxDecoration(
        color: CoinTossConstants.black.withValues(alpha: CoinTossConstants.mediumOpacity),
        borderRadius: BorderRadius.circular(CoinTossConstants.statsBorderRadius),
        border: Border.all(
          color: CoinTossConstants.amber300.withValues(alpha: CoinTossConstants.highOpacity),
        ),
      ),
      child: Row(
        children: [
          _buildStatItem(
            icon: CoinTossConstants.balanceIcon,
            label: CoinTossConstants.balanceLabel,
            value: balanceText,
            valueStyle: valueStyle,
            labelStyle: labelStyle,
          ),
          const VerticalDivider(
            color: CoinTossConstants.white12,
            thickness: 1,
            width: 16,
            indent: 10,
            endIndent: 10,
          ),
          _buildStatItem(
            icon: CoinTossConstants.winsIcon,
            label: CoinTossConstants.winsLabel,
            value: winsText,
            valueStyle: valueStyle,
            labelStyle: labelStyle,
          ),
          const VerticalDivider(
            color: CoinTossConstants.white12,
            thickness: 1,
            width: 16,
            indent: 10,
            endIndent: 10,
          ),
          _buildStatItem(
            icon: CoinTossConstants.playedIcon,
            label: CoinTossConstants.playedLabel,
            value: playedText,
            valueStyle: valueStyle,
            labelStyle: labelStyle,
          ),
        ],
      ),
    );
  }

  Widget _buildStatItem({
    required IconData icon,
    required String label,
    required String value,
    required TextStyle valueStyle,
    required TextStyle labelStyle,
  }) {
    return Expanded(
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            icon,
            size: CoinTossConstants.getIconSize(isNarrow),
            color: CoinTossConstants.amber300,
          ),
          const SizedBox(width: CoinTossConstants.tinySpacing),
          Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                value,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: valueStyle,
              ),
              Text(
                label,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: labelStyle,
              ),
            ],
          ),
        ],
      ),
    );
  }
}
