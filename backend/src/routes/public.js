const express = require('express');
const router = express.Router();
const cvService = require('../services/cvService');
const { optionalAuth } = require('../middlewares/auth');

// GET /api/public/cv/:id - View a public CV (no auth required)
router.get('/cv/:id', optionalAuth, async (req, res, next) => {
  try {
    const cv = await cvService.getCvById(req.params.id);
    if (!cv) {
      return res.status(404).json({ success: false, message: 'CV not found' });
    }
    if (!cv.isPublic && cv.userId !== req.user?.id) {
      return res.status(404).json({ success: false, message: 'CV not found or not public' });
    }
    // Strip sensitive data
    const { userId, ...publicCv } = cv;
    res.json({
      success: true,
      data: publicCv,
      message: 'Public CV retrieved successfully'
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
