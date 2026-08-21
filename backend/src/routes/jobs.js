const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const { requireAuth } = require('../middlewares/auth');

// Public routes
router.get('/', jobController.getJobs);
router.get('/:id', jobController.getJob);

// Protected routes (admin or poster only)
router.use(requireAuth);
router.post('/', jobController.createJob);
router.put('/:id', jobController.updateJob);
router.delete('/:id', jobController.deleteJob);

module.exports = router;
