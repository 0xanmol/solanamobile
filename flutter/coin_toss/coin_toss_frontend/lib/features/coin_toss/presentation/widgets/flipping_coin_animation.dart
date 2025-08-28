import 'package:flutter/material.dart';

class FlippingCoinAnimation extends StatefulWidget {
  const FlippingCoinAnimation({Key? key}) : super(key: key);

  @override
  State<FlippingCoinAnimation> createState() => _FlippingCoinAnimationState();
}

class _FlippingCoinAnimationState extends State<FlippingCoinAnimation>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(seconds: 1),
      vsync: this,
    )..repeat();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return RotationTransition(
      turns: _controller,
      child: Container(
        width: 150,
        height: 150,
        decoration: BoxDecoration(
          color: Colors.amber.shade700,
          shape: BoxShape.circle,
        ),
        child: const Center(
          child: Text(
            '?',
            style: TextStyle(
                fontSize: 80, color: Colors.white, fontWeight: FontWeight.bold),
          ),
        ),
      ),
    );
  }
}
