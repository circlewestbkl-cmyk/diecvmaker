const express = require('express');
const router = express.Router();
const { analyzeAtsReadiness } = require('../services/pdfService');

// POST /api/ats-analysis/analyze
// Analyzes a CV object in real-time and returns ATS score + tips
router.post('/analyze', (req, res, next) => {
  try {
    const { cv } = req.body;
    if (!cv) {
      return res.status(400).json({ success: false, message: 'CV data is required' });
    }

    const result = analyzeAtsReadiness(cv);
    res.json({
      success: true,
      data: result,
      message: 'ATS analysis completed'
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
