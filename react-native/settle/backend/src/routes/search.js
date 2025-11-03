import express from 'express';
import db from '../db/database.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Search users by name or pubkey
router.get('/users', authMiddleware, async (req, res) => {
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

// Unified search (groups, friends, expenses)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim().length === 0) {
      return res.json({
        success: true,
        data: {
          users: [],
          groups: [],
          expenses: []
        }
      });
    }

    const searchTerm = `%${q}%`;

    // Search users
    const users = await db.all(
      `SELECT id, name, pubkey, phone, avatar_uri
       FROM users
       WHERE (name LIKE ? OR pubkey LIKE ? OR phone LIKE ?)
       AND id != ?
       LIMIT 10`,
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

    // Search groups (only groups user is a member of)
    const groups = await db.all(
      `SELECT g.id, g.name, g.type, g.image_uri,
        (SELECT COUNT(*) FROM group_members WHERE group_id = g.id) as member_count
       FROM groups g
       INNER JOIN group_members gm ON g.id = gm.group_id
       WHERE gm.user_id = ? AND g.name LIKE ?
       LIMIT 10`,
      [req.userId, searchTerm]
    );

    // Search expenses (only expenses user is involved in)
    const expenses = await db.all(
      `SELECT DISTINCT e.id, e.description, e.amount, e.date, e.category,
        u.name as paid_by_name,
        g.name as group_name
       FROM expenses e
       INNER JOIN users u ON e.paid_by = u.id
       LEFT JOIN groups g ON e.group_id = g.id
       LEFT JOIN expense_participants ep ON e.id = ep.expense_id
       WHERE (e.paid_by = ? OR ep.user_id = ?)
       AND e.description LIKE ?
       ORDER BY e.date DESC
       LIMIT 10`,
      [req.userId, req.userId, searchTerm]
    );

    res.json({
      success: true,
      data: {
        users,
        groups,
        expenses
      }
    });
  } catch (error) {
    console.error('Unified search error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

export default router;
