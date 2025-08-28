
import 'dart:math';

import 'package:flutter_riverpod/flutter_riverpod.dart';

enum CoinFace { heads, tails }

class CoinTossService {
  final _random = Random();

  CoinFace toss() {
    return _random.nextBool() ? CoinFace.heads : CoinFace.tails;
  }
}

final coinTossServiceProvider = Provider<CoinTossService>((ref) {
  return CoinTossService();
});
