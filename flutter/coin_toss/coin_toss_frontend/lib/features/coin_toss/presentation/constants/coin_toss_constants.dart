import 'package:flutter/material.dart';

/// Constants for the Coin Toss page UI and functionality
class CoinTossConstants {
  // Screen breakpoints
  static const double narrowScreenWidth = 380.0;
  static const double compactScreenWidth = 500.0;

  // Coin sizing
  static const double baseCoinSize = 200.0;
  static const double narrowCoinSize = 140.0;
  static const double compactCoinSize = 170.0;

  // Font sizes
  static const double baseHeroTitleSize = 42.0;
  static const double narrowHeroTitleSize = 26.0;
  static const double compactHeroTitleSize = 34.0;

  static const double baseMessageFontSize = 18.0;
  static const double narrowMessageFontSize = 14.0;

  // Button heights
  static const double baseChoiceHeight = 60.0;
  static const double narrowChoiceHeight = 52.0;
  static const double baseTossHeight = 64.0;
  static const double narrowTossHeight = 56.0;

  // Spacing
  static const double basePagePadding = 24.0;
  static const double narrowPagePadding = 16.0;
  static const double baseSpacing = 12.0;
  static const double smallSpacing = 8.0;
  static const double tinySpacing = 6.0;

  // Coin face styling
  static const double baseBorderWidth = 6.0;
  static const double baseFontSize = 120.0;
  static const double baseBlurRadius = 30.0;
  static const double baseSpreadRadius = 10.0;
  static const double baseShadowOffset = 8.0;
  static const double secondaryBlurRadius = 20.0;
  static const double secondarySpreadRadius = 5.0;
  static const double secondaryShadowOffset = 12.0;

  // Stats container
  static const double baseStatsHeight = 64.0;
  static const double narrowStatsHeight = 56.0;
  static const double statsPadding = 12.0;
  static const double statsBorderRadius = 14.0;

  // Text styling
  static const double baseValueFontSize = 14.0;
  static const double narrowValueFontSize = 13.0;
  static const double baseLabelFontSize = 11.0;
  static const double narrowLabelFontSize = 10.0;
  static const double baseLabelLetterSpacing = 0.6;

  // Button styling
  static const double choiceButtonBorderRadius = 16.0;
  static const double tossButtonBorderRadius = 20.0;
  static const double choiceButtonBorderWidth = 2.0;
  static const double choiceButtonIconSizeMultiplier = 0.38;
  static const double choiceButtonFontSizeMultiplier = 0.32;

  // Icon sizes
  static const double baseIconSize = 18.0;
  static const double narrowIconSize = 16.0;
  static const double tossButtonIconSize = 28.0;

  // Colors
  static const Color primaryAmber = Color(0xFFFFC107);
  static const Color amber300 = Color(0xFFFFD54F);
  static const Color amber400 = Color(0xFFFFCA28);
  static const Color amber500 = Color(0xFFFFC107);
  static const Color amber600 = Color(0xFFFFB300);
  static const Color amber800 = Color(0xFFFF8F00);
  static const Color amber100 = Color(0xFFFFF8E1);
  static const Color amber200 = Color(0xFFFFF59D);

  static const Color grey300 = Color(0xFFE0E0E0);
  static const Color grey400 = Color(0xFFBDBDBD);
  static const Color grey600 = Color(0xFF757575);
  static const Color grey700 = Color(0xFF616161);
  static const Color grey800 = Color(0xFF424242);
  static const Color grey850 = Color(0xFF303030);
  static const Color grey900 = Color(0xFF212121);

  static const Color white = Color(0xFFFFFFFF);
  static const Color white70 = Color(0xB3FFFFFF);
  static const Color white12 = Color(0x1FFFFFFF);
  static const Color black = Color(0xFF000000);
  static const Color black54 = Color(0x8A000000);

  // Opacity values
  static const double lightOpacity = 0.1;
  static const double mediumOpacity = 0.18;
  static const double highOpacity = 0.25;
  static const double shadowOpacity = 0.4;
  static const double textOpacity = 0.6;

  // Animation durations
  static const Duration coinFlipDuration = Duration(seconds: 2);

  // Text content
  static const String appTitle = 'COIN TOSS';
  static const String headsLabel = 'HEADS';
  static const String tailsLabel = 'TAILS';
  static const String tossButtonText = 'TOSS COIN!';
  static const String balanceLabel = 'BALANCE';
  static const String winsLabel = 'WINS';
  static const String playedLabel = 'PLAYED';
  static const String balanceDialogTitle = 'Balance';
  static const String okButtonText = 'OK';
  static const String balanceTooltip = 'Show balance';
  static const String errorDialogTitle = 'Something went wrong';
  static const String defaultPlayerName = 'Player';
  static const String balancePlaceholder = '—';
  static const String statsPlaceholder = '--';

  // Icons
  static const IconData headsIcon = Icons.looks_one_rounded;
  static const IconData tailsIcon = Icons.looks_two_rounded;
  static const IconData tossIcon = Icons.casino_rounded;
  static const IconData balanceIcon = Icons.account_balance_wallet_rounded;
  static const IconData winsIcon = Icons.emoji_events;
  static const IconData playedIcon = Icons.casino;

  // Responsive calculations
  static double getCoinSize(bool isNarrow, bool isCompact) {
    if (isNarrow) return narrowCoinSize;
    if (isCompact) return compactCoinSize;
    return baseCoinSize;
  }

  static double getHeroTitleSize(bool isNarrow, bool isCompact) {
    if (isNarrow) return narrowHeroTitleSize;
    if (isCompact) return compactHeroTitleSize;
    return baseHeroTitleSize;
  }

  static double getMessageFontSize(bool isNarrow) {
    return isNarrow ? narrowMessageFontSize : baseMessageFontSize;
  }

  static double getChoiceHeight(bool isNarrow) {
    return isNarrow ? narrowChoiceHeight : baseChoiceHeight;
  }

  static double getTossHeight(bool isNarrow) {
    return isNarrow ? narrowTossHeight : baseTossHeight;
  }

  static double getPagePadding(bool isNarrow) {
    return isNarrow ? narrowPagePadding : basePagePadding;
  }

  static double getStatsHeight(bool isNarrow) {
    return isNarrow ? narrowStatsHeight : baseStatsHeight;
  }

  static double getValueFontSize(bool isNarrow) {
    return isNarrow ? narrowValueFontSize : baseValueFontSize;
  }

  static double getLabelFontSize(bool isNarrow) {
    return isNarrow ? narrowLabelFontSize : baseLabelFontSize;
  }

  static double getIconSize(bool isNarrow) {
    return isNarrow ? narrowIconSize : baseIconSize;
  }
}
