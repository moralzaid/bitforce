const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middleware/auth');

const signToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: '7d'
  });
};

const sendTokenResponse = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  };

  res.cookie('trident_token', token, cookieOptions);

  return res.status(statusCode).json({
    success: true,
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      badgeNumber: user.badgeNumber,
      department: user.department
    }
  });
};

// @desc Register tactical officer
// @route POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password, role, badgeNumber, department } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Tactical officer email already registered' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'Field Engineer',
      badgeNumber: badgeNumber || `TRI-${Math.floor(100 + Math.random() * 900)}`,
      department: department || 'Field Operations'
    });

    sendTokenResponse(user, 201, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Login tactical officer
// @route POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide officer email and access key' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid officer credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid officer credentials' });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Instant Demo Login Switcher (Judge / Vet / Engineer / Agro)
// @route POST /api/auth/demo-login
const demoLogin = async (req, res) => {
  try {
    const { role = 'Judge/Admin' } = req.body;

    let user = await User.findOne({ role });
    if (!user) {
      // Find or create default demo user for this role
      const roleEmails = {
        'Judge/Admin': 'judge@trident.hec',
        'Veterinary Officer': 'vet@trident.hec',
        'Field Engineer': 'engineer@trident.hec',
        'Agricultural Officer': 'agro@trident.hec'
      };
      const email = roleEmails[role] || 'officer@trident.hec';
      user = await User.findOne({ email });

      if (!user) {
        user = await User.create({
          name: `Officer (${role})`,
          email,
          password: 'Password123!',
          role,
          badgeNumber: `DEMO-${role.slice(0, 3).toUpperCase()}`,
          department: 'HEC Operations'
        });
      }
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get currently authenticated user
// @route GET /api/auth/me
const getMe = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      user: req.user
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Logout user
// @route POST /api/auth/logout
const logout = async (req, res) => {
  res.cookie('trident_token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  res.status(200).json({ success: true, message: 'Logged out successfully' });
};

module.exports = {
  register,
  login,
  demoLogin,
  getMe,
  logout
};
