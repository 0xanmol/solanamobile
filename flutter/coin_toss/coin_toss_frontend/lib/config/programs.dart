import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:solana/src/crypto/ed25519_hd_public_key.dart';

class Programs {
  static final String programId = dotenv.env['SOLANA_PROGRAM_ID']!;
  static final Ed25519HDPublicKey id = Ed25519HDPublicKey.fromBase58(programId);
}