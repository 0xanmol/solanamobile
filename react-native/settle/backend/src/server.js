import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import groupsRoutes from './routes/groups.js';
import expensesRoutes from './routes/expenses.js';
import friendsRoutes from './routes/friends.js';
import balancesRoutes from './routes/balances.js';
import activitiesRoutes from './routes/activities.js';
import settingsRoutes from './routes/settings.js';
import invitesRoutes from './routes/invites.js';
import searchRoutes from './routes/search.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Settle API is running',
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/groups', groupsRoutes);
app.use('/api/expenses', expensesRoutes);
app.use('/api/friends', friendsRoutes);
app.use('/api/balances', balancesRoutes);
app.use('/api/activity', activitiesRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/invites', invitesRoutes);
app.use('/api/search', searchRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀 Settle API server running on port ${PORT}`);
  console.log(`📱 For Android Emulator, use: http://10.0.2.2:${PORT}`);
  console.log(`📱 For iOS Simulator, use: http://localhost:${PORT}`);
  console.log(`🔍 Health check: http://localhost:${PORT}/health\n`);
});
