const coverLetterService = require('../services/coverLetterService');

// GET /api/cover-letters
async function getCoverLetters(req, res, next) {
  try {
    const letters = await coverLetterService.getCoverLettersByUserId(req.user.id);
    res.json({ success: true, data: letters, message: 'Cover letters retrieved' });
  } catch (err) {
    next(err);
  }
}

// POST /api/cover-letters
async function createCoverLetter(req, res, next) {
  try {
    const letter = await coverLetterService.createCoverLetter(req.user.id, req.body);
    res.status(201).json({ success: true, data: letter, message: 'Cover letter created' });
  } catch (err) {
    next(err);
  }
}

// GET /api/cover-letters/:id
async function getCoverLetter(req, res, next) {
  try {
    const letter = await coverLetterService.getCoverLetterById(req.params.id);
    if (!letter) return res.status(404).json({ success: false, message: 'Not found' });
    if (letter.userId !== req.user.id) return res.status(403).json({ success: false, message: 'Access denied' });
    res.json({ success: true, data: letter, message: 'Cover letter retrieved' });
  } catch (err) {
    next(err);
  }
}

// PUT /api/cover-letters/:id
async function updateCoverLetter(req, res, next) {
  try {
    const letter = await coverLetterService.getCoverLetterById(req.params.id);
    if (!letter) return res.status(404).json({ success: false, message: 'Not found' });
    if (letter.userId !== req.user.id) return res.status(403).json({ success: false, message: 'Access denied' });
    const updated = await coverLetterService.updateCoverLetter(req.params.id, req.body);
    res.json({ success: true, data: updated, message: 'Cover letter updated' });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/cover-letters/:id
async function deleteCoverLetter(req, res, next) {
  try {
    const letter = await coverLetterService.getCoverLetterById(req.params.id);
    if (!letter) return res.status(404).json({ success: false, message: 'Not found' });
    if (letter.userId !== req.user.id) return res.status(403).json({ success: false, message: 'Access denied' });
    await coverLetterService.deleteCoverLetter(req.params.id);
    res.json({ success: true, data: null, message: 'Cover letter deleted' });
  } catch (err) {
    next(err);
  }
}

module.exports = { getCoverLetters, createCoverLetter, getCoverLetter, updateCoverLetter, deleteCoverLetter };
