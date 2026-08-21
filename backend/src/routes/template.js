const express = require('express');
const router = express.Router();
const jsonStorage = require('../services/jsonStorageService');
const { optionalAuth } = require('../middlewares/auth');

const TEMPLATES_FILE = 'templates.json';

// GET /api/templates
router.get('/', optionalAuth, async (req, res, next) => {
  try {
    const templates = await jsonStorage.readData(TEMPLATES_FILE);
    res.json({ success: true, data: templates, message: 'Templates retrieved' });
  } catch (err) {
    next(err);
  }
});

// GET /api/templates/:id
router.get('/:id', optionalAuth, async (req, res, next) => {
  try {
    const template = await jsonStorage.findById(TEMPLATES_FILE, req.params.id);
    if (!template) {
      return res.status(404).json({ success: false, message: 'Template not found' });
    }
    res.json({ success: true, data: template, message: 'Template retrieved' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
