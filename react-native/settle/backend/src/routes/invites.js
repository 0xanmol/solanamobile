import express from 'express';
import db from '../db/database.js';
import { authMiddleware } from '../middleware/auth.js';
import { generateId, generateInviteCode } from '../utils/helpers.js';

const router = express.Router();

// Get invite link/code for group
router.get('/:groupId', authMiddleware, async (req, res) => {
  try {
    const group = await db.get(
      'SELECT id, name, invite_code FROM groups WHERE id = ?',
      [req.params.groupId]
    );

    if (!group) {
      return res.status(404).json({ success: false, message: 'Group not found' });
    }

    // Check if user is a member of the group
    const membership = await db.get(
      'SELECT id FROM group_members WHERE group_id = ? AND user_id = ?',
      [req.params.groupId, req.userId]
    );

    if (!membership) {
      return res.status(403).json({ success: false, message: 'Not authorized to access this group' });
    }

    // If no invite code exists, generate one
    let inviteCode = group.invite_code;
    if (!inviteCode) {
      inviteCode = generateInviteCode();
      await db.run(
        'UPDATE groups SET invite_code = ? WHERE id = ?',
        [inviteCode, req.params.groupId]
      );
    }

    // Generate invite link (this would be your actual app deep link)
    const inviteLink = `${process.env.APP_URL || 'https://settle.app'}/join/${inviteCode}`;

    res.json({
      success: true,
      data: {
        groupId: group.id,
        groupName: group.name,
        inviteCode,
        inviteLink
      }
    });
  } catch (error) {
    console.error('Get invite link error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Join group via invite code
router.post('/join', authMiddleware, async (req, res) => {
  try {
    const { inviteCode } = req.body;

    if (!inviteCode) {
      return res.status(400).json({ success: false, message: 'Invite code required' });
    }

    // Find group by invite code
    const group = await db.get(
      'SELECT id, name FROM groups WHERE invite_code = ?',
      [inviteCode.toUpperCase()]
    );

    if (!group) {
      return res.status(404).json({ success: false, message: 'Invalid invite code' });
    }

    // Check if user is already a member
    const existing = await db.get(
      'SELECT id FROM group_members WHERE group_id = ? AND user_id = ?',
      [group.id, req.userId]
    );

    if (existing) {
      return res.status(400).json({ success: false, message: 'You are already a member of this group' });
    }

    // Add user to group
    const memberId = generateId();
    await db.run(
      'INSERT INTO group_members (id, group_id, user_id) VALUES (?, ?, ?)',
      [memberId, group.id, req.userId]
    );

    // Create activity
    await db.run(
      `INSERT INTO activities (id, type, user_id, group_id, description)
       VALUES (?, 'member_added', ?, ?, ?)`,
      [generateId(), req.userId, group.id, 'A new member joined the group']
    );

    res.json({
      success: true,
      data: {
        groupId: group.id,
        groupName: group.name
      },
      message: `Successfully joined ${group.name}`
    });
  } catch (error) {
    console.error('Join group error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Regenerate invite code for group
router.post('/:groupId/regenerate', authMiddleware, async (req, res) => {
  try {
    // Check if user is a member of the group
    const membership = await db.get(
      'SELECT id FROM group_members WHERE group_id = ? AND user_id = ?',
      [req.params.groupId, req.userId]
    );

    if (!membership) {
      return res.status(403).json({ success: false, message: 'Not authorized to modify this group' });
    }

    // Generate new invite code
    const newInviteCode = generateInviteCode();
    await db.run(
      'UPDATE groups SET invite_code = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [newInviteCode, req.params.groupId]
    );

    const inviteLink = `${process.env.APP_URL || 'https://settle.app'}/join/${newInviteCode}`;

    res.json({
      success: true,
      data: {
        inviteCode: newInviteCode,
        inviteLink
      },
      message: 'Invite code regenerated successfully'
    });
  } catch (error) {
    console.error('Regenerate invite code error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

export default router;
