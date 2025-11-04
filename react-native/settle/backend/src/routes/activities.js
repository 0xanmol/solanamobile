import express from 'express';
import db from '../db/database.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Get activities for user (with optional groupId filter)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { groupId, limit = 50, offset = 0 } = req.query;

    let query = `
      SELECT a.*,
        u.name as user_name,
        u.pubkey as user_pubkey,
        u.avatar_uri as user_avatar,
        g.name as group_name
      FROM activities a
      INNER JOIN users u ON a.user_id = u.id
      LEFT JOIN groups g ON a.group_id = g.id
      WHERE 1=1
    `;
    const params = [];

    // Filter by group if provided
    if (groupId) {
      query += ' AND a.group_id = ?';
      params.push(groupId);
    } else {
      // If no specific group, get activities from user's groups and direct activities
      query += ` AND (
        a.group_id IN (
          SELECT group_id FROM group_members WHERE user_id = ?
        )
        OR a.group_id IS NULL
        OR a.user_id = ?
      )`;
      params.push(req.userId, req.userId);
    }

    query += ' ORDER BY a.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const activities = await db.all(query, params);

    // Enrich activities with additional details
    for (const activity of activities) {
      // Get expense details if applicable
      if (activity.expense_id) {
        const expense = await db.get(
          'SELECT description, amount FROM expenses WHERE id = ?',
          [activity.expense_id]
        );
        if (expense) {
          activity.expense_description = expense.description;
          activity.expense_amount = expense.amount;
        }
      }

      // Get settlement details if applicable
      if (activity.settlement_id) {
        const settlement = await db.get(
          `SELECT s.*,
            u1.name as from_user_name,
            u2.name as to_user_name
           FROM settlements s
           INNER JOIN users u1 ON s.from_user_id = u1.id
           INNER JOIN users u2 ON s.to_user_id = u2.id
           WHERE s.id = ?`,
          [activity.settlement_id]
        );
        if (settlement) {
          activity.settlement = settlement;
          // Add transaction signature to the activity root for easier access
          if (settlement.transaction_signature) {
            activity.transaction_signature = settlement.transaction_signature;
          }
        }
      }
    }

    res.json({ success: true, data: activities });
  } catch (error) {
    console.error('Get activities error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

export default router;
