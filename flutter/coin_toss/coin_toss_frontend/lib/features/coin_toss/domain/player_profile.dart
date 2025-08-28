
import 'dart:convert';
import 'dart:typed_data';

import 'package:solana/solana.dart';

class PlayerProfile {
  final String name;
  final Ed25519HDPublicKey player;
  final BigInt totalPlayed;
  final BigInt totalWon;

  PlayerProfile({
    required this.name,
    required this.player,
    required this.totalPlayed,
    required this.totalWon,
  });

  factory PlayerProfile.fromAccountData(Uint8List data) {
    // Skip 8-byte discriminator for Anchor accounts
    final borshData = data.sublist(8);
    final byteData = ByteData.sublistView(borshData);
    var offset = 0;

    final nameLen = byteData.getUint32(offset, Endian.little);
    offset += 4;
    final name = utf8.decode(borshData.sublist(offset, offset + nameLen));
    offset += nameLen;

    final playerPkBytes = borshData.sublist(offset, offset + 32);
    final player = Ed25519HDPublicKey(playerPkBytes);
    offset += 32;

    // Using getUint64 and converting to BigInt
    final totalPlayed = BigInt.from(byteData.getUint64(offset, Endian.little));
    offset += 8;
    final totalWon = BigInt.from(byteData.getUint64(offset, Endian.little));

    return PlayerProfile(
      name: name,
      player: player,
      totalPlayed: totalPlayed,
      totalWon: totalWon,
    );
  }
}
