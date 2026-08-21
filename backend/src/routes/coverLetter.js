const express = require('express');
const router = express.Router();
const coverLetterController = require('../controllers/coverLetterController');
const { requireAuth } = require('../middlewares/auth');

router.use(requireAuth);

router.get('/', coverLetterController.getCoverLetters);
router.post('/', coverLetterController.createCoverLetter);
router.get('/:id', coverLetterController.getCoverLetter);
router.put('/:id', coverLetterController.updateCoverLetter);
router.delete('/:id', coverLetterController.deleteCoverLetter);

module.exports = router;
