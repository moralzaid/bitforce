const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'trident_tactical_super_secure_jwt_secret_2026';

const protect = async (req, res, next) => {
  let token = null;

  // 1. Check Bearer Authorization Header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  // 2. Check cookies
  else if (req.cookies && req.cookies.trident_token) {
    token = req.cookies.trident_token;
  }

  // 3. Optional Demo bypass header for quick instant switching
  if (req.headers['x-demo-role']) {
    const demoRole = req.headers['x-demo-role'];
    req.user = {
      _id: 'demo_user_id',
      name: `Officer (${demoRole})`,
      email: `${demoRole.toLowerCase().replace(/[^a-z]/g, '')}@trident.hec`,
      role: demoRole,
      badgeNumber: 'DEMO-77'
    };
    return next();
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied: No authentication token provided'
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token: User no longer exists'
      });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized: Token verification failed',
      error: error.message
    });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }
    // Judge/Admin always has super-user access
    if (req.user.role === 'Judge/Admin' || roles.includes(req.user.role)) {
      return next();
    }
    return res.status(403).json({
      success: false,
      message: `Role [${req.user.role}] is not authorized to access this tactical subsystem. Required: [${roles.join(', ')}]`
    });
  };
};

module.exports = {
  protect,
  authorize,
  JWT_SECRET
};
