const jsonStorage = require('./jsonStorageService');
const bcrypt = require('bcryptjs');

const USERS_FILE = 'users.json';
const SALT_ROUNDS = 10;

// Get all users (without passwords)
async function getAllUsers(filters = {}) {
  let users = await jsonStorage.findMany(USERS_FILE);

  // Strip passwords
  users = users.map(({ password, ...rest }) => rest);

  // Search by name or email
  if (filters.search) {
    const q = filters.search.toLowerCase();
    users = users.filter(u =>
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q)
    );
  }

  // Filter by role
  if (filters.role) {
    users = users.filter(u => u.role === filters.role);
  }

  // Sort
  if (filters.sort === 'oldest') {
    users.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  } else {
    // Default: newest first
    users.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  return users;
}

// Get user by ID (without password)
async function getUserById(id) {
  const user = await jsonStorage.findById(USERS_FILE, id);
  if (!user) return null;
  const { password, ...rest } = user;
  return rest;
}

// Create user (admin can set role)
async function createUser(data) {
  // Check if email already exists
  const existing = await jsonStorage.findOne(USERS_FILE, u => u.email === data.email.toLowerCase());
  if (existing) {
    throw new Error('Email already registered');
  }

  const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);
  const user = await jsonStorage.create(USERS_FILE, {
    name: data.name,
    email: data.email.toLowerCase(),
    password: hashedPassword,
    role: data.role || 'user'
  }, 'user');

  const { password, ...rest } = user;
  return rest;
}

// Update user (admin can change name, email, role)
async function updateUser(id, data) {
  const existing = await jsonStorage.findById(USERS_FILE, id);
  if (!existing) return null;

  // If changing email, check for duplicates
  if (data.email && data.email.toLowerCase() !== existing.email) {
    const duplicate = await jsonStorage.findOne(USERS_FILE, u => u.email === data.email.toLowerCase() && u.id !== id);
    if (duplicate) {
      throw new Error('Email already in use');
    }
  }

  const updateData = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.email !== undefined) updateData.email = data.email.toLowerCase();
  if (data.role !== undefined) updateData.role = data.role;

  // Only update password if provided
  if (data.password) {
    updateData.password = await bcrypt.hash(data.password, SALT_ROUNDS);
  }

  const updated = await jsonStorage.update(USERS_FILE, id, updateData);
  if (!updated) return null;

  const { password, ...rest } = updated;
  return rest;
}

// Delete user
async function deleteUser(id) {
  return await jsonStorage.remove(USERS_FILE, id);
}

// Get user stats
async function getUserStats() {
  const users = await jsonStorage.findMany(USERS_FILE);
  const total = users.length;
  const admins = users.filter(u => u.role === 'admin').length;
  const regular = users.filter(u => u.role === 'user').length;

  // Count users created this month
  const now = new Date();
  const thisMonth = users.filter(u => {
    const created = new Date(u.createdAt);
    return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
  }).length;

  return { total, admins, regular, thisMonth };
}

// Toggle user role between admin and user
async function toggleRole(id) {
  const user = await jsonStorage.findById(USERS_FILE, id);
  if (!user) return null;

  const newRole = user.role === 'admin' ? 'user' : 'admin';
  const updated = await jsonStorage.update(USERS_FILE, id, { role: newRole });
  if (!updated) return null;

  const { password, ...rest } = updated;
  return rest;
}

// Reset user password
async function resetPassword(id) {
  const user = await jsonStorage.findById(USERS_FILE, id);
  if (!user) return null;

  const defaultPassword = 'password123';
  const hashedPassword = await bcrypt.hash(defaultPassword, SALT_ROUNDS);
  const updated = await jsonStorage.update(USERS_FILE, id, { password: hashedPassword });
  if (!updated) return null;

  return { id, email: user.email, newPassword: defaultPassword };
}

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserStats,
  toggleRole,
  resetPassword
};
