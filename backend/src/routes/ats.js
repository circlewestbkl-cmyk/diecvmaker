const express = require('express');
const router = express.Router();
const atsController = require('../controllers/atsController');
const { optionalAuth } = require('../middlewares/auth');

router.post('/analyze', optionalAuth, atsController.analyzeCv);
router.post('/keywords', optionalAuth, atsController.analyzeKeywords);

module.exports = router;
