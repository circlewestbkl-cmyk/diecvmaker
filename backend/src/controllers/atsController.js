const atsService = require('../services/atsService');
const cvService = require('../services/cvService');
const jobService = require('../services/jsonStorageService');

// POST /api/ats/analyze
async function analyzeCv(req, res, next) {
  try {
    let cvText = '';

    // Option 1: Use existing CV
    if (req.body.cvId) {
      const cv = await cvService.getCvById(req.body.cvId);
      if (!cv) {
        return res.status(404).json({ success: false, message: 'CV not found' });
      }
      // Convert CV object to text
      const p = cv.personal || {};
      cvText = [
        p.fullName, p.professionalTitle, p.email, p.phone, p.location,
        cv.summary,
        ...(cv.experiences || []).map(e => `${e.position} ${e.company} ${e.description} ${(e.achievements || []).join(' ')}`),
        ...(cv.education || []).map(e => `${e.degree} ${e.fieldOfStudy} ${e.institution} ${e.description}`),
        ...(cv.skills || []).map(s => s.name),
        ...(cv.projects || []).map(p => `${p.name} ${p.description} ${(p.technologies || []).join(' ')}`),
        ...(cv.certifications || []).map(c => `${c.name} ${c.issuer}`),
      ].filter(Boolean).join(' ');
    }
    // Option 2: CV text provided
    else if (req.body.cvText) {
      cvText = req.body.cvText;
    }
    else {
      return res.status(400).json({ success: false, message: 'Provide cvId or cvText' });
    }

    const result = await atsService.analyzeCvText(cvText);

    // Save scan result if user is logged in
    if (req.user) {
      try {
        const jsonStorage = require('./jsonStorageService');
        await jsonStorage.create('ats-scans.json', {
          userId: req.user.id,
          cvId: req.body.cvId || null,
          score: result.score,
          details: result.details,
          recommendations: result.recommendations,
          matchedKeywords: result.matchedKeywords,
          missingKeywords: result.missingKeywords
        }, 'scan');
      } catch (e) {
        // Non-critical, don't fail the request
      }
    }

    res.json({
      success: true,
      data: result,
      message: 'ATS analysis completed'
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/ats/keywords
async function analyzeKeywords(req, res, next) {
  try {
    const { cvText, jobDescription } = req.body;

    if (!cvText || !jobDescription) {
      return res.status(400).json({ success: false, message: 'Both cvText and jobDescription are required' });
    }

    const result = atsService.matchKeywordsWithJobDescription(cvText, jobDescription);

    res.json({
      success: true,
      data: result,
      message: 'Keyword analysis completed'
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { analyzeCv, analyzeKeywords };
