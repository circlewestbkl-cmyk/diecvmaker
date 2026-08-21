const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { requireAuth } = require('../middlewares/auth');
const rateLimit = require('express-rate-limit');

// Strict rate limit for AI endpoints
const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  message: { success: false, message: 'Too many AI requests, please try again later' }
});

router.use(requireAuth);
router.use(aiLimiter);

router.post('/summary', aiController.generateSummary);
router.post('/improve-description', aiController.improveDescription);
router.post('/achievement', aiController.generateAchievement);
router.post('/skills', aiController.suggestSkills);
router.post('/optimize-cv', aiController.optimizeCV);
router.post('/cover-letter', aiController.generateCoverLetter);
router.post('/interview-questions', aiController.generateInterviewQuestions);
router.post('/evaluate-answer', aiController.evaluateAnswer);

module.exports = router;
