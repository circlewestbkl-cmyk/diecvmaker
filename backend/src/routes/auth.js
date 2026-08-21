const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { requireAuth } = require('../middlewares/auth');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/me', requireAuth, authController.getMe);

// Placeholder for future implementations
router.post('/forgot-password', (req, res) => {
  res.json({ success: true, message: 'Password reset email sent (not implemented yet)' });
});

router.post('/reset-password', (req, res) => {
  res.json({ success: true, message: 'Password reset successful (not implemented yet)' });
});

module.exports = router;
