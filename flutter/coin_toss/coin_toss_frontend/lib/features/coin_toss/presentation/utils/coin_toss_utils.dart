/// Utility functions for the Coin Toss feature
class CoinTossUtils {
  /// Formats a SOL value to a readable string with proper decimal handling
  static String formatSol(double value) {
    final s = value.toStringAsFixed(9);
    final trimmedZeros = s.contains('.')
        ? s.replaceFirst(RegExp(r'0+$'), '')
        : s;
    return trimmedZeros.endsWith('.')
        ? trimmedZeros.substring(0, trimmedZeros.length - 1)
        : trimmedZeros;
  }

  /// Determines if the screen is narrow based on width
  static bool isNarrowScreen(double width) {
    return width < 380.0;
  }

  /// Determines if the screen is compact based on width
  static bool isCompactScreen(double width) {
    return width < 500.0;
  }

  /// Gets the appropriate coin size based on screen dimensions
  static double getCoinSize(double width) {
    if (isNarrowScreen(width)) return 140.0;
    if (isCompactScreen(width)) return 170.0;
    return 200.0;
  }

  /// Gets the appropriate hero title size based on screen dimensions
  static double getHeroTitleSize(double width) {
    if (isNarrowScreen(width)) return 26.0;
    if (isCompactScreen(width)) return 34.0;
    return 42.0;
  }

  /// Gets the appropriate message font size based on screen dimensions
  static double getMessageFontSize(double width) {
    return isNarrowScreen(width) ? 14.0 : 18.0;
  }

  /// Gets the appropriate choice button height based on screen dimensions
  static double getChoiceHeight(double width) {
    return isNarrowScreen(width) ? 52.0 : 60.0;
  }

  /// Gets the appropriate toss button height based on screen dimensions
  static double getTossHeight(double width) {
    return isNarrowScreen(width) ? 56.0 : 64.0;
  }

  /// Gets the appropriate page padding based on screen dimensions
  static double getPagePadding(double width) {
    return isNarrowScreen(width) ? 16.0 : 24.0;
  }

  /// Gets the appropriate stats height based on screen dimensions
  static double getStatsHeight(double width) {
    return isNarrowScreen(width) ? 56.0 : 64.0;
  }

  /// Gets the appropriate value font size based on screen dimensions
  static double getValueFontSize(double width) {
    return isNarrowScreen(width) ? 13.0 : 14.0;
  }

  /// Gets the appropriate label font size based on screen dimensions
  static double getLabelFontSize(double width) {
    return isNarrowScreen(width) ? 10.0 : 11.0;
  }

  /// Gets the appropriate icon size based on screen dimensions
  static double getIconSize(double width) {
    return isNarrowScreen(width) ? 16.0 : 18.0;
  }
}
