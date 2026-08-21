const express = require('express');
const router = express.Router();
const adminUserController = require('../controllers/adminUserController');
const { requireAuth, requireAdmin } = require('../middlewares/auth');

// All admin routes require authentication + admin role
router.use(requireAuth);
router.use(requireAdmin);

router.get('/users/stats', adminUserController.getUserStats);
router.get('/users', adminUserController.getUsers);
router.get('/users/:id', adminUserController.getUser);
router.post('/users', adminUserController.createUser);
router.put('/users/:id', adminUserController.updateUser);
router.delete('/users/:id', adminUserController.deleteUser);
router.patch('/users/:id/toggle-role', adminUserController.toggleRole);
router.patch('/users/:id/reset-password', adminUserController.resetPassword);

module.exports = router;
