import 'package:coin_toss/features/coin_toss/presentation/coin_toss_notifier.dart';
import 'package:coin_toss/features/coin_toss/presentation/widgets/flipping_coin_animation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:coin_toss/core/ui/error_dialog.dart';

class CoinTossPage extends ConsumerWidget {
  const CoinTossPage({super.key});

  String _formatSol(double value) {
    final s = value.toStringAsFixed(9);
    final trimmedZeros = s.contains('.')
        ? s.replaceFirst(RegExp(r'0+$'), '')
        : s;
    return trimmedZeros.endsWith('.')
        ? trimmedZeros.substring(0, trimmedZeros.length - 1)
        : trimmedZeros;
  }

  Widget _buildFace(bool isHeads, double size) {
    final double s = size;
    final double borderWidth = 6 * (s / 200);
    final double fontSize = 120 * (s / 200);

    return Container(
      width: s,
      height: s,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        gradient: LinearGradient(
          colors: isHeads
              ? [Colors.amber[300]!, Colors.amber[600]!, Colors.amber[800]!]
              : [Colors.grey[400]!, Colors.grey[600]!, Colors.grey[800]!],
          stops: const [0.0, 0.6, 1.0],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        boxShadow: [
          BoxShadow(
            color: (isHeads ? Colors.amber : Colors.grey).withValues(
              alpha: 0.4,
            ),
            blurRadius: 30 * (s / 200),
            spreadRadius: 10 * (s / 200),
            offset: Offset(0, 8 * (s / 200)),
          ),
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.4),
            blurRadius: 20 * (s / 200),
            spreadRadius: 5 * (s / 200),
            offset: Offset(0, 12 * (s / 200)),
          ),
        ],
        border: Border.all(
          color: isHeads ? Colors.amber[100]! : Colors.grey[300]!,
          width: borderWidth,
        ),
      ),
      child: Center(
        child: Text(
          isHeads ? 'H' : 'T',
          style: TextStyle(
            fontSize: fontSize,
            color: Colors.white,
            fontWeight: FontWeight.w900,
            shadows: const [
              Shadow(
                color: Colors.black54,
                blurRadius: 12,
                offset: Offset(3, 3),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildCompactStatsRow({
    required String balanceText,
    required String winsText,
    required String playedText,
    required bool isNarrow,
  }) {
    final TextStyle valueStyle = TextStyle(
      color: Colors.white,
      fontWeight: FontWeight.w700,
      fontSize: isNarrow ? 13 : 14,
    );
    final TextStyle labelStyle = TextStyle(
      color: Colors.white70,
      fontWeight: FontWeight.w500,
      fontSize: isNarrow ? 10 : 11,
      letterSpacing: 0.6,
    );

    Widget item(IconData icon, String label, String value) {
      return Expanded(
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, size: isNarrow ? 16 : 18, color: Colors.amber[300]),
            const SizedBox(width: 6),
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

    return Container(
      height: isNarrow ? 56 : 64,
      padding: const EdgeInsets.symmetric(horizontal: 12),
      decoration: BoxDecoration(
        color: Colors.black.withValues(alpha: 0.18),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: Colors.amber.withValues(alpha: 0.25)),
      ),
      child: Row(
        children: [
          item(Icons.account_balance_wallet, 'BALANCE', balanceText),
          VerticalDivider(
            color: Colors.white12,
            thickness: 1,
            width: 16,
            indent: 10,
            endIndent: 10,
          ),
          item(Icons.emoji_events, 'WINS', winsText),
          VerticalDivider(
            color: Colors.white12,
            thickness: 1,
            width: 16,
            indent: 10,
            endIndent: 10,
          ),
          item(Icons.casino, 'PLAYED', playedText),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final screenState = ref.watch(coinTossScreenProvider);
    final notifier = ref.read(coinTossScreenProvider.notifier);
    final player = screenState.player;
    final totalPlayed = screenState.totalPlayed;
    final totalWon = screenState.totalWon;
    final balance = screenState.balance;
    final isLoadingBalance = screenState.isLoadingBalance;

    // Show error dialog when error is set
    ref.listen<CoinTossScreenState>(coinTossScreenProvider, (prev, next) {
      if (next.error != null && next.error!.isNotEmpty) {
        showAppErrorDialog(
          context,
          title: 'Something went wrong',
          message: next.error!,
        ).then((_) => notifier.clearError());
      }
    });

    final isHeadsSelected = screenState.selectedSideIsHeads == true;
    final isTailsSelected = screenState.selectedSideIsHeads == false;
    final isButtonDisabled = screenState.isFlipping || screenState.isSaving;

    return Scaffold(
      extendBodyBehindAppBar: true,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: const Text(''),
        iconTheme: const IconThemeData(color: Colors.white),
        actions: [
          if (isLoadingBalance)
            const Padding(
              padding: EdgeInsets.only(right: 12),
              child: SizedBox(
                height: 18,
                width: 18,
                child: CircularProgressIndicator(
                  strokeWidth: 2,
                  color: Colors.white,
                ),
              ),
            )
          else if (balance != null && balance > 0)
            IconButton(
              tooltip: 'Show balance',
              icon: const Icon(
                Icons.account_balance_wallet_rounded,
                color: Colors.white,
              ),
              onPressed: () {
                showDialog<void>(
                  context: context,
                  builder: (ctx) {
                    return Dialog(
                      backgroundColor: Colors.grey[900],
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16),
                      ),
                      child: Container(
                        padding: const EdgeInsets.all(20),
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(
                            color: Colors.amber.withValues(alpha: 0.3),
                            width: 1,
                          ),
                          gradient: LinearGradient(
                            colors: [
                              Colors.black.withValues(alpha: 0.6),
                              Colors.black.withValues(alpha: 0.4),
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
                                  Icons.account_balance_wallet_rounded,
                                  color: Colors.amber[400],
                                ),
                                const SizedBox(width: 8),
                                const Text(
                                  'Balance',
                                  style: TextStyle(
                                    color: Colors.white,
                                    fontWeight: FontWeight.w800,
                                    fontSize: 18,
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 12),
                            SelectableText(
                              '${_formatSol(balance)} SOL',
                              style: const TextStyle(
                                color: Colors.white,
                                fontSize: 16,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                            const SizedBox(height: 16),
                            Align(
                              alignment: Alignment.centerRight,
                              child: ElevatedButton(
                                onPressed: () => Navigator.of(ctx).maybePop(),
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: Colors.amber[500],
                                  foregroundColor: Colors.black,
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(10),
                                  ),
                                ),
                                child: const Text(
                                  'OK',
                                  style: TextStyle(fontWeight: FontWeight.w800),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                );
              },
            ),
        ],
      ),
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [Colors.grey[900]!, Colors.grey[850]!, Colors.grey[800]!],
          ),
        ),
        child: SafeArea(
          child: LayoutBuilder(
            builder: (context, constraints) {
              final double maxW = constraints.maxWidth;
              final bool isNarrow = maxW < 380;
              final bool isCompact = maxW < 500;

              final double coinSize = isNarrow
                  ? 140
                  : isCompact
                  ? 170
                  : 200;

              final double heroTitleSize = isNarrow
                  ? 26
                  : isCompact
                  ? 34
                  : 42;

              final double messageFont = isNarrow ? 14 : 18;
              final double choiceHeight = isNarrow ? 52 : 60;
              final double tossHeight = isNarrow ? 56 : 64;

              final EdgeInsets pagePadding = EdgeInsets.all(isNarrow ? 16 : 24);

              return Padding(
                padding: pagePadding,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    const SizedBox(height: 12),

                    // Hero Section
                    Column(
                      children: [
                        Text(
                          'COIN TOSS',
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: TextStyle(
                            fontSize: heroTitleSize,
                            fontWeight: FontWeight.w900,
                            letterSpacing: isNarrow ? 3.0 : 6.0,
                            color: Colors.white,
                            shadows: [
                              Shadow(
                                color: Colors.amber.withValues(alpha: 0.6),
                                blurRadius: 15,
                                offset: const Offset(0, 3),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(height: 6),
                        Text(
                          'Welcome, ${player?.name ?? 'Player'}',
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: TextStyle(
                            fontSize: isNarrow ? 14 : 18,
                            color: Colors.white70,
                            letterSpacing: isNarrow ? 0.8 : 1.5,
                            fontWeight: FontWeight.w300,
                          ),
                        ),
                      ],
                    ),

                    const SizedBox(height: 12),

                    // Compact single-row stats (balance removed to avoid overflow)
                    _buildCompactStatsRow(
                      balanceText: '—',
                      winsText: totalWon?.toString() ?? '--',
                      playedText: totalPlayed?.toString() ?? '--',
                      isNarrow: isNarrow,
                    ),

                    const SizedBox(height: 12),

                    // Coin area (flexible)
                    Expanded(
                      child: Center(
                        child: screenState.isFlipping
                            ? FlippingCoinAnimation(size: coinSize)
                            : _buildFace(
                                screenState.tossResult ??
                                    screenState.selectedSideIsHeads ??
                                    true,
                                coinSize,
                              ),
                      ),
                    ),

                    const SizedBox(height: 8),

                    // Game message - only show when there's a meaningful message
                    if (screenState.message.isNotEmpty)
                      Container(
                        padding: EdgeInsets.symmetric(
                          horizontal: isNarrow ? 16 : 24,
                          vertical: isNarrow ? 10 : 12,
                        ),
                        decoration: BoxDecoration(
                          color: Colors.amber.withValues(alpha: 0.1),
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(
                            color: Colors.amber.withValues(alpha: 0.3),
                            width: 1,
                          ),
                        ),
                        child: Text(
                          screenState.message,
                          textAlign: TextAlign.center,
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: messageFont,
                            fontWeight: FontWeight.w600,
                            letterSpacing: 1.0,
                          ),
                        ),
                      ),

                    if (screenState.message.isNotEmpty)
                      const SizedBox(height: 10),

                    // Choice row
                    Row(
                      children: [
                        Expanded(
                          child: _buildChoiceButton(
                            label: 'HEADS',
                            icon: Icons.looks_one_rounded,
                            isSelected: isHeadsSelected,
                            isDisabled: isButtonDisabled,
                            onPressed: () => notifier.selectSide(true),
                            height: choiceHeight,
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: _buildChoiceButton(
                            label: 'TAILS',
                            icon: Icons.looks_two_rounded,
                            isSelected: isTailsSelected,
                            isDisabled: isButtonDisabled,
                            onPressed: () => notifier.selectSide(false),
                            height: choiceHeight,
                          ),
                        ),
                      ],
                    ),

                    const SizedBox(height: 10),

                    // Toss button
                    if (screenState.selectedSideIsHeads != null &&
                        !isButtonDisabled)
                      SizedBox(
                        width: double.infinity,
                        height: tossHeight,
                        child: DecoratedBox(
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(20),
                            gradient: LinearGradient(
                              begin: Alignment.topLeft,
                              end: Alignment.bottomRight,
                              colors: [
                                Colors.amber[400]!,
                                Colors.amber[600]!,
                                Colors.amber[800]!,
                              ],
                            ),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.amber.withValues(alpha: 0.4),
                                blurRadius: 15,
                                spreadRadius: 2,
                                offset: const Offset(0, 6),
                              ),
                            ],
                          ),
                          child: ElevatedButton(
                            onPressed: () => notifier.makeToss(),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.transparent,
                              shadowColor: Colors.transparent,
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(20),
                              ),
                            ),
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: const [
                                Icon(
                                  Icons.casino_rounded,
                                  size: 28,
                                  color: Colors.black,
                                ),
                                SizedBox(width: 12),
                                Text(
                                  'TOSS COIN!',
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                  style: TextStyle(
                                    fontSize: 20,
                                    fontWeight: FontWeight.w900,
                                    letterSpacing: 2.0,
                                    color: Colors.black,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),

                    const SizedBox(height: 8),
                  ],
                ),
              );
            },
          ),
        ),
      ),
    );
  }

  Widget _buildChoiceButton({
    required String label,
    required IconData icon,
    required bool isSelected,
    required bool isDisabled,
    required VoidCallback onPressed,
    required double height,
  }) {
    return Container(
      height: height,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(16),
        gradient: isSelected
            ? LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [Colors.amber[400]!, Colors.amber[600]!],
              )
            : LinearGradient(
                colors: [
                  Colors.blueGrey[700]!.withValues(alpha: 0.8),
                  Colors.blueGrey[800]!.withValues(alpha: 0.8),
                ],
              ),
        boxShadow: isSelected
            ? [
                BoxShadow(
                  color: Colors.amber.withValues(alpha: 0.4),
                  blurRadius: 12,
                  spreadRadius: 2,
                  offset: const Offset(0, 4),
                ),
              ]
            : [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.2),
                  blurRadius: 8,
                  offset: const Offset(0, 4),
                ),
              ],
        border: Border.all(
          color: isSelected ? Colors.amber[200]! : Colors.transparent,
          width: 2,
        ),
      ),
      child: ElevatedButton(
        onPressed: isDisabled ? null : onPressed,
        style: ElevatedButton.styleFrom(
          backgroundColor: Colors.transparent,
          shadowColor: Colors.transparent,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              icon,
              size: height * 0.38,
              color: isSelected ? Colors.black : Colors.white,
            ),
            const SizedBox(width: 12),
            Flexible(
              child: Text(
                label,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: TextStyle(
                  fontSize: height * 0.32,
                  fontWeight: FontWeight.w700,
                  letterSpacing: 1.0,
                  color: isSelected ? Colors.black : Colors.white,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
