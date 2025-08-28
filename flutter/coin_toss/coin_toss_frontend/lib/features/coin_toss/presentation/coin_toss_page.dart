import 'package:coin_toss/features/coin_toss/presentation/coin_toss_notifier.dart';
import 'package:coin_toss/features/coin_toss/presentation/widgets/flipping_coin_animation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class CoinTossPage extends ConsumerWidget {
  const CoinTossPage({super.key});

  Widget _buildFace(bool isHeads) {
    return Container(
      width: 150,
      height: 150,
      decoration: BoxDecoration(
        color: isHeads ? Colors.amber.shade700 : Colors.grey.shade600,
        shape: BoxShape.circle,
        border: Border.all(
            color: isHeads ? Colors.amber.shade900 : Colors.grey.shade800,
            width: 8),
      ),
      child: Center(
        child: Text(
          isHeads ? 'H' : 'T',
          style: const TextStyle(
              fontSize: 80, color: Colors.white, fontWeight: FontWeight.bold),
        ),
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

    final isHeadsSelected = screenState.selectedSideIsHeads == true;
    final isTailsSelected = screenState.selectedSideIsHeads == false;
    final isButtonDisabled = screenState.isFlipping || screenState.isSaving;

    return Scaffold(
      appBar: AppBar(
        title: Text('Welcome, ${player?.name ?? ''}'),
        actions: [
          Center(
            child: Padding(
              padding: const EdgeInsets.only(right: 16.0),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  if (isLoadingBalance)
                    const CircularProgressIndicator()
                  else if (balance != null)
                    Text('Balance: ${balance.toStringAsFixed(4)} SOL'),
                  if (totalPlayed != null && totalWon != null)
                    Text('Played: $totalPlayed | Won: $totalWon',
                        style: Theme.of(context).textTheme.bodySmall),
                ],
              ),
            ),
          ),
        ],
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            if (screenState.isFlipping)
              const FlippingCoinAnimation()
            else
              _buildFace(screenState.tossResult ?? screenState.selectedSideIsHeads ?? true),
            const SizedBox(height: 20),
            Text(
              screenState.message,
              style: Theme.of(context).textTheme.headlineSmall,
            ),
            const SizedBox(height: 20),
            Column(
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: isHeadsSelected ? Colors.blue.shade200 : null,
                        padding: const EdgeInsets.symmetric(
                            horizontal: 32, vertical: 16),
                      ),
                      onPressed: isButtonDisabled ? null : () => notifier.selectSide(true),
                      child: const Text('Heads'),
                    ),
                    const SizedBox(width: 20),
                    ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: isTailsSelected ? Colors.blue.shade200 : null,
                        padding: const EdgeInsets.symmetric(
                            horizontal: 32, vertical: 16),
                      ),
                      onPressed: isButtonDisabled ? null : () => notifier.selectSide(false),
                      child: const Text('Tails'),
                    ),
                  ],
                ),
                const SizedBox(height: 20),
                ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(
                        horizontal: 48, vertical: 20),
                  ),
                  onPressed: screenState.selectedSideIsHeads == null || isButtonDisabled
                      ? null
                      : () => notifier.makeToss(),
                  child: screenState.isSaving
                      ? const SizedBox(
                          height: 24,
                          width: 24,
                          child: CircularProgressIndicator(strokeWidth: 3, color: Colors.white),
                        )
                      : const Text('Toss!'),
                ),
              ],
            )
          ],
        ),
      ),
    );
  }
}
