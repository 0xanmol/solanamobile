import 'dart:typed_data';
import 'package:coin_toss/features/profile/presentation/profile_notifier.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class ProfilePage extends ConsumerStatefulWidget {
  final String authToken;
  final Uint8List publicKey;
  const ProfilePage({
    super.key,
    required this.authToken,
    required this.publicKey,
  });

  @override
  ConsumerState<ProfilePage> createState() => _ProfilePageState();
}

class _ProfilePageState extends ConsumerState<ProfilePage> {
  final _nameController = TextEditingController();

  void _createProfile() {
    final name = _nameController.text;
    if (name.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enter your name')),
      );
      return;
    }
    ref.read(profileNotifierProvider.notifier).createProfile(
          name: name,
          authToken: widget.authToken,
          publicKey: widget.publicKey,
          context: context,
        );
  }

  @override
  Widget build(BuildContext context) {
    final profileState = ref.watch(profileNotifierProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Create Profile'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            TextField(
              controller: _nameController,
              decoration: const InputDecoration(
                labelText: 'Enter your name',
              ),
            ),
            const SizedBox(height: 20),
            profileState.isLoading
                ? const CircularProgressIndicator()
                : ElevatedButton(
                    onPressed: _createProfile,
                    child: const Text('Save and Play'),
                  ),
          ],
        ),
      ),
    );
  }
}