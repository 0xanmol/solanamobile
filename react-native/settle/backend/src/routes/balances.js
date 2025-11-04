import express from 'express';
import db from '../db/database.js';
import { authMiddleware } from '../middleware/auth.js';
import { generateId, formatDate } from '../utils/helpers.js';

const router = express.Router();

// Calculate balances for a user
const calculateBalances = async (userId, groupId = null) => {
  const balances = {};
  const processedExpenses = new Set();

  // Get all expenses involving the user
  let expenseQuery = `
    SELECT DISTINCT e.id, e.group_id, e.description, e.amount, e.paid_by, e.date
    FROM expenses e
    INNER JOIN expense_participants ep ON e.id = ep.expense_id
    WHERE (ep.user_id = ? OR e.paid_by = ?)
  `;
  const params = [userId, userId];

  if (groupId) {
    expenseQuery += ' AND e.group_id = ?';
    params.push(groupId);
  }

  const expenses = await db.all(expenseQuery, params);

  // Calculate what user owes/is owed from expenses
  for (const expense of expenses) {
    // Skip if already processed (prevent double counting)
    if (processedExpenses.has(expense.id)) {
      continue;
    }
    processedExpenses.add(expense.id);

    if (expense.paid_by === userId) {
      // User paid - they are owed by participants
      const participants = await db.all(
        'SELECT user_id, share FROM expense_participants WHERE expense_id = ? AND user_id != ?',
        [expense.id, userId]
      );

      for (const participant of participants) {
        if (!balances[participant.user_id]) {
          balances[participant.user_id] = 0;
        }
        balances[participant.user_id] += participant.share;
      }
    } else {
      // User is a participant - they owe the payer
      const userShare = await db.get(
        'SELECT share FROM expense_participants WHERE expense_id = ? AND user_id = ?',
        [expense.id, userId]
      );

      if (userShare) {
        if (!balances[expense.paid_by]) {
          balances[expense.paid_by] = 0;
        }
        balances[expense.paid_by] -= userShare.share;
      }
    }
  }

  // Get all settlements involving the user
  let settlementQuery = `
    SELECT * FROM settlements
    WHERE (from_user_id = ? OR to_user_id = ?)
  `;
  const settlementParams = [userId, userId];

  if (groupId) {
    settlementQuery += ' AND group_id = ?';
    settlementParams.push(groupId);
  }

  const settlements = await db.all(settlementQuery, settlementParams);

  // Adjust balances based on settlements
  for (const settlement of settlements) {
    if (settlement.from_user_id === userId) {
      // User paid someone - increases their balance (reduces what you owe or what they owe you)
      if (!balances[settlement.to_user_id]) {
        balances[settlement.to_user_id] = 0;
      }
      balances[settlement.to_user_id] += settlement.amount;
    } else if (settlement.to_user_id === userId) {
      // User received payment - decreases their balance (reduces what they owe you)
      if (!balances[settlement.from_user_id]) {
        balances[settlement.from_user_id] = 0;
      }
      balances[settlement.from_user_id] -= settlement.amount;
    }
  }

  // Convert to array format with user details
  const balanceArray = [];
  for (const [otherUserId, amount] of Object.entries(balances)) {
    if (Math.abs(amount) < 0.01) continue; // Skip negligible amounts

    const user = await db.get(
      'SELECT id, name, pubkey, avatar_uri FROM users WHERE id = ?',
      [otherUserId]
    );

    if (user) {
      balanceArray.push({
        id: `balance_${userId}_${otherUserId}`,
        userId: otherUserId,
        userName: user.name,
        userPubkey: user.pubkey,
        userAvatar: user.avatar_uri,
        amount: Math.abs(amount),
        type: amount > 0 ? 'gets_back' : 'owes'
      });
    }
  }

  return balanceArray;
};

// Get balances for user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { groupId } = req.query;
    const balances = await calculateBalances(req.userId, groupId);

    res.json({ success: true, data: balances });
  } catch (error) {
    console.error('Get balances error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Create settlement/payment
router.post('/settle', authMiddleware, async (req, res) => {
  try {
    const { fromUserId, toUserId, amount, groupId, date, notes, transactionSignature } = req.body;

    if (!fromUserId || !toUserId || !amount) {
      return res.status(400).json({
        success: false,
        message: 'From user, to user, and amount are required'
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be greater than 0'
      });
    }

    const settlementId = generateId();
    const settlementDate = formatDate(date) || formatDate(new Date());

    await db.run(
      `INSERT INTO settlements (id, from_user_id, to_user_id, amount, group_id, date, notes, transaction_signature)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [settlementId, fromUserId, toUserId, amount, groupId || null, settlementDate, notes || null, transactionSignature || null]
    );

    // Create activity
    const fromUser = await db.get('SELECT name FROM users WHERE id = ?', [fromUserId]);
    const toUser = await db.get('SELECT name FROM users WHERE id = ?', [toUserId]);

    await db.run(
      `INSERT INTO activities (id, type, user_id, group_id, settlement_id, description, amount)
       VALUES (?, 'payment_made', ?, ?, ?, ?, ?)`,
      [
        generateId(),
        req.userId,
        groupId || null,
        settlementId,
        `${fromUser?.name || 'Someone'} paid ${toUser?.name || 'someone'} $${amount}`,
        amount
      ]
    );

    const settlement = await db.get('SELECT * FROM settlements WHERE id = ?', [settlementId]);
    res.status(201).json({
      success: true,
      data: settlement,
      message: 'Settlement recorded successfully'
    });
  } catch (error) {
    console.error('Create settlement error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Send payment reminder
router.post('/remind', authMiddleware, async (req, res) => {
  try {
    const { userId, amount } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID required'
      });
    }

    const user = await db.get('SELECT name, phone FROM users WHERE id = ?', [userId]);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // TODO: Implement actual reminder sending logic (push notification, SMS, email)
    // For now, just return success
    res.json({
      success: true,
      message: `Reminder sent to ${user.name}`
    });
  } catch (error) {
    console.error('Send reminder error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

export default router;
