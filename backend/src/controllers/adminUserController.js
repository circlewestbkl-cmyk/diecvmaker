const adminUserService = require('../services/adminUserService');

// GET /api/admin/users
async function getUsers(req, res, next) {
  try {
    const users = await adminUserService.getAllUsers(req.query);
    res.json({
      success: true,
      data: users,
      message: 'Users retrieved successfully'
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/admin/users/stats
async function getUserStats(req, res, next) {
  try {
    const stats = await adminUserService.getUserStats();
    res.json({
      success: true,
      data: stats,
      message: 'Stats retrieved successfully'
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/admin/users/:id
async function getUser(req, res, next) {
  try {
    const user = await adminUserService.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
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

// POST /api/admin/users
async function createUser(req, res, next) {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
    }
    const user = await adminUserService.createUser({ name, email, password, role });
    res.status(201).json({
      success: true,
      data: user,
      message: 'User created successfully'
    });
  } catch (err) {
    if (err.message === 'Email already registered') {
      return res.status(409).json({ success: false, message: err.message });
    }
    next(err);
  }
}

// PUT /api/admin/users/:id
async function updateUser(req, res, next) {
  try {
    const user = await adminUserService.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Don't allow admin to change their own role
    if (req.params.id === req.user.id && req.body.role && req.body.role !== 'admin') {
      return res.status(400).json({ success: false, message: 'Cannot change your own admin role' });
    }

    const updated = await adminUserService.updateUser(req.params.id, req.body);
    res.json({
      success: true,
      data: updated,
      message: 'User updated successfully'
    });
  } catch (err) {
    if (err.message === 'Email already in use') {
      return res.status(409).json({ success: false, message: err.message });
    }
    next(err);
  }
}

// DELETE /api/admin/users/:id
async function deleteUser(req, res, next) {
  try {
    const user = await adminUserService.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Don't allow admin to delete themselves
    if (req.params.id === req.user.id) {
      return res.status(400).json({ success: false, message: 'Cannot delete your own account' });
    }

    await adminUserService.deleteUser(req.params.id);
    res.json({
      success: true,
      data: null,
      message: 'User deleted successfully'
    });
  } catch (err) {
    next(err);
  }
}

// PATCH /api/admin/users/:id/toggle-role
async function toggleRole(req, res, next) {
  try {
    // Don't allow admin to change their own role
    if (req.params.id === req.user.id) {
      return res.status(400).json({ success: false, message: 'Cannot change your own role' });
    }

    const updated = await adminUserService.toggleRole(req.params.id);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({
      success: true,
      data: updated,
      message: `Role changed to ${updated.role}`
    });
  } catch (err) {
    next(err);
  }
}

// PATCH /api/admin/users/:id/reset-password
async function resetPassword(req, res, next) {
  try {
    const result = await adminUserService.resetPassword(req.params.id);
    if (!result) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({
      success: true,
      data: { email: result.email, newPassword: result.newPassword },
      message: 'Password reset to default: password123'
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getUsers,
  getUserStats,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  toggleRole,
  resetPassword
};
