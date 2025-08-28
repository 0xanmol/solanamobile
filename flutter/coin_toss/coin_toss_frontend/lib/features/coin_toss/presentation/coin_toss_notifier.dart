import 'dart:convert';
import 'dart:typed_data';

import 'package:coin_toss/features/coin_toss/data/execute_toss_dto.dart';
import 'package:coin_toss/features/coin_toss/domain/coin_toss_service.dart';
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

import '../domain/player_profile.dart';

class CoinTossScreenState {
  final Player? player;
  final String message;
  final BigInt? totalPlayed;
  final BigInt? totalWon;
  final bool isSaving;
  final bool isFlipping;
  final bool? tossResult; // true for heads
  final bool? selectedSideIsHeads; // true for heads
  final double? balance;
  final bool isLoadingBalance;

  CoinTossScreenState({
    this.player,
    this.message = '',
    this.totalPlayed,
    this.totalWon,
    this.isSaving = false,
    this.isFlipping = false,
    this.tossResult,
    this.selectedSideIsHeads,
    this.balance,
    this.isLoadingBalance = false,
  });

  CoinTossScreenState copyWith({
    Player? player,
    String? message,
    BigInt? totalPlayed,
    BigInt? totalWon,
    bool? isSaving,
    bool? isFlipping,
    bool? tossResult,
    // use `ValueGetter` to allow passing null
    ValueGetter<bool?>? selectedSideIsHeads,
    double? balance,
    bool? isLoadingBalance,
  }) {
    return CoinTossScreenState(
      player: player ?? this.player,
      message: message ?? this.message,
      totalPlayed: totalPlayed ?? this.totalPlayed,
      totalWon: totalWon ?? this.totalWon,
      isSaving: isSaving ?? this.isSaving,
      isFlipping: isFlipping ?? this.isFlipping,
      tossResult: tossResult ?? this.tossResult,
      selectedSideIsHeads: selectedSideIsHeads != null
          ? selectedSideIsHeads()
          : this.selectedSideIsHeads,
      balance: balance ?? this.balance,
      isLoadingBalance: isLoadingBalance ?? this.isLoadingBalance,
    );
  }
}

class CoinTossScreenNotifier extends StateNotifier<CoinTossScreenState> {
  final ProfileStorageService _profileStorageService;
  final CoinTossService _coinTossService;

  CoinTossScreenNotifier(this._profileStorageService, this._coinTossService)
      : super(CoinTossScreenState()) {
    _init();
  }

  void _init() async {
    final player = _profileStorageService.getPlayer();
    state = state.copyWith(player: player);
    if (player != null) {
      try {
        await _loadOnChainProfile();
        await _fetchBalance();
      } catch (e) {
        state =
            state.copyWith(message: 'Error loading profile: ${e.toString()}');
      }
    }
  }

  void selectSide(bool isHeads) {
    state = state.copyWith(selectedSideIsHeads: () => isHeads, message: '');
  }

  Future<void> _loadOnChainProfile() async {
    final client = SolanaClient(
      rpcUrl: Uri.parse(dotenv.env['SOLANA_RPC_URL']!),
      websocketUrl: Uri.parse(dotenv.env['SOLANA_WEBSOCKET_URL']!),
    );
    final playerPublicKey = state.player!.publicKey;
    final programId = Ed25519HDPublicKey.fromBase58(dotenv.env['SOLANA_PROGRAM_ID']!);

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
      state = state.copyWith(
        totalPlayed: playerProfile.totalPlayed,
        totalWon: playerProfile.totalWon,
      );
    }
  }

  Future<void> _fetchBalance() async {
    if (state.player == null) return;

    state = state.copyWith(isLoadingBalance: true);
    try {
      final client = SolanaClient(
        rpcUrl: Uri.parse(dotenv.env['SOLANA_RPC_URL']!),
        websocketUrl: Uri.parse(dotenv.env['SOLANA_WEBSOCKET_URL']!),
      );
      final playerPublicKey = state.player!.publicKey;
      final bal = await client.rpcClient.getBalance(playerPublicKey.toBase58());
      state = state.copyWith(balance: bal.value / 1000000000);
    } catch (e) {
      state = state.copyWith(message: 'Error fetching balance: ${e.toString()}');
    } finally {
      state = state.copyWith(isLoadingBalance: false);
    }
  }

  Future<void> makeToss() async {
    if (state.player == null ||
        state.isSaving ||
        state.isFlipping ||
        state.selectedSideIsHeads == null) {
      return;
    }

    state = state.copyWith(isSaving: true, message: 'Submitting...');

    LocalAssociationScenario? session;
    try {
      final tossResult = _coinTossService.toss();
      final tossResultIsHeads = tossResult == CoinFace.heads;
      final won = tossResultIsHeads == state.selectedSideIsHeads;

      session = await LocalAssociationScenario.create();
      session.startActivityForResult(null).ignore();
      final mobileClient = await session.start();

      await mobileClient.reauthorize(
        identityUri: Uri.parse(dotenv.env['APP_IDENTITY_URI']!),
        identityName: dotenv.env['APP_IDENTITY_NAME']!,
        authToken: state.player!.authToken,
      );

      final client = SolanaClient(
        rpcUrl: Uri.parse(dotenv.env['SOLANA_RPC_URL']!),
        websocketUrl: Uri.parse(dotenv.env['SOLANA_WEBSOCKET_URL']!),
      );
      final playerPublicKey = state.player!.publicKey;
      final programId = Ed25519HDPublicKey.fromBase58(
          dotenv.env['SOLANA_PROGRAM_ID']!);

      final playerProfilePda = await Ed25519HDPublicKey.findProgramAddress(
        seeds: ['profile'.codeUnits, playerPublicKey.bytes],
        programId: programId,
      );

      final dto = ExecuteTossDto(won: won);

      final instruction = await AnchorInstruction.forMethod(
        programId: programId,
        method: 'execute_toss',
        accounts: [
          AccountMeta(
              pubKey: playerProfilePda, isSigner: false, isWriteable: true),
          AccountMeta(
              pubKey: playerPublicKey, isSigner: true, isWriteable: false),
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
        signatures: [Signature(Uint8List(64), publicKey: playerPublicKey)],
      );
      final unsignedTxBytes = base64Decode(transaction.encode());

      final signed = await mobileClient.signTransactions(
        transactions: [unsignedTxBytes],
      );
      final signedTx = signed.signedPayloads.first;

      final sig = await client.rpcClient.sendTransaction(base64Encode(signedTx));

      await client.waitForSignatureStatus(sig, status: Commitment.confirmed);

      await _loadOnChainProfile();
      await _fetchBalance();

      state = state.copyWith(
        isSaving: false,
        isFlipping: true,
        tossResult: tossResultIsHeads,
        message: '', // Clear submitting message
      );

      await Future.delayed(const Duration(seconds: 2));
      
      state = state.copyWith(
        isFlipping: false,
        message: won ? 'You Won!' : 'You Lost!',
        selectedSideIsHeads: () => null, // Reset selection
      );

    } catch (e) {
      state = state.copyWith(
        isSaving: false,
        isFlipping: false,
        message: 'Error: ${e.toString()}',
      );
    } finally {
      if (session != null) {
        await session.close();
      }
    }
  }
}

final coinTossScreenProvider =
    StateNotifierProvider<CoinTossScreenNotifier, CoinTossScreenState>((ref) {
  final profileStorageService = ref.watch(profileStorageServiceProvider);
  final coinTossService = ref.watch(coinTossServiceProvider);
  return CoinTossScreenNotifier(profileStorageService, coinTossService);
});