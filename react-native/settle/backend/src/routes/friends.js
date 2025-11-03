import express from 'express';
import db from '../db/database.js';
import { authMiddleware } from '../middleware/auth.js';
import { generateId } from '../utils/helpers.js';

const router = express.Router();

// Get all friends for user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const friends = await db.all(
      `SELECT u.id, u.name, u.pubkey, u.phone, u.avatar_uri, f.status, f.created_at
       FROM friends f
       INNER JOIN users u ON (f.friend_id = u.id)
       WHERE f.user_id = ? AND f.status = 'accepted'
       UNION
       SELECT u.id, u.name, u.pubkey, u.phone, u.avatar_uri, f.status, f.created_at
       FROM friends f
       INNER JOIN users u ON (f.user_id = u.id)
       WHERE f.friend_id = ? AND f.status = 'accepted'
       ORDER BY name ASC`,
      [req.userId, req.userId]
    );

    res.json({ success: true, data: friends });
  } catch (error) {
    console.error('Get friends error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Add friend (by pubkey, phone, or userId)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { userId, pubkey, phone, name, email } = req.body;
    let friendId = userId;

    // If pubkey provided, find user by pubkey
    if (pubkey && !userId) {
      const user = await db.get('SELECT id FROM users WHERE pubkey = ?', [pubkey]);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found with this public key' });
      }
      friendId = user.id;
    }

    // If phone provided, find user by phone
    if (phone && !friendId) {
      const user = await db.get('SELECT id FROM users WHERE phone = ?', [phone]);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found with this phone number' });
      }
      friendId = user.id;
    }

    // If neither userId, pubkey, nor phone, but name and email provided, create invitation
    if (!friendId && name && email) {
      return res.status(400).json({
        success: false,
        message: 'User not registered. Use /invite endpoint to send invitation'
      });
    }

    if (!friendId) {
      return res.status(400).json({ success: false, message: 'User ID, pubkey, or phone number required' });
    }

    // Check if trying to add self
    if (friendId === req.userId) {
      return res.status(400).json({ success: false, message: 'Cannot add yourself as friend' });
    }

    // Check if already friends
    const existing = await db.get(
      `SELECT id FROM friends
       WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)`,
      [req.userId, friendId, friendId, req.userId]
    );

    if (existing) {
      return res.status(400).json({ success: false, message: 'Already friends or request pending' });
    }

    // Create friend relationship (auto-accepted for now)
    const friendshipId = generateId();
    await db.run(
      'INSERT INTO friends (id, user_id, friend_id, status) VALUES (?, ?, ?, ?)',
      [friendshipId, req.userId, friendId, 'accepted']
    );

    const friend = await db.get(
      'SELECT id, name, pubkey, phone, avatar_uri FROM users WHERE id = ?',
      [friendId]
    );

    res.status(201).json({
      success: true,
      data: friend,
      message: 'Friend added successfully'
    });
  } catch (error) {
    console.error('Add friend error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Send friend invitation
router.post('/invite', authMiddleware, async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    if (!email && !phone) {
      return res.status(400).json({
        success: false,
        message: 'Email or phone number required'
      });
    }

    // TODO: Implement actual invitation sending logic (email/SMS)
    // For now, just return success
    res.json({
      success: true,
      message: `Invitation sent to ${name || email || phone}`
    });
  } catch (error) {
    console.error('Send invitation error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Remove friend
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const result = await db.run(
      `DELETE FROM friends
       WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)`,
      [req.userId, req.params.id, req.params.id, req.userId]
    );

    if (result.changes === 0) {
      return res.status(404).json({ success: false, message: 'Friend relationship not found' });
    }

    res.json({ success: true, message: 'Friend removed successfully' });
  } catch (error) {
    console.error('Remove friend error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Search users by name or pubkey
router.get('/search', authMiddleware, async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim().length === 0) {
      return res.json({ success: true, data: [] });
    }

    const searchTerm = `%${q}%`;
    const users = await db.all(
      `SELECT id, name, pubkey, phone, avatar_uri
       FROM users
       WHERE (name LIKE ? OR pubkey LIKE ? OR phone LIKE ?)
       AND id != ?
       LIMIT 20`,
      [searchTerm, searchTerm, searchTerm, req.userId]
    );

    // Mark which users are already friends
    for (const user of users) {
      const friendship = await db.get(
        `SELECT id FROM friends
         WHERE ((user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?))
         AND status = 'accepted'`,
        [req.userId, user.id, user.id, req.userId]
      );
      user.isFriend = !!friendship;
    }

    res.json({ success: true, data: users });
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

export default router;
