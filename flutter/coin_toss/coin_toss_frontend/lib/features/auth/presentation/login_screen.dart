import 'package:coin_toss/features/auth/presentation/login_notifier.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:coin_toss/core/ui/error_dialog.dart';

class LoginScreen extends ConsumerWidget {
  const LoginScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final loginState = ref.watch(loginNotifierProvider);
    final loginNotifier = ref.read(loginNotifierProvider.notifier);

    ref.listen<LoginState>(loginNotifierProvider, (previous, next) {
      if (next.error != null) {
        showAppErrorDialog(
          context,
          title: 'Something went wrong',
          message: next.error!,
        );
      }
    });

    return Scaffold(
      extendBodyBehindAppBar: true,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: const Text(''),
      ),
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [Colors.grey[900]!, Colors.grey[850]!, Colors.grey[800]!],
          ),
        ),
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 32),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                // Coin emblem header (same style as splash)
                Container(
                  width: 120,
                  height: 120,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    gradient: LinearGradient(
                      colors: [
                        Colors.amber[300]!,
                        Colors.amber[600]!,
                        Colors.amber[800]!,
                      ],
                      stops: const [0.0, 0.6, 1.0],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.amber.withValues(alpha: 0.35),
                        blurRadius: 20,
                        spreadRadius: 6,
                        offset: const Offset(0, 4),
                      ),
                      BoxShadow(
                        color: Colors.black.withValues(alpha: 0.2),
                        blurRadius: 12,
                        spreadRadius: 2,
                        offset: const Offset(0, 6),
                      ),
                    ],
                    border: Border.all(color: Colors.amber[100]!, width: 3),
                  ),
                  child: Stack(
                    alignment: Alignment.center,
                    children: const [
                      Icon(Icons.attach_money, size: 64, color: Colors.white),
                    ],
                  ),
                ),

                const SizedBox(height: 32),

                // Title and subtitle
                Text(
                  'COIN TOSS',
                  textAlign: TextAlign.center,
                  style: Theme.of(context).textTheme.headlineLarge?.copyWith(
                    fontSize: 36,
                    fontWeight: FontWeight.bold,
                    letterSpacing: 4.0,
                    color: Colors.white,
                    shadows: [
                      Shadow(
                        color: Colors.amber.withValues(alpha: 0.6),
                        blurRadius: 10,
                        offset: const Offset(0, 2),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'Connect your wallet to get started',
                  textAlign: TextAlign.center,
                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                    fontSize: 16,
                    color: Colors.white70,
                    letterSpacing: 1.2,
                    fontWeight: FontWeight.w300,
                  ),
                ),

                const SizedBox(height: 40),

                // Connect Wallet button
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: loginState.isLoading
                        ? null
                        : () => loginNotifier.connectWallet(context),
                    style: ElevatedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      backgroundColor: Colors.amber[500],
                      foregroundColor: Colors.black,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                      shadowColor: Colors.amber.withValues(alpha: 0.4),
                      elevation: 8,
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        if (loginState.isLoading) ...[
                          const SizedBox(
                            width: 20,
                            height: 20,
                            child: CircularProgressIndicator(
                              strokeWidth: 3,
                              valueColor: AlwaysStoppedAnimation<Color>(
                                Colors.black,
                              ),
                            ),
                          ),
                          const SizedBox(width: 12),
                          const Text(
                            'Connecting...',
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.w600,
                              letterSpacing: 1.0,
                            ),
                          ),
                        ] else ...[
                          const Icon(Icons.account_balance_wallet_rounded),
                          const SizedBox(width: 10),
                          const Text(
                            'Connect Wallet',
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.w700,
                              letterSpacing: 1.2,
                            ),
                          ),
                        ],
                      ],
                    ),
                  ),
                ),

                const SizedBox(height: 16),

                // Info text
                Text(
                  'Mobile Wallet Adapter works on Android devices with a compatible wallet installed.',
                  textAlign: TextAlign.center,
                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                    color: Colors.white60,
                    fontSize: 13,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
