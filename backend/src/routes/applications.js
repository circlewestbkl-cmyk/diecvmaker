const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const { requireAuth } = require('../middlewares/auth');

router.use(requireAuth);

router.get('/stats', applicationController.getApplicationStats);
router.get('/', applicationController.getApplications);
router.get('/:id', applicationController.getApplication);
router.post('/', applicationController.createApplication);
router.patch('/:id', applicationController.updateApplication);
router.delete('/:id', applicationController.deleteApplication);

module.exports = router;
