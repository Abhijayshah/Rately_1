const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verify JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database to ensure they still exist
    const user = await User.findById(decoded.userId).select('id email role');

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = {
      userId: user._id,
      email: user.email,
      role: user.role
    };
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({ error: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({ error: 'Token expired' });
    }
    console.error('Auth middleware error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Check if user has required role
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
};

// Specific role middlewares
const requireAdmin = requireRole(['system_admin']);
const requireNormalUser = requireRole(['normal_user']);
const requireStoreOwner = requireRole(['store_owner']);
const requireAdminOrStoreOwner = requireRole(['system_admin', 'store_owner']);

module.exports = {
  authenticateToken,
  requireRole,
  requireAdmin,
  requireNormalUser,
  requireStoreOwner,
  requireAdminOrStoreOwner
};