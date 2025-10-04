import 'package:flutter/material.dart';
import 'dart:math' as math;

class CoinTossOverlayAnimation extends StatefulWidget {
  const CoinTossOverlayAnimation({
    super.key,
    required this.tossResult,
    required this.onComplete,
  });

  final bool tossResult; // true for heads
  final VoidCallback onComplete;

  @override
  State<CoinTossOverlayAnimation> createState() => _CoinTossOverlayAnimationState();
}

class _CoinTossOverlayAnimationState extends State<CoinTossOverlayAnimation>
    with TickerProviderStateMixin {
  late AnimationController _flipController;
  late AnimationController _bounceController;
  late AnimationController _fadeController;
  late Animation<double> _flipAnimation;
  late Animation<double> _bounceAnimation;
  late Animation<double> _fadeAnimation;
  late Animation<double> _scaleAnimation;

  @override
  void initState() {
    super.initState();
    
    // Main flip animation - simulates coin flipping through 3D space
    _flipController = AnimationController(
      duration: const Duration(milliseconds: 2000),
      vsync: this,
    );
    
    // Bounce animation for landing effect
    _bounceController = AnimationController(
      duration: const Duration(milliseconds: 400),
      vsync: this,
    );
    
    // Fade animation for overlay entrance/exit
    _fadeController = AnimationController(
      duration: const Duration(milliseconds: 500),
      vsync: this,
    );
    
    // Create flip animation with custom curve for realistic physics
    _flipAnimation = Tween<double>(
      begin: 0.0,
      end: 1.0,
    ).animate(CurvedAnimation(
      parent: _flipController,
      curve: Curves.easeInOut,
    ));
    
    // Create bounce animation for landing
    _bounceAnimation = Tween<double>(
      begin: 0.0,
      end: 1.0,
    ).animate(CurvedAnimation(
      parent: _bounceController,
      curve: Curves.elasticOut,
    ));
    
    // Create fade animation
    _fadeAnimation = Tween<double>(
      begin: 0.0,
      end: 1.0,
    ).animate(CurvedAnimation(
      parent: _fadeController,
      curve: Curves.easeInOut,
    ));
    
    // Scale animation for depth effect
    _scaleAnimation = Tween<double>(
      begin: 1.0,
      end: 0.4,
    ).animate(CurvedAnimation(
      parent: _flipController,
      curve: Curves.easeInOut,
    ));
    
    // Start the animation sequence
    _startAnimation();
  }

  void _startAnimation() async {
    // Fade in the overlay
    await _fadeController.forward();
    
    // Start flip animation
    await _flipController.forward();
    
    // Start bounce animation for landing effect
    await _bounceController.forward();
    
    // Wait a moment to show the result
    await Future.delayed(const Duration(milliseconds: 1000));
    
    // Fade out and complete
    await _fadeController.reverse();
    
    widget.onComplete();
  }

  @override
  void dispose() {
    _flipController.dispose();
    _bounceController.dispose();
    _fadeController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final screenSize = MediaQuery.of(context).size;
    final coinSize = math.min(screenSize.width, screenSize.height) * 0.4;
    final double borderWidth = 6 * (coinSize / 200);
    final double fontSize = 120 * (coinSize / 200);

    return AnimatedBuilder(
      animation: Listenable.merge([_flipAnimation, _bounceAnimation, _fadeAnimation]),
      builder: (context, child) {
        // Calculate rotation angle (multiple rotations for spinning effect)
        final double rotationAngle = _flipAnimation.value * 6 * math.pi;
        
        // Calculate scale based on flip progress (creates 3D depth effect)
        final double scale = _scaleAnimation.value;
        
        // Calculate bounce offset
        final double bounceOffset = _bounceAnimation.value * 15;
        
        // Calculate fade opacity
        final double fadeOpacity = _fadeAnimation.value;
        
        // Calculate which side should be visible based on rotation
        final bool showHeads = (rotationAngle % (2 * math.pi)) < math.pi;
        
        return Material(
          color: Colors.black.withValues(alpha: 0.8 * fadeOpacity),
          child: Container(
            width: double.infinity,
            height: double.infinity,
            child: Center(
              child: Transform.translate(
                offset: Offset(0, -bounceOffset),
                child: Transform.scale(
                  scale: scale,
                  child: Transform(
                    alignment: Alignment.center,
                    transform: Matrix4.identity()
                      ..setEntry(3, 2, 0.001) // Perspective
                      ..rotateY(rotationAngle),
                    child: Container(
                      width: coinSize,
                      height: coinSize,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        gradient: LinearGradient(
                          colors: showHeads
                              ? [
                                  Colors.amber[300]!,
                                  Colors.amber[600]!,
                                  Colors.amber[800]!,
                                ]
                              : [
                                  Colors.grey[400]!,
                                  Colors.grey[600]!,
                                  Colors.grey[800]!,
                                ],
                          stops: const [0.0, 0.6, 1.0],
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                        ),
                        boxShadow: [
                          BoxShadow(
                            color: (showHeads ? Colors.amber : Colors.grey)
                                .withValues(alpha: 0.6 * fadeOpacity),
                            blurRadius: 40 * scale,
                            spreadRadius: 15 * scale,
                            offset: Offset(0, 10 * scale),
                          ),
                          BoxShadow(
                            color: Colors.black.withValues(alpha: 0.6 * fadeOpacity),
                            blurRadius: 30 * scale,
                            spreadRadius: 8 * scale,
                            offset: Offset(0, 15 * scale),
                          ),
                        ],
                        border: Border.all(
                          color: showHeads ? Colors.amber[100]! : Colors.grey[300]!,
                          width: borderWidth * scale,
                        ),
                      ),
                      child: Center(
                        child: AnimatedSwitcher(
                          duration: const Duration(milliseconds: 150),
                          child: Text(
                            showHeads ? 'H' : 'T',
                            key: ValueKey(showHeads),
                            style: TextStyle(
                              fontSize: fontSize * scale,
                              color: Colors.white,
                              fontWeight: FontWeight.w900,
                              shadows: [
                                Shadow(
                                  color: Colors.black54,
                                  blurRadius: 15 * scale,
                                  offset: Offset(4 * scale, 4 * scale),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
        );
      },
    );
  }
}
