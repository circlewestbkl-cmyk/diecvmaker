const authService = require('../services/authService');

// POST /api/auth/register
async function register(req, res, next) {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required'
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    const result = await authService.register({ name, email, password });

    res.cookie('token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(201).json({
      success: true,
      data: result,
      message: 'Registration successful'
    });
  } catch (err) {
    if (err.message === 'Email already registered') {
      return res.status(409).json({
        success: false,
        message: err.message
      });
    }
    next(err);
  }
}

// POST /api/auth/login
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    const result = await authService.login({ email, password });

    res.cookie('token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      success: true,
      data: result,
      message: 'Login successful'
    });
  } catch (err) {
    if (err.message === 'Invalid email or password') {
      return res.status(401).json({
        success: false,
        message: err.message
      });
    }
    next(err);
  }
}

// POST /api/auth/logout
function logout(req, res) {
  res.clearCookie('token');
  res.json({
    success: true,
    data: null,
    message: 'Logout successful'
  });
}

// GET /api/auth/me
async function getMe(req, res, next) {
  try {
    const user = await authService.getUserById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    res.json({
      success: true,
      data: user,
      message: 'User retrieved successfully'
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, logout, getMe };
