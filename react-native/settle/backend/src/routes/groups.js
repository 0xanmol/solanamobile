import express from 'express';
import db from '../db/database.js';
import { authMiddleware } from '../middleware/auth.js';
import { generateId, generateInviteCode, formatDate } from '../utils/helpers.js';

const router = express.Router();

// Get all groups for user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const groups = await db.all(
      `SELECT g.*,
        (SELECT COUNT(*) FROM group_members WHERE group_id = g.id) as member_count
       FROM groups g
       INNER JOIN group_members gm ON g.id = gm.group_id
       WHERE gm.user_id = ?
       ORDER BY g.created_at DESC`,
      [req.userId]
    );

    res.json({ success: true, data: groups });
  } catch (error) {
    console.error('Get groups error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Get single group
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const group = await db.get('SELECT * FROM groups WHERE id = ?', [req.params.id]);
    if (!group) return res.status(404).json({ success: false, message: 'Group not found' });

    const members = await db.all(
      `SELECT u.id, u.name, u.pubkey, u.avatar_uri
       FROM users u
       INNER JOIN group_members gm ON u.id = gm.user_id
       WHERE gm.group_id = ?`,
      [req.params.id]
    );

    res.json({ success: true, data: { ...group, members } });
  } catch (error) {
    console.error('Get group error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Create group
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, type, tripStartDate, tripEndDate } = req.body;
    const groupId = generateId();
    const inviteCode = generateInviteCode();

    await db.run(
      `INSERT INTO groups (id, name, type, trip_start_date, trip_end_date, invite_code, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [groupId, name, type, formatDate(tripStartDate), formatDate(tripEndDate), inviteCode, req.userId]
    );

    await db.run(
      `INSERT INTO group_members (id, group_id, user_id) VALUES (?, ?, ?)`,
      [generateId(), groupId, req.userId]
    );

    await db.run(
      `INSERT INTO activities (id, type, user_id, group_id, description)
       VALUES (?, 'group_created', ?, ?, ?)`,
      [generateId(), req.userId, groupId, `${name} was created`]
    );

    const group = await db.get('SELECT * FROM groups WHERE id = ?', [groupId]);
    res.status(201).json({ success: true, data: group, message: 'Group created successfully' });
  } catch (error) {
    console.error('Create group error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Update group
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { name, type, tripStartDate, tripEndDate } = req.body;

    // Build dynamic update query based on provided fields
    const updates = [];
    const params = [];

    if (name !== undefined) {
      updates.push('name = ?');
      params.push(name);
    }
    if (type !== undefined) {
      updates.push('type = ?');
      params.push(type);
    }
    if (tripStartDate !== undefined) {
      updates.push('trip_start_date = ?');
      params.push(formatDate(tripStartDate));
    }
    if (tripEndDate !== undefined) {
      updates.push('trip_end_date = ?');
      params.push(formatDate(tripEndDate));
    }

    if (updates.length === 0) {
      return res.status(400).json({ success: false, message: 'No fields to update' });
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    params.push(req.params.id);

    await db.run(
      `UPDATE groups SET ${updates.join(', ')} WHERE id = ?`,
      params
    );

    const group = await db.get('SELECT * FROM groups WHERE id = ?', [req.params.id]);
    res.json({ success: true, data: group, message: 'Group updated successfully' });
  } catch (error) {
    console.error('Update group error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Delete group
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await db.run('DELETE FROM groups WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Group deleted successfully' });
  } catch (error) {
    console.error('Delete group error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Leave group
router.post('/:id/leave', authMiddleware, async (req, res) => {
  try {
    await db.run('DELETE FROM group_members WHERE group_id = ? AND user_id = ?', [req.params.id, req.userId]);
    await db.run(
      `INSERT INTO activities (id, type, user_id, group_id, description) VALUES (?, 'member_left', ?, ?, ?)`,
      [generateId(), req.userId, req.params.id, 'A member left the group']
    );
    res.json({ success: true, message: 'Left group successfully' });
  } catch (error) {
    console.error('Leave group error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Update group settings
router.put('/:id/settings', authMiddleware, async (req, res) => {
  try {
    const { simplifyDebts, defaultSplit } = req.body;
    await db.run(
      `UPDATE groups SET simplify_debts = ?, default_split = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [simplifyDebts ? 1 : 0, defaultSplit, req.params.id]
    );
    res.json({ success: true, message: 'Group settings updated successfully' });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Get group members
router.get('/:id/members', authMiddleware, async (req, res) => {
  try {
    const members = await db.all(
      `SELECT u.id, u.name, u.pubkey, u.avatar_uri, gm.joined_at
       FROM users u
       INNER JOIN group_members gm ON u.id = gm.user_id
       WHERE gm.group_id = ?`,
      [req.params.id]
    );
    res.json({ success: true, data: members });
  } catch (error) {
    console.error('Get members error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Add member to group
router.post('/:id/members', authMiddleware, async (req, res) => {
  try {
    const { userId, pubkey } = req.body;
    let memberId = userId;

    if (pubkey && !userId) {
      const user = await db.get('SELECT id FROM users WHERE pubkey = ?', [pubkey]);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });
      memberId = user.id;
    }

    const existing = await db.get(
      'SELECT id FROM group_members WHERE group_id = ? AND user_id = ?',
      [req.params.id, memberId]
    );

    if (existing) return res.status(400).json({ success: false, message: 'User is already a member' });

    await db.run(`INSERT INTO group_members (id, group_id, user_id) VALUES (?, ?, ?)`, [generateId(), req.params.id, memberId]);
    await db.run(
      `INSERT INTO activities (id, type, user_id, group_id, description) VALUES (?, 'member_added', ?, ?, ?)`,
      [generateId(), memberId, req.params.id, 'A new member joined the group']
    );

    res.json({ success: true, message: 'Member added successfully' });
  } catch (error) {
    console.error('Add member error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

export default router;
