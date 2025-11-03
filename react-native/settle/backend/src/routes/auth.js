import express from 'express';
import jwt from 'jsonwebtoken';
import db from '../db/database.js';
import { generateId } from '../utils/helpers.js';

const router = express.Router();

// Connect wallet / Check if user exists
router.post('/connect', async (req, res) => {
  try {
    const { pubkey } = req.body;

    if (!pubkey) {
      return res.status(400).json({
        success: false,
        message: 'Public key is required'
      });
    }

    // Check if user exists
    const user = await db.get(
      'SELECT id, pubkey, name, phone, avatar_uri, is_profile_complete FROM users WHERE pubkey = ?',
      [pubkey]
    );

    if (user) {
      // User exists - return token
      const token = jwt.sign({ userId: user.id, pubkey: user.pubkey }, process.env.JWT_SECRET, {
        expiresIn: '30d'
      });

      return res.json({
        success: true,
        data: {
          token,
          user,
          isNewUser: false
        },
        message: 'Wallet connected successfully'
      });
    }

    // New user - create account but mark profile as incomplete
    const userId = generateId();
    await db.run(
      `INSERT INTO users (id, pubkey, is_profile_complete) VALUES (?, ?, 0)`,
      [userId, pubkey]
    );

    // Create default email settings
    await db.run(
      `INSERT INTO email_settings (user_id) VALUES (?)`,
      [userId]
    );

    const token = jwt.sign({ userId, pubkey }, process.env.JWT_SECRET, {
      expiresIn: '30d'
    });

    res.status(201).json({
      success: true,
      data: {
        token,
        user: {
          id: userId,
          pubkey,
          name: null,
          is_profile_complete: 0
        },
        isNewUser: true,
        requiresProfileCompletion: true
      },
      message: 'Wallet connected - profile completion required'
    });
  } catch (error) {
    console.error('Connect wallet error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Complete profile (for new users)
router.post('/complete-profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { name, phone } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Name is required'
      });
    }

    await db.run(
      `UPDATE users SET name = ?, phone = ?, is_profile_complete = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [name, phone, decoded.userId]
    );

    const user = await db.get(
      'SELECT id, pubkey, name, phone, avatar_uri, is_profile_complete FROM users WHERE id = ?',
      [decoded.userId]
    );

    res.json({
      success: true,
      data: { user },
      message: 'Profile completed successfully'
    });
  } catch (error) {
    console.error('Complete profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Logout (client-side token removal)
router.post('/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Logout successful'
  });
});

export default router;
