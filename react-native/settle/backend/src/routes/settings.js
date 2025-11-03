import express from 'express';
import db from '../db/database.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Get email notification settings
router.get('/email', authMiddleware, async (req, res) => {
  try {
    let settings = await db.get(
      'SELECT * FROM email_settings WHERE user_id = ?',
      [req.userId]
    );

    // If no settings exist, create default settings
    if (!settings) {
      await db.run(
        `INSERT INTO email_settings (user_id, group_notifications, expense_notifications, payment_notifications)
         VALUES (?, 1, 1, 1)`,
        [req.userId]
      );

      settings = await db.get(
        'SELECT * FROM email_settings WHERE user_id = ?',
        [req.userId]
      );
    }

    // Convert integer flags to booleans for frontend
    const formattedSettings = {
      userId: settings.user_id,
      groupNotifications: !!settings.group_notifications,
      expenseNotifications: !!settings.expense_notifications,
      paymentNotifications: !!settings.payment_notifications,
      updatedAt: settings.updated_at
    };

    res.json({ success: true, data: formattedSettings });
  } catch (error) {
    console.error('Get email settings error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Update email notification settings
router.put('/email', authMiddleware, async (req, res) => {
  try {
    const {
      groupNotifications,
      expenseNotifications,
      paymentNotifications
    } = req.body;

    // Check if settings exist
    const existing = await db.get(
      'SELECT user_id FROM email_settings WHERE user_id = ?',
      [req.userId]
    );

    if (existing) {
      // Update existing settings
      await db.run(
        `UPDATE email_settings
         SET group_notifications = ?,
             expense_notifications = ?,
             payment_notifications = ?,
             updated_at = CURRENT_TIMESTAMP
         WHERE user_id = ?`,
        [
          groupNotifications !== undefined ? (groupNotifications ? 1 : 0) : null,
          expenseNotifications !== undefined ? (expenseNotifications ? 1 : 0) : null,
          paymentNotifications !== undefined ? (paymentNotifications ? 1 : 0) : null,
          req.userId
        ]
      );
    } else {
      // Insert new settings
      await db.run(
        `INSERT INTO email_settings (user_id, group_notifications, expense_notifications, payment_notifications)
         VALUES (?, ?, ?, ?)`,
        [
          req.userId,
          groupNotifications ? 1 : 0,
          expenseNotifications ? 1 : 0,
          paymentNotifications ? 1 : 0
        ]
      );
    }

    const settings = await db.get(
      'SELECT * FROM email_settings WHERE user_id = ?',
      [req.userId]
    );

    const formattedSettings = {
      userId: settings.user_id,
      groupNotifications: !!settings.group_notifications,
      expenseNotifications: !!settings.expense_notifications,
      paymentNotifications: !!settings.payment_notifications,
      updatedAt: settings.updated_at
    };

    res.json({
      success: true,
      data: formattedSettings,
      message: 'Email settings updated successfully'
    });
  } catch (error) {
    console.error('Update email settings error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

export default router;
