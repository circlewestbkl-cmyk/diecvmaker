const cvService = require('./cvService');
const jsonStorage = require('./jsonStorageService');

const JOBS_FILE = 'jobs.json';

async function analyzeJobMatch(cvId, jobDescription) {
  const cv = await cvService.getCvById(cvId);
  if (!cv) throw new Error('CV not found');

  // Build CV text
  const p = cv.personal || {};
  const cvText = [
    p.fullName, p.professionalTitle, cv.summary,
    ...(cv.experiences || []).map(e => `${e.position} ${e.company} ${e.description} ${(e.achievements || []).join(' ')}`),
    ...(cv.education || []).map(e => `${e.degree} ${e.fieldOfStudy} ${e.institution}`),
    ...(cv.skills || []).map(s => s.name),
    ...(cv.projects || []).map(pr => `${pr.name} ${pr.description} ${(pr.technologies || []).join(' ')}`),
  ].filter(Boolean).join(' ').toLowerCase();

  const jdLower = jobDescription.toLowerCase();

  // Extract skills from CV
  const cvSkills = (cv.skills || []).map(s => s.name.toLowerCase());
  const cvExperiences = cv.experiences || [];
  const cvEducation = cv.education || [];

  // Extract words from JD (meaningful ones)
  const stopWords = new Set(['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'has', 'his', 'how', 'its', 'may', 'new', 'now', 'old', 'see', 'way', 'who', 'did', 'get', 'let', 'say', 'she', 'too', 'use', 'job', 'team', 'will', 'with', 'this', 'that', 'from', 'have', 'been', 'they', 'more', 'when', 'what', 'your', 'about', 'which', 'their', 'there', 'would', 'could', 'should', 'other', 'into', 'over', 'such', 'also', 'than', 'then', 'them', 'each', 'make', 'like', 'just', 'some', 'our', 'per', 'via']);
  const jdWords = [...new Set(jdLower.split(/\W+/).filter(w => w.length > 2 && !stopWords.has(w)))];

  // Matched skills (from CV skills that appear in JD)
  const matchedSkills = cvSkills.filter(s => jdLower.includes(s));
  const missingSkills = cvSkills.filter(s => !jdLower.includes(s));

  // Skills mentioned in JD that CV doesn't have
  const jdSkillsNeeded = jdWords.filter(w =>
    w.length > 3 && !cvText.includes(w)
  ).slice(0, 10);

  // Experience match
  let experienceMatch = 0;
  if (cvExperiences.length >= 3) experienceMatch = 90;
  else if (cvExperiences.length >= 2) experienceMatch = 70;
  else if (cvExperiences.length >= 1) experienceMatch = 50;
  else experienceMatch = 10;

  // Check for years of experience mentions in JD
  const yearsMatch = jobDescription.match(/(\d+)\+?\s*years?/i);
  if (yearsMatch) {
    const requiredYears = parseInt(yearsMatch[1]);
    const cvYears = cvExperiences.length * 2; // rough estimate
    if (cvYears >= requiredYears) experienceMatch = Math.min(experienceMatch + 10, 100);
  }

  // Education match
  let educationMatch = 0;
  if (cvEducation.length > 0) {
    educationMatch = 70;
    const degreeTypes = cvEducation.map(e => (e.degree || '').toLowerCase());
    if (degreeTypes.some(d => /master|phd/.test(d))) educationMatch = 95;
    else if (degreeTypes.some(d => /bachelor|b\.?s\.?|b\.?a\.?/.test(d))) educationMatch = 85;
    else educationMatch = 60;
  } else {
    educationMatch = 20;
  }

  // Overall match score
  const skillScore = matchedSkills.length > 0
    ? Math.round((matchedSkills.length / Math.max(cvSkills.length, 1)) * 100)
    : 0;

  const matchScore = Math.round(
    skillScore * 0.40 +
    experienceMatch * 0.30 +
    educationMatch * 0.15 +
    (jdWords.filter(w => cvText.includes(w)).length / Math.max(jdWords.length, 1) * 100) * 0.15
  );

  // Recommendations
  const recommendations = [];
  if (matchedSkills.length < 3) {
    recommendations.push('Add more relevant skills that match the job description.');
  }
  if (jdSkillsNeeded.length > 0) {
    recommendations.push(`Consider adding these skills if you have them: ${jdSkillsNeeded.slice(0, 5).join(', ')}`);
  }
  if (cvExperiences.length < 2) {
    recommendations.push('Add more work experience entries to strengthen your application.');
  }
  if (matchScore >= 70) {
    recommendations.push('Great match! Your CV is well-aligned with this job description.');
  }

  return {
    matchScore,
    matchedSkills: matchedSkills.map(s => ({ name: s, inCv: true })),
    missingSkills: jdSkillsNeeded.map(s => ({ name: s, inCv: false })),
    experienceMatch,
    educationMatch,
    recommendations
  };
}

module.exports = { analyzeJobMatch };
