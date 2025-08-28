import 'package:solana/solana.dart';

class Player {
  final String name;
  final Ed25519HDPublicKey publicKey;
  final String authToken;

  Player({
    required this.name,
    required this.publicKey,
    required this.authToken,
  });

  Player copyWith({
    String? name,
    Ed25519HDPublicKey? publicKey,
    String? authToken,
    int? balance,
  }) {
    return Player(
      name: name ?? this.name,
      publicKey: publicKey ?? this.publicKey,
      authToken: authToken ?? this.authToken,
    );
  }
}
