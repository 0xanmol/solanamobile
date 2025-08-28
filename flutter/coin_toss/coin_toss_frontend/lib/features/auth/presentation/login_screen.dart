import 'package:coin_toss/features/auth/presentation/login_notifier.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class LoginScreen extends ConsumerWidget {
  const LoginScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final loginState = ref.watch(loginNotifierProvider);
    final loginNotifier = ref.read(loginNotifierProvider.notifier);

    ref.listen<LoginState>(
      loginNotifierProvider,
      (previous, next) {
        if (next.error != null) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text(next.error!)),
          );
        }
      },
    );

    return Scaffold(
      appBar: AppBar(
        title: const Text('Login'),
      ),
      body: Center(
        child: loginState.isLoading
            ? const CircularProgressIndicator()
            : ElevatedButton(
                onPressed: () => loginNotifier.connectWallet(context),
                child: const Text('Connect Wallet'),
              ),
      ),
    );
  }
}
