-- Users table (wallet-based auth)
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  pubkey TEXT UNIQUE NOT NULL,
  name TEXT,
  phone TEXT,
  avatar_uri TEXT,
  timezone TEXT DEFAULT 'UTC',
  language TEXT DEFAULT 'en',
  is_profile_complete INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Groups table
CREATE TABLE IF NOT EXISTS groups (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT CHECK(type IN ('trip', 'home', 'couple', 'other')) NOT NULL,
  image_uri TEXT,
  simplify_debts INTEGER DEFAULT 1,
  default_split TEXT DEFAULT 'equally',
  trip_start_date DATE,
  trip_end_date DATE,
  invite_code TEXT UNIQUE,
  created_by TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

-- Group members table
CREATE TABLE IF NOT EXISTS group_members (
  id TEXT PRIMARY KEY,
  group_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(group_id, user_id)
);

-- Friends table
CREATE TABLE IF NOT EXISTS friends (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  friend_id TEXT NOT NULL,
  status TEXT CHECK(status IN ('pending', 'accepted', 'rejected')) DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (friend_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(user_id, friend_id)
);

-- Expenses table
CREATE TABLE IF NOT EXISTS expenses (
  id TEXT PRIMARY KEY,
  group_id TEXT,
  description TEXT NOT NULL,
  amount REAL NOT NULL,
  paid_by TEXT NOT NULL,
  split_type TEXT CHECK(split_type IN ('equally', 'unequally', 'percentage', 'shares', 'adjustment')) DEFAULT 'equally',
  date DATE NOT NULL,
  notes TEXT,
  category TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE,
  FOREIGN KEY (paid_by) REFERENCES users(id) ON DELETE CASCADE
);

-- Expense participants (who owes what)
CREATE TABLE IF NOT EXISTS expense_participants (
  id TEXT PRIMARY KEY,
  expense_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  share REAL NOT NULL,
  paid_share REAL DEFAULT 0,
  FOREIGN KEY (expense_id) REFERENCES expenses(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Settlements/Payments
CREATE TABLE IF NOT EXISTS settlements (
  id TEXT PRIMARY KEY,
  from_user_id TEXT NOT NULL,
  to_user_id TEXT NOT NULL,
  amount REAL NOT NULL,
  group_id TEXT,
  date DATE NOT NULL,
  notes TEXT,
  transaction_signature TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (from_user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (to_user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE SET NULL
);

-- Activity feed
CREATE TABLE IF NOT EXISTS activities (
  id TEXT PRIMARY KEY,
  type TEXT CHECK(type IN ('expense_added', 'expense_edited', 'expense_deleted', 'payment_made', 'group_created', 'member_added', 'member_left')) NOT NULL,
  user_id TEXT NOT NULL,
  group_id TEXT,
  expense_id TEXT,
  settlement_id TEXT,
  description TEXT NOT NULL,
  amount REAL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE,
  FOREIGN KEY (expense_id) REFERENCES expenses(id) ON DELETE CASCADE,
  FOREIGN KEY (settlement_id) REFERENCES settlements(id) ON DELETE CASCADE
);

-- Email settings
CREATE TABLE IF NOT EXISTS email_settings (
  user_id TEXT PRIMARY KEY,
  group_notifications INTEGER DEFAULT 1,
  expense_notifications INTEGER DEFAULT 1,
  payment_notifications INTEGER DEFAULT 1,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_pubkey ON users(pubkey);
CREATE INDEX IF NOT EXISTS idx_group_members_user ON group_members(user_id);
CREATE INDEX IF NOT EXISTS idx_group_members_group ON group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_expenses_group ON expenses(group_id);
CREATE INDEX IF NOT EXISTS idx_expenses_paid_by ON expenses(paid_by);
CREATE INDEX IF NOT EXISTS idx_expense_participants_expense ON expense_participants(expense_id);
CREATE INDEX IF NOT EXISTS idx_expense_participants_user ON expense_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_settlements_from ON settlements(from_user_id);
CREATE INDEX IF NOT EXISTS idx_settlements_to ON settlements(to_user_id);
CREATE INDEX IF NOT EXISTS idx_activities_user ON activities(user_id);
CREATE INDEX IF NOT EXISTS idx_activities_group ON activities(group_id);
CREATE INDEX IF NOT EXISTS idx_friends_user ON friends(user_id);
CREATE INDEX IF NOT EXISTS idx_friends_friend ON friends(friend_id);
