
import 'package:coin_toss/core/storage/local_storage.dart';
import 'package:coin_toss/features/profile/domain/player.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:solana/solana.dart';

const String _playerNameKey = 'player_name';
const String _playerPublicKey = 'player_public_key';
const String _playerAuthTokenKey = 'player_auth_token';
class ProfileStorageService {
  final LocalStorage _localStorage;

  ProfileStorageService(this._localStorage);

  Future<void> savePlayer(Player player) async {
    await _localStorage.setValue(_playerNameKey, player.name);
    await _localStorage.setValue(_playerPublicKey, player.publicKey.toBase58());
    await _localStorage.setValue(_playerAuthTokenKey, player.authToken);
  }

  Player? getPlayer() {
    final name = _localStorage.getValue(_playerNameKey) as String?;
    final publicKeyB58 = _localStorage.getValue(_playerPublicKey) as String?;
    final authToken = _localStorage.getValue(_playerAuthTokenKey) as String?;

    if (name != null &&
        publicKeyB58 != null &&
        authToken != null
        ) {
      return Player(
        name: name,
        publicKey: Ed25519HDPublicKey.fromBase58(publicKeyB58),
        authToken: authToken,
      );
    }
    return null;
  }
}

final profileStorageServiceProvider = Provider<ProfileStorageService>((ref) {
  final localStorage = ref.watch(localStorageProvider);
  return ProfileStorageService(localStorage);
});
