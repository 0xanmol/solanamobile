import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

export const generateId = () => uuidv4();

export const generateInviteCode = () => {
  return crypto.randomBytes(4).toString('hex').toUpperCase();
};

export const formatDate = (date) => {
  if (!date) return null;
  return new Date(date).toISOString().split('T')[0];
};

export const calculateBalance = (expenses, settlements, userId) => {
  let balance = 0;

  // Calculate from expenses
  expenses.forEach(expense => {
    if (expense.paid_by === userId) {
      // User paid, they are owed
      balance += expense.amount;
    }
    // Subtract what user owes
    const participant = expense.participants?.find(p => p.user_id === userId);
    if (participant) {
      balance -= participant.share;
    }
  });

  // Calculate from settlements
  settlements.forEach(settlement => {
    if (settlement.from_user_id === userId) {
      // User paid someone
      balance -= settlement.amount;
    }
    if (settlement.to_user_id === userId) {
      // User received payment
      balance += settlement.amount;
    }
  });

  return balance;
};
