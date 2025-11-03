import express from 'express';
import db from '../db/database.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Get user profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await db.get(
      'SELECT id, pubkey, name, phone, avatar_uri, timezone, language, is_profile_complete FROM users WHERE id = ?',
      [req.userId]
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update user profile
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { name, phone } = req.body;

    await db.run(
      `UPDATE users SET name = ?, phone = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [name, phone, req.userId]
    );

    const user = await db.get(
      'SELECT id, pubkey, name, phone FROM users WHERE id = ?',
      [req.userId]
    );

    res.json({
      success: true,
      data: user,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Upload profile image
router.post('/profile-image', authMiddleware, async (req, res) => {
  try {
    const { imageUri } = req.body;

    await db.run(
      'UPDATE users SET avatar_uri = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [imageUri, req.userId]
    );

    res.json({
      success: true,
      data: { avatarUri: imageUri },
      message: 'Profile image uploaded successfully'
    });
  } catch (error) {
    console.error('Upload image error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Delete account
router.delete('/account', authMiddleware, async (req, res) => {
  try {
    await db.run('DELETE FROM users WHERE id = ?', [req.userId]);

    res.json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update timezone
router.put('/timezone', authMiddleware, async (req, res) => {
  try {
    const { timezone } = req.body;

    await db.run(
      'UPDATE users SET timezone = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [timezone, req.userId]
    );

    res.json({
      success: true,
      message: 'Timezone updated successfully'
    });
  } catch (error) {
    console.error('Update timezone error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update language
router.put('/language', authMiddleware, async (req, res) => {
  try {
    const { language } = req.body;

    await db.run(
      'UPDATE users SET language = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [language, req.userId]
    );

    res.json({
      success: true,
      message: 'Language updated successfully'
    });
  } catch (error) {
    console.error('Update language error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export default router;
