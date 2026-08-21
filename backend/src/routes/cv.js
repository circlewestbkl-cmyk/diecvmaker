const express = require('express');
const router = express.Router();
const cvController = require('../controllers/cvController');
const { requireAuth } = require('../middlewares/auth');

router.use(requireAuth);

router.get('/', cvController.getCvs);
router.post('/', cvController.createCv);
router.get('/:id', cvController.getCv);
router.put('/:id', cvController.updateCv);
router.delete('/:id', cvController.deleteCv);
router.post('/:id/duplicate', cvController.duplicateCv);
router.put('/:id/public', cvController.togglePublic);
router.get('/:id/pdf', cvController.downloadPdf);

module.exports = router;
