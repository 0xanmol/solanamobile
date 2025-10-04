import 'package:coin_toss/features/profile/domain/player.dart';
import 'package:coin_toss/features/coin_toss/presentation/coin_toss_notifier.dart';
import 'package:coin_toss/features/coin_toss/presentation/widgets/flipping_coin_animation.dart';
import 'package:coin_toss/features/coin_toss/presentation/widgets/coin_face_widget.dart';
import 'package:coin_toss/features/coin_toss/presentation/widgets/stats_row_widget.dart';
import 'package:coin_toss/features/coin_toss/presentation/widgets/choice_button_widget.dart';
import 'package:coin_toss/features/coin_toss/presentation/widgets/toss_button_widget.dart';
import 'package:coin_toss/features/coin_toss/presentation/widgets/game_message_widget.dart';
import 'package:coin_toss/features/coin_toss/presentation/widgets/balance_dialog_widget.dart';
import 'package:coin_toss/features/coin_toss/presentation/constants/coin_toss_constants.dart';
import 'package:coin_toss/features/coin_toss/presentation/utils/coin_toss_utils.dart';
import 'package:coin_toss/core/ui/error_dialog.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

/// Main page for the Coin Toss game
/// 
/// This page provides a complete coin tossing experience with:
/// - Player statistics display
/// - Coin face visualization
/// - Side selection (heads/tails)
/// - Toss execution with animation
/// - Win/lose result display
class CoinTossPage extends ConsumerWidget {
  const CoinTossPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final screenState = ref.watch(coinTossScreenProvider);
    final notifier = ref.read(coinTossScreenProvider.notifier);

    // Set up error handling
    _setupErrorHandling(context, ref, notifier);

