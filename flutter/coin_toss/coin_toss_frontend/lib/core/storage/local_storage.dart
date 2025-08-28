
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';

final sharedPreferencesProvider = Provider<SharedPreferences>((ref) {
  throw UnimplementedError();
});

class LocalStorage {
  final SharedPreferences _sharedPreferences;

  LocalStorage(this._sharedPreferences);

  Future<void> setValue(String key, dynamic value) async {
    if (value is String) {
      await _sharedPreferences.setString(key, value);
    } else if (value is int) {
      await _sharedPreferences.setInt(key, value);
    } else if (value is double) {
      await _sharedPreferences.setDouble(key, value);
    } else if (value is bool) {
      await _sharedPreferences.setBool(key, value);
    }
  }

  dynamic getValue(String key) {
    return _sharedPreferences.get(key);
  }

  Future<void> removeValue(String key) async {
    await _sharedPreferences.remove(key);
  }
}

final localStorageProvider = Provider<LocalStorage>((ref) {
  final sharedPreferences = ref.watch(sharedPreferencesProvider);
  return LocalStorage(sharedPreferences);
});
