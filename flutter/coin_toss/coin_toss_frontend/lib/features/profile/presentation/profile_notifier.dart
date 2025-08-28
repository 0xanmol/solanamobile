import 'dart:convert';
import 'dart:typed_data';

import 'package:coin_toss/features/coin_toss/domain/player_profile.dart';
import 'package:coin_toss/features/profile/data/create_player_profile_dto.dart';
import 'package:coin_toss/features/profile/data/profile_storage_service.dart';
import 'package:coin_toss/features/profile/domain/player.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:solana/anchor.dart';
import 'package:solana/dto.dart';
import 'package:solana/encoder.dart';
import 'package:solana/solana.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:solana_mobile_client/solana_mobile_client.dart';

import '../../coin_toss/presentation/coin_toss_page.dart';

class ProfileScreenState {
  final bool isLoading;
  final String? error;

  ProfileScreenState({this.isLoading = false, this.error});

  ProfileScreenState copyWith({bool? isLoading, String? error}) {
    return ProfileScreenState(
      isLoading: isLoading ?? this.isLoading,
      error: error ?? this.error,
    );
  }
}

class ProfileNotifier extends StateNotifier<ProfileScreenState> {
  final ProfileStorageService _profileStorageService;

  ProfileNotifier(this._profileStorageService) : super(ProfileScreenState());

  Future<void> createProfile({
    required String name,
    required String authToken,
    required Uint8List publicKey,
    required BuildContext context,
  }) async {
    state = state.copyWith(isLoading: true);

    LocalAssociationScenario? session;
    try {
      session = await LocalAssociationScenario.create();
      session.startActivityForResult(null).ignore();
      final mobileClient = await session.start();

      await mobileClient.reauthorize(
        identityUri: Uri.parse(dotenv.env['APP_IDENTITY_URI']!),
        identityName: dotenv.env['APP_IDENTITY_NAME']!,
        authToken: authToken,
      );

      final client = SolanaClient(
        rpcUrl: Uri.parse(dotenv.env['SOLANA_RPC_URL']!),
        websocketUrl: Uri.parse(dotenv.env['SOLANA_WEBSOCKET_URL']!),
      );
      final playerPublicKey = Ed25519HDPublicKey(publicKey);

      final programId = Ed25519HDPublicKey.fromBase58(
          dotenv.env['SOLANA_PROGRAM_ID']!);

      final playerProfilePda = await Ed25519HDPublicKey.findProgramAddress(
        seeds: [
          'profile'.codeUnits,
          playerPublicKey.bytes,
        ],
        programId: programId,
      );

      final info = await client.rpcClient
          .getAccountInfo(playerProfilePda.toBase58(), encoding: Encoding.base64);

      if (info.value != null) {
        final accountData = base64Decode(info.value!.data!.toJson()[0]);
        final playerProfile = PlayerProfile.fromAccountData(accountData);

        final existingPlayer = Player(
          name: playerProfile.name,
          publicKey: playerProfile.player,
          authToken: authToken,
        );
        await _profileStorageService.savePlayer(existingPlayer);

        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Profile already exists!')),
        );

        Navigator.of(context).pushReplacement(
          MaterialPageRoute(builder: (_) => const CoinTossPage()),
        );
      } else {
        final dto = CreatePlayerProfileDto(name: name);

        final instruction = await AnchorInstruction.forMethod(
          programId: programId,
          method: 'create_player_profile',
          accounts: [
            AccountMeta(
                pubKey: playerProfilePda, isSigner: false, isWriteable: true),
            AccountMeta(
                pubKey: playerPublicKey, isSigner: true, isWriteable: true),
            AccountMeta(
                pubKey: SystemProgram.id, isSigner: false, isWriteable: false),
          ],
          arguments: ByteArray(dto.toBorsh()),
          namespace: 'global',
        );

        final latestBlockhash = await client.rpcClient.getLatestBlockhash();
        final message = Message(instructions: [instruction]);
        final compiledMessage = message.compileV0(
          recentBlockhash: latestBlockhash.value.blockhash,
          feePayer: playerPublicKey,
        );
        final transaction = SignedTx(
            compiledMessage: compiledMessage,
            signatures: [Signature(Uint8List(64), publicKey: playerPublicKey)]);
        final encodedTx = transaction.encode();
        final Uint8List unsignedTxBytes = base64Decode(encodedTx);

        final signed = await mobileClient.signTransactions(
          transactions: [unsignedTxBytes],
        );
        final signedTx = signed.signedPayloads.first;
        final sig =
            await client.rpcClient.sendTransaction(base64Encode(signedTx));

        await client.waitForSignatureStatus(
          sig,
          status: Commitment.confirmed,
        );

        final newPlayer = Player(
          name: name,
          publicKey: playerPublicKey,
          authToken: authToken,
        );
        await _profileStorageService.savePlayer(newPlayer);
        Navigator.of(context).pushReplacement(
          MaterialPageRoute(builder: (_) => const CoinTossPage()),
        );
      }
    } catch (e) {
      state = state.copyWith(error: e.toString());
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error creating profile: $e')),
      );
    } finally {
      if (session != null) {
        await session.close();
      }
      state = state.copyWith(isLoading: false);
    }
  }
}

final profileNotifierProvider =
    StateNotifierProvider<ProfileNotifier, ProfileScreenState>((ref) {
  final profileStorageService = ref.watch(profileStorageServiceProvider);
  return ProfileNotifier(profileStorageService);
});