// User types
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUri?: string;
}

// Group types
export interface Group {
  id: string;
  name: string;
  type: 'trip' | 'home' | 'couple' | 'other';
  members: User[];
  balance: number;
  settled: boolean;
  tripDates?: {
    startDate: Date;
    endDate: Date;
  };
}

// Expense types
export interface Expense {
  id: string;
  groupId: string;
  description: string;
  amount: number;
  paidBy: string;
  splitType: 'equally' | 'unequally' | 'percentage' | 'shares' | 'adjustment';
  participants: ExpenseParticipant[];
  date: Date;
  notes?: string;
  category?: string;
}

export interface ExpenseParticipant {
  userId: string;
  share: number;
}

// Friend types
export interface Friend extends User {
  balance: number;
  settled: boolean;
}

// Contact types
export interface Contact {
  id: string;
  name: string;
  phone: string;
  avatarUri?: string;
  alreadyFriend?: boolean;
}

// Activity types
export interface Activity {
  id: string;
  type: 'expense_added' | 'expense_edited' | 'payment_made' | 'group_joined';
  date: Date;
  description: string;
  amount?: number;
  groupName?: string;
  userName?: string;
}

// Email settings types
export interface EmailSettings {
  addedToGroup: boolean;
  addedAsFriend: boolean;
  expenseAdded: boolean;
  expenseEdited: boolean;
  expenseCommented: boolean;
  expenseDue: boolean;
  someonePaysMe: boolean;
  monthlySummary: boolean;
  majorNews: boolean;
}

// Balance types
export interface Balance {
  userId: string;
  userName: string;
  amount: number;
  type: 'owe' | 'owed';
  details: BalanceDetail[];
}

export interface BalanceDetail {
  description: string;
  amount: number;
  date: Date;
}

// Split types
export type SplitMethod = 'equally' | 'unequally' | 'percentage' | 'shares' | 'adjustment';

export interface SplitPerson {
  id: string;
  name: string;
  amount: number;
  percentage?: number;
  shares?: number;
}

// Navigation types
export type RootStackParamList = {
  login: undefined;
  signup: undefined;
  signin: undefined;
  '(tabs)': undefined;
  'create-group': undefined;
  'add-expense': undefined;
  'adjust-split': undefined;
  'add-friends': undefined;
  'group-detail/[id]': { id: string };
  'group-settings': { groupId: string };
  'invite-link': { groupId: string };
  'balances': { groupId: string };
  'account-settings': undefined;
  'security': undefined;
  'email-settings': undefined;
};

