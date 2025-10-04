import 'package:flutter/material.dart';
import 'package:vector_math/vector_math_64.dart' as vector_math;
import 'dart:math' as math;

class FlippingCoinAnimation extends StatefulWidget {
  const FlippingCoinAnimation({super.key, this.size = 200});

  final double size;

  @override
  State<FlippingCoinAnimation> createState() => _FlippingCoinAnimationState();
}

class _FlippingCoinAnimationState extends State<FlippingCoinAnimation>
    with TickerProviderStateMixin {
  late AnimationController _spinController;
  late AnimationController _bounceController;
  late Animation<double> _spinAnimation;
  late Animation<double> _bounceAnimation;
  late Animation<double> _scaleAnimation;
  late Animation<double> _elevationAnimation;

  @override
  void initState() {
    super.initState();
    
    // Main spin animation - creates 3D rotation effect
    _spinController = AnimationController(
      duration: const Duration(milliseconds: 2000),
      vsync: this,
    );
    
    // Bounce animation for landing effect
    _bounceController = AnimationController(
      duration: const Duration(milliseconds: 400),
      vsync: this,
    );
    
    // Create spin animation with custom curve for realistic physics
    _spinAnimation = Tween<double>(
      begin: 0.0,
      end: 1.0,
    ).animate(CurvedAnimation(
      parent: _spinController,
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
    
    // Scale animation for depth effect (coin appears to move away and back)
    _scaleAnimation = Tween<double>(
      begin: 1.0,
      end: 0.4,
    ).animate(CurvedAnimation(
      parent: _spinController,
      curve: Curves.easeInOut,
    ));
    
    // Elevation animation for 3D depth
    _elevationAnimation = Tween<double>(
      begin: 0.0,
      end: 1.0,
    ).animate(CurvedAnimation(
      parent: _spinController,
      curve: Curves.easeInOut,
    ));
    
    // Start the animation sequence
    _startAnimation();
  }

  void _startAnimation() async {
    // Start spin animation
    await _spinController.forward();
    
    // Start bounce animation for landing effect
    await _bounceController.forward();
    
    // Reset for potential repeat
    _spinController.reset();
    _bounceController.reset();
  }

  @override
  void dispose() {
    _spinController.dispose();
    _bounceController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final double s = widget.size;
    final double borderWidth = 6 * (s / 200);
    final double fontSize = 120 * (s / 200);

    return AnimatedBuilder(
      animation: Listenable.merge([_spinAnimation, _bounceAnimation]),
      builder: (context, child) {
        // Calculate rotation angle (multiple rotations for spinning effect)
        final double rotationAngle = _spinAnimation.value * 6 * math.pi;
        
        // Calculate scale based on spin progress (creates 3D depth effect)
        final double scale = _scaleAnimation.value;
        
        // Calculate bounce offset
        final double bounceOffset = _bounceAnimation.value * 15;
        
        // Calculate elevation for 3D effect
        final double elevation = _elevationAnimation.value * 20;
        
        // Calculate which side should be visible based on rotation
        final bool showHeads = (rotationAngle % (2 * math.pi)) < math.pi;
        
        // Calculate perspective based on rotation for more realistic 3D effect
        final double perspective = 0.0008 + (math.sin(rotationAngle) * 0.0002);
        
        return Transform.translate(
          offset: Offset(0, -bounceOffset),
          child: Transform.scale(
            scale: scale,
            child: Transform(
              alignment: Alignment.center,
              transform: Matrix4.identity()
                ..setEntry(3, 2, perspective) // Dynamic perspective
                ..rotateY(rotationAngle)
                ..rotateX(math.sin(rotationAngle * 0.5) * 0.1) // Slight X rotation for wobble
                ..translateByVector3(vector_math.Vector3(0.0, 0.0, elevation)), // Z translation for depth
              child: Container(
                width: s,
                height: s,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  gradient: LinearGradient(
                    colors: showHeads
                        ? [
                            Colors.amber[300]!,
                            Colors.amber[600]!,
                            Colors.amber[800]!,
                            Colors.amber[900]!,
                          ]
                        : [
                            Colors.grey[400]!,
                            Colors.grey[600]!,
                            Colors.grey[800]!,
                            Colors.grey[900]!,
                          ],
                    stops: const [0.0, 0.3, 0.7, 1.0],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  boxShadow: [
                    // Main shadow
                    BoxShadow(
                      color: (showHeads ? Colors.amber : Colors.grey)
                          .withValues(alpha: 0.6),
                      blurRadius: 40 * scale,
                      spreadRadius: 15 * scale,
                      offset: Offset(0, 12 * scale),
                    ),
                    // Secondary shadow for depth
                    BoxShadow(
                      color: Colors.black.withValues(alpha: 0.5),
                      blurRadius: 25 * scale,
                      spreadRadius: 8 * scale,
                      offset: Offset(0, 18 * scale),
                    ),
                    // Edge highlight
                    BoxShadow(
                      color: Colors.white.withValues(alpha: 0.2),
                      blurRadius: 8 * scale,
                      spreadRadius: 2 * scale,
                      offset: Offset(-2 * scale, -2 * scale),
                    ),
                  ],
                  border: Border.all(
                    color: showHeads ? Colors.amber[100]! : Colors.grey[300]!,
                    width: borderWidth * scale,
                  ),
                ),
                child: Center(
                  child: AnimatedSwitcher(
                    duration: const Duration(milliseconds: 50),
                    child: Text(
                      showHeads ? 'H' : 'T',
                      key: ValueKey(showHeads),
                      style: TextStyle(
                        fontSize: fontSize * scale,
                        color: Colors.white,
                        fontWeight: FontWeight.w900,
                        shadows: [
                          Shadow(
                            color: Colors.black.withValues(alpha: 0.8),
                            blurRadius: 15 * scale,
                            offset: Offset(4 * scale, 4 * scale),
                          ),
                          Shadow(
                            color: Colors.white.withValues(alpha: 0.3),
                            blurRadius: 2 * scale,
                            offset: Offset(-1 * scale, -1 * scale),
                          ),
                        ],
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