    return Scaffold(
      extendBodyBehindAppBar: true,
      appBar: _buildAppBar(context, screenState),
      body: _buildBody(context, screenState, notifier),
    );
  }

  /// Sets up error handling for the coin toss screen
  void _setupErrorHandling(
    BuildContext context,
    WidgetRef ref,
    CoinTossScreenNotifier notifier,
  ) {
    ref.listen<CoinTossScreenState>(coinTossScreenProvider, (prev, next) {
      if (next.error != null && next.error!.isNotEmpty) {
        showAppErrorDialog(
          context,
          title: CoinTossConstants.errorDialogTitle,
          message: next.error!,
        ).then((_) => notifier.clearError());
      }
    });
  }

  /// Builds the app bar with balance indicator
  PreferredSizeWidget _buildAppBar(BuildContext context, CoinTossScreenState screenState) {
    return AppBar(
      backgroundColor: Colors.transparent,
      elevation: 0,
      title: const Text(''),
      iconTheme: const IconThemeData(color: CoinTossConstants.white),
      actions: [
        if (screenState.isLoadingBalance)
          _buildLoadingIndicator()
        else if (screenState.balance != null && screenState.balance! > 0)
          _buildBalanceButton(context, screenState.balance!),
      ],
    );
  }

  /// Builds the loading indicator for balance
  Widget _buildLoadingIndicator() {
    return const Padding(
      padding: EdgeInsets.only(right: CoinTossConstants.baseSpacing),
      child: SizedBox(
        height: 18,
        width: 18,
        child: CircularProgressIndicator(
          strokeWidth: 2,
          color: CoinTossConstants.white,
        ),
      ),
    );
  }

  /// Builds the balance button that shows balance dialog
  Widget _buildBalanceButton(BuildContext context, double balance) {
    return IconButton(
      tooltip: CoinTossConstants.balanceTooltip,
      icon: const Icon(
        CoinTossConstants.balanceIcon,
        color: CoinTossConstants.white,
      ),
      onPressed: () => _showBalanceDialog(context, balance),
    );
  }

  /// Shows the balance dialog
  void _showBalanceDialog(BuildContext context, double balance) {
    showDialog<void>(
      context: context,
      builder: (ctx) => BalanceDialogWidget(
        balance: balance,
        formatSol: CoinTossUtils.formatSol,
      ),
    );
  }

  /// Builds the main body of the page
  Widget _buildBody(BuildContext context, CoinTossScreenState screenState, CoinTossScreenNotifier notifier) {
    return Container(
      decoration: _buildBackgroundDecoration(),
      child: SafeArea(
        child: LayoutBuilder(
          builder: (context, constraints) {
            final screenDimensions = _calculateScreenDimensions(constraints.maxWidth);
            return _buildMainContent(context, screenState, notifier, screenDimensions);
          },
        ),
      ),
    );
  }

  /// Builds the background gradient decoration
  BoxDecoration _buildBackgroundDecoration() {
    return BoxDecoration(
      gradient: LinearGradient(
        begin: Alignment.topCenter,
        end: Alignment.bottomCenter,
        colors: [
          CoinTossConstants.grey900,
          CoinTossConstants.grey850,
          CoinTossConstants.grey800,
        ],
      ),
    );
  }

  /// Calculates responsive screen dimensions
  ScreenDimensions _calculateScreenDimensions(double width) {
    final isNarrow = CoinTossUtils.isNarrowScreen(width);
    final isCompact = CoinTossUtils.isCompactScreen(width);
    
    return ScreenDimensions(
      isNarrow: isNarrow,
      isCompact: isCompact,
      coinSize: CoinTossUtils.getCoinSize(width),
      heroTitleSize: CoinTossUtils.getHeroTitleSize(width),
      messageFontSize: CoinTossUtils.getMessageFontSize(width),
      choiceHeight: CoinTossUtils.getChoiceHeight(width),
      tossHeight: CoinTossUtils.getTossHeight(width),
      pagePadding: CoinTossUtils.getPagePadding(width),
    );
  }

  /// Builds the main content of the page
  Widget _buildMainContent(
    BuildContext context,
    CoinTossScreenState screenState,
    CoinTossScreenNotifier notifier,
    ScreenDimensions dimensions,
  ) {
    return Padding(
      padding: EdgeInsets.all(dimensions.pagePadding),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          const SizedBox(height: CoinTossConstants.baseSpacing),
          _buildHeroSection(screenState.player, dimensions),
          const SizedBox(height: CoinTossConstants.baseSpacing),
          _buildStatsSection(screenState, dimensions),
          const SizedBox(height: CoinTossConstants.baseSpacing),
          _buildCoinSection(screenState, dimensions),
          const SizedBox(height: CoinTossConstants.smallSpacing),
          _buildGameMessageSection(screenState, dimensions),
          if (screenState.message.isNotEmpty)
            const SizedBox(height: CoinTossConstants.smallSpacing),
          _buildChoiceSection(screenState, notifier, dimensions),
          const SizedBox(height: CoinTossConstants.smallSpacing),
          _buildTossSection(screenState, notifier, dimensions),
          const SizedBox(height: CoinTossConstants.smallSpacing),
        ],
      ),
    );
  }

  /// Builds the hero section with title and welcome message
  Widget _buildHeroSection(Player? player, ScreenDimensions dimensions) {
    return Column(
      children: [
        Text(
          CoinTossConstants.appTitle,
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
          style: TextStyle(
            fontSize: dimensions.heroTitleSize,
            fontWeight: FontWeight.w900,
            letterSpacing: dimensions.isNarrow ? 3.0 : 6.0,
            color: CoinTossConstants.white,
            shadows: [
              Shadow(
                color: CoinTossConstants.amber300.withValues(alpha: CoinTossConstants.textOpacity),
                blurRadius: 15,
                offset: const Offset(0, 3),
              ),
            ],
          ),
        ),
        const SizedBox(height: CoinTossConstants.tinySpacing),
        Text(
          'Welcome, ${player?.name ?? CoinTossConstants.defaultPlayerName}',
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
          style: TextStyle(
            fontSize: dimensions.isNarrow ? 14 : 18,
            color: CoinTossConstants.white70,
            letterSpacing: dimensions.isNarrow ? 0.8 : 1.5,
            fontWeight: FontWeight.w300,
          ),
        ),
      ],
    );
  }

  /// Builds the stats section
  Widget _buildStatsSection(CoinTossScreenState screenState, ScreenDimensions dimensions) {
    return StatsRowWidget(
      balanceText: CoinTossConstants.balancePlaceholder,
      winsText: screenState.totalWon?.toString() ?? CoinTossConstants.statsPlaceholder,
      playedText: screenState.totalPlayed?.toString() ?? CoinTossConstants.statsPlaceholder,
      isNarrow: dimensions.isNarrow,
    );
  }

  /// Builds the coin section with animation or static face
  Widget _buildCoinSection(CoinTossScreenState screenState, ScreenDimensions dimensions) {
    return Expanded(
      child: Center(
        child: screenState.isFlipping
            ? FlippingCoinAnimation(size: dimensions.coinSize)
            : CoinFaceWidget(
                isHeads: screenState.tossResult ??
                    screenState.selectedSideIsHeads ??
                    true,
                size: dimensions.coinSize,
              ),
      ),
    );
  }

  /// Builds the game message section
  Widget _buildGameMessageSection(CoinTossScreenState screenState, ScreenDimensions dimensions) {
    return GameMessageWidget(
      message: screenState.message,
      isNarrow: dimensions.isNarrow,
    );
  }

  /// Builds the choice section with heads/tails buttons
  Widget _buildChoiceSection(
    CoinTossScreenState screenState,
    CoinTossScreenNotifier notifier,
    ScreenDimensions dimensions,
  ) {
    final isHeadsSelected = screenState.selectedSideIsHeads == true;
    final isTailsSelected = screenState.selectedSideIsHeads == false;
    final isButtonDisabled = screenState.isFlipping || screenState.isSaving;

    return Row(
      children: [
        Expanded(
          child: ChoiceButtonWidget(
            label: CoinTossConstants.headsLabel,
            icon: CoinTossConstants.headsIcon,
            isSelected: isHeadsSelected,
            isDisabled: isButtonDisabled,
            onPressed: () => notifier.selectSide(true),
            height: dimensions.choiceHeight,
          ),
        ),
        const SizedBox(width: CoinTossConstants.baseSpacing),
        Expanded(
          child: ChoiceButtonWidget(
            label: CoinTossConstants.tailsLabel,
            icon: CoinTossConstants.tailsIcon,
            isSelected: isTailsSelected,
            isDisabled: isButtonDisabled,
            onPressed: () => notifier.selectSide(false),
            height: dimensions.choiceHeight,
          ),
        ),
      ],
    );
  }

  /// Builds the toss button section
  Widget _buildTossSection(
    CoinTossScreenState screenState,
    CoinTossScreenNotifier notifier,
    ScreenDimensions dimensions,
  ) {
    final isButtonDisabled = screenState.isFlipping || screenState.isSaving;
    
    if (screenState.selectedSideIsHeads == null || isButtonDisabled) {
      return const SizedBox.shrink();
    }

    return TossButtonWidget(
      onPressed: () => notifier.makeToss(),
      height: dimensions.tossHeight,
    );
  }
}

/// Helper class to hold screen dimension calculations
class ScreenDimensions {
  final bool isNarrow;
  final bool isCompact;
  final double coinSize;
  final double heroTitleSize;
  final double messageFontSize;
  final double choiceHeight;
  final double tossHeight;
  final double pagePadding;

  ScreenDimensions({
    required this.isNarrow,
    required this.isCompact,
    required this.coinSize,
    required this.heroTitleSize,
    required this.messageFontSize,
    required this.choiceHeight,
    required this.tossHeight,
    required this.pagePadding,
  });
}
