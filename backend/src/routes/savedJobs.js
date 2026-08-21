const express = require('express');
const router = express.Router();
const savedJobController = require('../controllers/savedJobController');
const { requireAuth } = require('../middlewares/auth');

router.use(requireAuth);

router.get('/', savedJobController.getSavedJobs);
router.get('/check/:jobId', savedJobController.checkSaved);
router.post('/', savedJobController.saveJob);
router.delete('/:jobId', savedJobController.unsaveJob);

module.exports = router;
