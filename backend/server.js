const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const connectDB = require('./config/database');
const initializeDatabase = require('./config/initDb');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const storeRoutes = require('./routes/stores');
const chatRoutes = require('./routes/chat');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Trust proxy for rate limiting
app.set('trust proxy', 1);

// CORS configuration - Place before other middleware
const rawOrigins = process.env.CORS_ORIGINS || process.env.CLIENT_URL || 'http://localhost:3000';
const allowList = rawOrigins.split(',').map(s => s.trim()).filter(Boolean);
const isAllowedOrigin = (origin) => {
  if (!origin) return true;
  if (allowList.includes(origin)) return true;
  try {
    const url = new URL(origin);
    const host = url.hostname;
    if (host.endsWith('vercel.app') || host.endsWith('onrender.com')) return true;
  } catch (e) {}
  return false;
};
app.use(cors({
  origin: (origin, callback) => {
    if (isAllowedOrigin(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Rately API',
    status: 'Running',
    documentation: '/api-docs (if available)',
    health: '/health'
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/chat', chatRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global error handler:', error);

  // Don't leak error details in production
  const isDevelopment = process.env.NODE_ENV === 'development';

  res.status(error.status || 500).json({
    error: error.message || 'Internal server error',
    ...(isDevelopment && { stack: error.stack })
  });
});

// Initialize database and start server
async function startServer() {
  try {
    console.log('Initializing database...');
    await initializeDatabase();

    app.listen(PORT, () => {
      console.log(`\n🚀 Server running on port ${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🌐 API Base URL: http://localhost:${PORT}`);
      console.log(`🔗 Health Check: http://localhost:${PORT}/health`);
      console.log('\n📋 Available Endpoints:');
      console.log('  Authentication:');
      console.log('    POST /api/auth/register - User registration');
      console.log('    POST /api/auth/login - User login');
      console.log('    GET  /api/auth/profile - Get user profile');
      console.log('    PUT  /api/auth/password - Update password');
      console.log('    POST /api/auth/logout - User logout');
      console.log('\n  Admin (System Administrator):');
      console.log('    GET  /api/admin/dashboard/stats - Dashboard statistics');
      console.log('    POST /api/admin/users - Create new user');
      console.log('    GET  /api/admin/users - Get all users');
      console.log('    GET  /api/admin/users/:id - Get user details');
      console.log('    POST /api/admin/stores - Create new store');
      console.log('    GET  /api/admin/stores - Get all stores');
      console.log('\n  Stores (Normal Users):');
      console.log('    GET  /api/stores - Get all stores');
      console.log('    GET  /api/stores/:id - Get store details');
      console.log('    POST /api/stores/ratings - Submit/update rating');
      console.log('    GET  /api/stores/user/ratings - Get user ratings');
      console.log('\n  Store Owner:');
      console.log('    GET  /api/stores/owner/dashboard - Store owner dashboard');
      console.log('\n🔐 Default Admin Credentials:');
      console.log('    Email: admin@rately.com');
      console.log('    Password: Admin@123');
      console.log('\n📝 Note: Make sure MongoDB is running and configured properly.');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

startServer();
