import 'dart:typed_data';

import 'package:coin_toss/features/profile/presentation/profile_page.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:solana_mobile_client/solana_mobile_client.dart';
import 'package:flutter/foundation.dart' show kIsWeb, defaultTargetPlatform;

class LoginState {
  final bool isLoading;
  final String? error;

  LoginState({this.isLoading = false, this.error});

  LoginState copyWith({bool? isLoading, String? error}) {
    return LoginState(
      isLoading: isLoading ?? this.isLoading,
      error: error ?? this.error,
    );
  }
}

class LoginNotifier extends StateNotifier<LoginState> {
  LoginNotifier() : super(LoginState());

  Future<void> connectWallet(BuildContext context) async {
    state = state.copyWith(isLoading: true, error: null);

    // Guard: MWA works only on Android
    final bool isAndroid =
        !kIsWeb && defaultTargetPlatform == TargetPlatform.android;
    if (!isAndroid) {
      const String msg =
          'Mobile Wallet Adapter is supported only on Android with a compatible wallet installed.';
      state = state.copyWith(error: msg, isLoading: false);
      return;
    }

    LocalAssociationScenario? session;
    try {
      session = await LocalAssociationScenario.create();
      session.startActivityForResult(null).ignore();
      final client = await session.start();
      final result = await client.authorize(
        identityUri: Uri.parse(dotenv.env['APP_IDENTITY_URI']!),
        identityName: dotenv.env['APP_IDENTITY_NAME']!,
        cluster: dotenv.env['SOLANA_CLUSTER']!,
      );

      if (result?.authToken != null && result?.publicKey != null) {
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(
            builder: (context) => ProfilePage(
              authToken: result!.authToken,
              publicKey: result.publicKey!,
            ),
          ),
        );
      }
    } catch (e) {
      state = state.copyWith(
        error: 'Failed to connect to wallet. Please try again.',
      );
    } finally {
      if (session != null) {
        await session.close();
      }
      state = state.copyWith(isLoading: false);
    }
  }
}

final loginNotifierProvider = StateNotifierProvider<LoginNotifier, LoginState>((
  ref,
) {
  return LoginNotifier();
});
