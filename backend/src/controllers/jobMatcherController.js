const jobMatcherService = require('../services/jobMatcherService');

// POST /api/job-matcher/analyze
async function analyzeMatch(req, res, next) {
  try {
    const { cvId, jobDescription } = req.body;

    if (!cvId || !jobDescription) {
      return res.status(400).json({ success: false, message: 'cvId and jobDescription are required' });
    }

    const result = await jobMatcherService.analyzeJobMatch(cvId, jobDescription);

    res.json({
      success: true,
      data: result,
      message: 'Job match analysis completed'
    });
  } catch (err) {
    if (err.message === 'CV not found') {
      return res.status(404).json({ success: false, message: err.message });
    }
    next(err);
  }
}

module.exports = { analyzeMatch };
