import 'package:audioplayers/audioplayers.dart';

class AudioService {
  static final AudioService _instance = AudioService._internal();
  factory AudioService() => _instance;
  AudioService._internal();

  final AudioPlayer _audioPlayer = AudioPlayer();

  /// Plays the coin flip sound
  Future<void> playCoinFlipSound() async {
    try {
      await _audioPlayer.play(AssetSource('coin-flip-sound.mp3'));
    } catch (e) {
      // Silently handle audio errors to not disrupt the game flow
      print('Error playing coin flip sound: $e');
    }
  }

  /// Stops any currently playing audio
  Future<void> stopAudio() async {
    try {
      await _audioPlayer.stop();
    } catch (e) {
      print('Error stopping audio: $e');
    }
  }

  /// Disposes of the audio player resources
  void dispose() {
    _audioPlayer.dispose();
  }
}
