import express from 'express';
import db from '../db/database.js';
import { authMiddleware } from '../middleware/auth.js';
import { generateId, formatDate } from '../utils/helpers.js';

const router = express.Router();

// Get all expenses for user (with optional groupId filter)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { groupId } = req.query;
    let query = `
      SELECT e.*,
        u.name as paid_by_name,
        u.pubkey as paid_by_pubkey
      FROM expenses e
      INNER JOIN users u ON e.paid_by = u.id
      LEFT JOIN expense_participants ep ON e.id = ep.expense_id
      WHERE (e.paid_by = ? OR ep.user_id = ?)
    `;
    const params = [req.userId, req.userId];

    if (groupId) {
      query += ' AND e.group_id = ?';
      params.push(groupId);
    }

    query += ' GROUP BY e.id ORDER BY e.date DESC, e.created_at DESC';

    const expenses = await db.all(query, params);

    // Get participants for each expense
    for (const expense of expenses) {
      const participants = await db.all(
        `SELECT ep.*, u.name, u.pubkey
         FROM expense_participants ep
         INNER JOIN users u ON ep.user_id = u.id
         WHERE ep.expense_id = ?`,
        [expense.id]
      );
      expense.participants = participants;
    }
    res.json({ success: true, data: expenses });
  } catch (error) {
    console.error('Get expenses error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Get single expense
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const expense = await db.get(
      `SELECT e.*,
        u.name as paid_by_name,
        u.pubkey as paid_by_pubkey
       FROM expenses e
       INNER JOIN users u ON e.paid_by = u.id
       WHERE e.id = ?`,
      [req.params.id]
    );

    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }

    // Get participants
    const participants = await db.all(
      `SELECT ep.*, u.name, u.pubkey
       FROM expense_participants ep
       INNER JOIN users u ON ep.user_id = u.id
       WHERE ep.expense_id = ?`,
      [req.params.id]
    );
    expense.participants = participants;

    res.json({ success: true, data: expense });
  } catch (error) {
    console.error('Get expense error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Create expense
router.post('/', authMiddleware, async (req, res) => {
  try {
    const {
      description,
      amount,
      paidBy,
      splitType = 'equally',
      date,
      notes,
      category,
      groupId,
      participants = []
    } = req.body;

    const expenseId = generateId();
    const expenseDate = formatDate(date) || formatDate(new Date());

    // Insert expense
    await db.run(
      `INSERT INTO expenses (id, group_id, description, amount, paid_by, split_type, date, notes, category)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [expenseId, groupId || null, description, amount, paidBy || req.userId, splitType, expenseDate, notes, category]
    );

    // Calculate and insert participants
    if (participants.length > 0) {
      for (const participant of participants) {
        const participantId = generateId();
        const share = participant.share || (amount / participants.length);

        await db.run(
          `INSERT INTO expense_participants (id, expense_id, user_id, share, paid_share)
           VALUES (?, ?, ?, ?, ?)`,
          [participantId, expenseId, participant.userId, share, participant.paidShare || 0]
        );
      }
    } else {
      // If no participants specified, split equally with the payer
      const participantId = generateId();
      await db.run(
        `INSERT INTO expense_participants (id, expense_id, user_id, share, paid_share)
         VALUES (?, ?, ?, ?, ?)`,
        [participantId, expenseId, paidBy || req.userId, amount, 0]
      );
    }

    // Create activity
    await db.run(
      `INSERT INTO activities (id, type, user_id, group_id, expense_id, description, amount)
       VALUES (?, 'expense_added', ?, ?, ?, ?, ?)`,
      [generateId(), req.userId, groupId || null, expenseId, `Added expense: ${description}`, amount]
    );

    const expense = await db.get('SELECT * FROM expenses WHERE id = ?', [expenseId]);
    res.status(201).json({ success: true, data: expense, message: 'Expense created successfully' });
  } catch (error) {
    console.error('Create expense error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Update expense
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { description, amount, paidBy, splitType, date, notes, category } = req.body;

    const expense = await db.get('SELECT * FROM expenses WHERE id = ?', [req.params.id]);
    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }

    await db.run(
      `UPDATE expenses
       SET description = ?, amount = ?, paid_by = ?, split_type = ?, date = ?, notes = ?, category = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [
        description || expense.description,
        amount || expense.amount,
        paidBy || expense.paid_by,
        splitType || expense.split_type,
        formatDate(date) || expense.date,
        notes !== undefined ? notes : expense.notes,
        category !== undefined ? category : expense.category,
        req.params.id
      ]
    );

    // Create activity
    await db.run(
      `INSERT INTO activities (id, type, user_id, group_id, expense_id, description, amount)
       VALUES (?, 'expense_edited', ?, ?, ?, ?, ?)`,
      [generateId(), req.userId, expense.group_id, req.params.id, `Edited expense: ${description || expense.description}`, amount || expense.amount]
    );

    const updatedExpense = await db.get('SELECT * FROM expenses WHERE id = ?', [req.params.id]);
    res.json({ success: true, data: updatedExpense, message: 'Expense updated successfully' });
  } catch (error) {
    console.error('Update expense error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Delete expense
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const expense = await db.get('SELECT * FROM expenses WHERE id = ?', [req.params.id]);
    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }

    // Create activity before deletion
    await db.run(
      `INSERT INTO activities (id, type, user_id, group_id, description, amount)
       VALUES (?, 'expense_deleted', ?, ?, ?, ?)`,
      [generateId(), req.userId, expense.group_id, `Deleted expense: ${expense.description}`, expense.amount]
    );

    await db.run('DELETE FROM expenses WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Delete expense error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Adjust split for expense
router.put('/:id/split', authMiddleware, async (req, res) => {
  try {
    const { splitType, participants } = req.body;

    const expense = await db.get('SELECT * FROM expenses WHERE id = ?', [req.params.id]);
    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }

    // Update split type
    if (splitType) {
      await db.run(
        'UPDATE expenses SET split_type = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [splitType, req.params.id]
      );
    }

    // Update participant shares
    if (participants && participants.length > 0) {
      // Delete existing participants
      await db.run('DELETE FROM expense_participants WHERE expense_id = ?', [req.params.id]);

      // Insert new participants with adjusted shares
      for (const participant of participants) {
        const participantId = generateId();
        await db.run(
          `INSERT INTO expense_participants (id, expense_id, user_id, share, paid_share)
           VALUES (?, ?, ?, ?, ?)`,
          [participantId, req.params.id, participant.userId, participant.share, participant.paidShare || 0]
        );
      }
    }

    res.json({ success: true, message: 'Split adjusted successfully' });
  } catch (error) {
    console.error('Adjust split error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

export default router;
