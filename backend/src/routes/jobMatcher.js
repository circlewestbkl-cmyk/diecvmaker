const express = require('express');
const router = express.Router();
const jobMatcherController = require('../controllers/jobMatcherController');
const { requireAuth } = require('../middlewares/auth');

router.post('/analyze', requireAuth, jobMatcherController.analyzeMatch);

module.exports = router;
