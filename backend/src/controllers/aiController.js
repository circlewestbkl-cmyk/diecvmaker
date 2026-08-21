const aiService = require('../services/aiService');

// POST /api/ai/summary
async function generateSummary(req, res, next) {
  try {
    if (!aiService.checkAiRateLimit(req.user.id)) {
      return res.status(429).json({ success: false, message: 'Rate limit exceeded. Try again in 1 minute.' });
    }
    const { professionalTitle, experience, skills } = req.body;
    const summary = await aiService.generateSummary(professionalTitle, experience, skills);
    res.json({ success: true, data: { summary }, message: 'Summary generated' });
  } catch (err) {
    next(err);
  }
}

// POST /api/ai/improve-description
async function improveDescription(req, res, next) {
  try {
    if (!aiService.checkAiRateLimit(req.user.id)) {
      return res.status(429).json({ success: false, message: 'Rate limit exceeded. Try again in 1 minute.' });
    }
    const { description } = req.body;
    if (!description) {
      return res.status(400).json({ success: false, message: 'Description is required' });
    }
    const improved = await aiService.improveDescription(description);
    res.json({ success: true, data: { improved }, message: 'Description improved' });
  } catch (err) {
    next(err);
  }
}

// POST /api/ai/achievement
async function generateAchievement(req, res, next) {
  try {
    if (!aiService.checkAiRateLimit(req.user.id)) {
      return res.status(429).json({ success: false, message: 'Rate limit exceeded. Try again in 1 minute.' });
    }
    const { role, company } = req.body;
    const achievements = await aiService.generateAchievement(role || 'Developer', company || 'Company');
    res.json({ success: true, data: { achievements }, message: 'Achievements generated' });
  } catch (err) {
    next(err);
  }
}

// POST /api/ai/skills
async function suggestSkills(req, res, next) {
  try {
    if (!aiService.checkAiRateLimit(req.user.id)) {
      return res.status(429).json({ success: false, message: 'Rate limit exceeded. Try again in 1 minute.' });
    }
    const { role } = req.body;
    const skills = await aiService.suggestSkills(role || 'Software Developer');
    res.json({ success: true, data: { skills }, message: 'Skills suggested' });
  } catch (err) {
    next(err);
  }
}

// POST /api/ai/optimize-cv
async function optimizeCV(req, res, next) {
  try {
    if (!aiService.checkAiRateLimit(req.user.id)) {
      return res.status(429).json({ success: false, message: 'Rate limit exceeded. Try again in 1 minute.' });
    }
    const { cvText, targetRole } = req.body;
    if (!cvText) {
      return res.status(400).json({ success: false, message: 'cvText is required' });
    }
    const recommendations = await aiService.optimizeCV(cvText, targetRole);
    res.json({ success: true, data: { recommendations }, message: 'CV optimization complete' });
  } catch (err) {
    next(err);
  }
}

// POST /api/ai/cover-letter
async function generateCoverLetter(req, res, next) {
  try {
    if (!aiService.checkAiRateLimit(req.user.id)) {
      return res.status(429).json({ success: false, message: 'Rate limit exceeded. Try again in 1 minute.' });
    }
    const { cvSummary, jobDescription, companyName, position } = req.body;
    const coverLetter = await aiService.generateCoverLetter(cvSummary, jobDescription, companyName, position);
    res.json({ success: true, data: { coverLetter }, message: 'Cover letter generated' });
  } catch (err) {
    next(err);
  }
}

// POST /api/ai/interview-questions
async function generateInterviewQuestions(req, res, next) {
  try {
    if (!aiService.checkAiRateLimit(req.user.id)) {
      return res.status(429).json({ success: false, message: 'Rate limit exceeded. Try again in 1 minute.' });
    }
    const { role, skills } = req.body;
    const questions = await aiService.generateInterviewQuestions(role || 'Developer', skills);
    res.json({ success: true, data: { questions }, message: 'Interview questions generated' });
  } catch (err) {
    next(err);
  }
}

// POST /api/ai/evaluate-answer
async function evaluateAnswer(req, res, next) {
  try {
    if (!aiService.checkAiRateLimit(req.user.id)) {
      return res.status(429).json({ success: false, message: 'Rate limit exceeded. Try again in 1 minute.' });
    }
    const { question, answer } = req.body;
    const evaluation = await aiService.evaluateInterviewAnswer(question, answer);
    res.json({ success: true, data: { evaluation }, message: 'Answer evaluated' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  generateSummary,
  improveDescription,
  generateAchievement,
  suggestSkills,
  optimizeCV,
  generateCoverLetter,
  generateInterviewQuestions,
  evaluateAnswer
};
