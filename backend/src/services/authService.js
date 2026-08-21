const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jsonStorage = require('./jsonStorageService');

const USERS_FILE = 'users.json';
const SALT_ROUNDS = 10;

async function register({ name, email, password }) {
  const existing = await jsonStorage.findOne(USERS_FILE, u => u.email === email.toLowerCase());
  if (existing) {
    throw new Error('Email already registered');
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await jsonStorage.create(USERS_FILE, {
    name,
    email: email.toLowerCase(),
    password: hashedPassword,
    role: 'user'
  }, 'user');

  const token = generateToken(user);
  const { password: _, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, token };
}

async function login({ email, password }) {
  const user = await jsonStorage.findOne(USERS_FILE, u => u.email === email.toLowerCase());
  if (!user) {
    throw new Error('Invalid email or password');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid email or password');
  }

  const token = generateToken(user);
  const { password: _, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, token };
}

async function getUserById(id) {
  const user = await jsonStorage.findById(USERS_FILE, id);
  if (!user) return null;
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

// Auto-generate JWT_SECRET for Vercel if not set
const JWT_SECRET = process.env.JWT_SECRET || 'cvforge-dev-secret-' + require('crypto').randomBytes(16).toString('hex');

function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

module.exports = { register, login, getUserById, generateToken, verifyToken };
