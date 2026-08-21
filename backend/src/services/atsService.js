/**
 * ATS (Applicant Tracking System) Analysis Service
 * Real scoring based on actual ATS rules, not random numbers
 */

// Common ATS keywords by category
const ATS_KEYWORDS = {
  contact: ['email', 'phone', 'linkedin', 'github', 'portfolio', 'address', 'location'],
  sections: ['experience', 'education', 'skills', 'summary', 'objective', 'certifications', 'projects', 'achievements'],
  formatting: ['bullet points', 'dates', 'consistent', 'headers', 'clean'],
  powerWords: [
    'achieved', 'improved', 'managed', 'developed', 'implemented', 'led', 'created',
    'designed', 'built', 'launched', 'optimized', 'increased', 'reduced', 'delivered',
    'maintained', 'collaborated', 'analyzed', 'spearheaded', 'orchestrated', 'streamlined'
  ],
  techSkills: [
    'javascript', 'python', 'java', 'react', 'vue', 'angular', 'node', 'nodejs',
    'typescript', 'html', 'css', 'sql', 'mongodb', 'postgresql', 'mysql',
    'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'git', 'linux',
    'agile', 'scrum', 'jira', 'figma', 'photoshop', 'excel', 'powerpoint'
  ]
};

// Section detection patterns
const SECTION_PATTERNS = {
  contact: /(@|email|phone|tel|mobile|linkedin|github|portfolio|website)/i,
  summary: /(summary|objective|profile|about|overview|professional\s+summary)/i,
  experience: /(experience|work\s+history|employment|career|professional\s+experience)/i,
  education: /(education|degree|university|college|school|bachelor|master|gpa)/i,
  skills: /(skills|technologies|competencies|proficiencies|expertise|technical\s+skills)/i,
  projects: /(projects|portfolio|work\s+samples)/i,
  certifications: /(certifications|certificates|licenses|credentials)/i,
};

function analyzeContact(text) {
  let score = 0;
  const details = [];

  // Email check
  const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/);
  if (emailMatch) { score += 25; details.push('✓ Email found'); }
  else { details.push('✗ No email found'); }

  // Phone check
  const phoneMatch = text.match(/[\+]?[\d\s\-\(\)]{8,}/);
  if (phoneMatch) { score += 25; details.push('✓ Phone number found'); }
  else { details.push('✗ No phone number found'); }

  // Location check
  if (SECTION_PATTERNS.contact.test(text) && /location|address|city/i.test(text)) {
    score += 25; details.push('✓ Location found');
  } else if (text.length > 100) {
    score += 15; details.push('~ Location may be present');
  } else {
    details.push('✗ No location found');
  }

  // LinkedIn/website check
  if (/linkedin/i.test(text)) { score += 12.5; details.push('✓ LinkedIn found'); }
  if (/github|portfolio|website/i.test(text)) { score += 12.5; details.push('✓ Portfolio/GitHub found'); }

  return { score: Math.min(score, 100), details };
}

function analyzeFormatting(text) {
  let score = 0;
  const details = [];
  const lines = text.split('\n');

  // Has bullet points or dashes
  const bulletCount = lines.filter(l => /^\s*[\-\•\*\→\✓\✗]/.test(l)).length;
  if (bulletCount > 2) { score += 25; details.push(`✓ ${bulletCount} bullet points found`); }
  else { details.push('✗ Few or no bullet points'); }

  // Has dates
  const dateMatches = text.match(/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4}\b/gi) ||
                      text.match(/\b\d{4}\s*[-–]\s*(\d{4}|Present|Current)\b/gi) ||
                      text.match(/\b\d{4}\b/g);
  if (dateMatches && dateMatches.length >= 2) { score += 25; details.push(`✓ ${dateMatches.length} dates found`); }
  else { details.push('✗ Few or no dates found'); }

  // Has clear sections (headers in caps or bold patterns)
  const headerLines = lines.filter(l => /^[A-Z\s]{3,}$/.test(l.trim()) || /^#{1,3}\s/.test(l));
  if (headerLines.length >= 3) { score += 25; details.push(`✓ ${headerLines.length} section headers found`); }
  else { details.push('✗ Few section headers detected'); }

  // Reasonable length
  const wordCount = text.split(/\s+/).length;
  if (wordCount >= 200 && wordCount <= 1000) {
    score += 25; details.push(`✓ Good length (${wordCount} words)`);
  } else if (wordCount > 1000) {
    score += 15; details.push(`~ CV may be too long (${wordCount} words)`);
  } else {
    score += 10; details.push(`~ CV may be too short (${wordCount} words)`);
  }

  return { score: Math.min(score, 100), details };
}

function analyzeExperience(text) {
  let score = 0;
  const details = [];

  // Has experience section
  if (SECTION_PATTERNS.experience.test(text)) {
    score += 30; details.push('✓ Experience section found');
  } else {
    details.push('✗ No experience section detected');
    return { score, details };
  }

  // Count power words
  const powerWordCount = ATS_KEYWORDS.powerWords.filter(w =>
    new RegExp(`\\b${w}\\b`, 'i').test(text)
  ).length;
  if (powerWordCount >= 5) { score += 30; details.push(`✓ ${powerWordCount} action verbs found`); }
  else if (powerWordCount >= 2) { score += 15; details.push(`~ Only ${powerWordCount} action verbs`); }
  else { details.push('✗ Few action verbs used'); }

  // Check for quantified achievements (numbers in context)
  const quantifiedMatches = text.match(/\d+%|\d+\+|\$\d+|\d+\s*(years?|months?|projects?|users?|customers?|team)/gi);
  if (quantifiedMatches && quantifiedMatches.length >= 2) {
    score += 20; details.push(`✓ ${quantifiedMatches.length} quantified achievements`);
  } else {
    details.push('✗ Few quantified achievements');
  }

  // Multiple roles/positions
  const roleCount = (text.match(/(developer|engineer|manager|designer|analyst|lead|director|specialist|consultant|intern)/gi) || []).length;
  if (roleCount >= 2) { score += 20; details.push('✓ Multiple roles detected'); }
  else { score += 10; details.push('~ Limited role variety'); }

  return { score: Math.min(score, 100), details };
}

function analyzeSkills(text) {
  let score = 0;
  const details = [];
  const lowerText = text.toLowerCase();

  // Has skills section
  if (SECTION_PATTERNS.skills.test(text)) {
    score += 20; details.push('✓ Skills section found');
  } else {
    details.push('✗ No skills section detected');
  }

  // Count tech skills found
  const foundSkills = ATS_KEYWORDS.techSkills.filter(s => lowerText.includes(s));
  if (foundSkills.length >= 5) {
    score += 40; details.push(`✓ ${foundSkills.length} technical skills found`);
  } else if (foundSkills.length >= 2) {
    score += 20; details.push(`~ ${foundSkills.length} technical skills found`);
  } else {
    details.push('✗ Few technical skills detected');
  }

  // Skills organized (check for categories)
  if (/frontend|backend|database|devops|design/i.test(text)) {
    score += 20; details.push('✓ Skills appear categorized');
  } else {
    score += 10; details.push('~ Skills could be better organized');
  }

  // Skill levels mentioned
  if (/advanced|expert|proficient|intermediate|beginner|advanced|experienced/i.test(text)) {
    score += 20; details.push('✓ Skill levels mentioned');
  } else {
    details.push('✗ No skill levels indicated');
  }

  return { score: Math.min(score, 100), details };
}

function analyzeEducation(text) {
  let score = 0;
  const details = [];

  if (SECTION_PATTERNS.education.test(text)) {
    score += 40; details.push('✓ Education section found');
  } else {
    details.push('✗ No education section detected');
    return { score, details };
  }

  // Degree mentioned
  if (/bachelor|master|phd|degree|b\.?s\.?|m\.?s\.?|b\.?a\.?|m\.?a\.?/i.test(text)) {
    score += 30; details.push('✓ Degree type mentioned');
  } else {
    details.push('✗ No degree type found');
  }

  // Institution mentioned
  if (/university|college|institute|school|academy/i.test(text)) {
    score += 15; details.push('✓ Institution name found');
  }

  // GPA or honors
  if (/gpa|honors|cum laude|dean|scholarship/i.test(text)) {
    score += 15; details.push('✓ GPA/honors mentioned');
  }

  return { score: Math.min(score, 100), details };
}

function analyzeSummary(text) {
  let score = 0;
  const details = [];

  if (SECTION_PATTERNS.summary.test(text)) {
    score += 30; details.push('✓ Summary/objective section found');
  } else {
    details.push('✗ No summary section detected');
    return { score, details };
  }

  // Summary length check
  const summaryMatch = text.match(/(?:summary|objective|profile|about)[\s\S]{0,500}/i);
  if (summaryMatch) {
    const wordCount = summaryMatch[0].split(/\s+/).length;
    if (wordCount >= 20 && wordCount <= 80) {
      score += 40; details.push(`✓ Good summary length (${wordCount} words)`);
    } else if (wordCount > 80) {
      score += 20; details.push(`~ Summary may be too long (${wordCount} words)`);
    } else {
      score += 15; details.push(`~ Summary may be too short (${wordCount} words)`);
    }
  }

  // Keywords in summary
  const keywordCount = ATS_KEYWORDS.powerWords.filter(w =>
    new RegExp(`\\b${w}\\b`, 'i').test(text)
  ).length;
  if (keywordCount >= 3) {
    score += 30; details.push('✓ Strong keywords in summary');
  } else {
    score += 10; details.push('~ Could use more keywords in summary');
  }

  return { score: Math.min(score, 100), details };
}

function extractKeywords(text) {
  const lowerText = text.toLowerCase();
  const found = [];
  const missing = [];

  // Check tech skills
  ATS_KEYWORDS.techSkills.forEach(skill => {
    if (lowerText.includes(skill)) found.push(skill);
  });

  // Check power words
  ATS_KEYWORDS.powerWords.forEach(word => {
    if (new RegExp(`\\b${word}\\b`, 'i').test(text)) found.push(word);
  });

  return { found, missing: [] };
}

function matchKeywordsWithJobDescription(cvText, jobDescription) {
  const cvLower = cvText.toLowerCase();
  const jdLower = jobDescription.toLowerCase();

  // Extract words from job description (3+ chars, not common)
  const stopWords = new Set(['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'has', 'his', 'how', 'its', 'may', 'new', 'now', 'old', 'see', 'way', 'who', 'did', 'get', 'let', 'say', 'she', 'too', 'use', 'job', 'team', 'will', 'with', 'this', 'that', 'from', 'have', 'been', 'they', 'more', 'when', 'what', 'your', 'about', 'which', 'their', 'there', 'would', 'could', 'should', 'other', 'into', 'over', 'such', 'also', 'than', 'then', 'them', 'each', 'make', 'like', 'just', 'some']);
  const jdWords = [...new Set(jdLower.split(/\W+/).filter(w => w.length > 2 && !stopWords.has(w)))];

  const matched = [];
  const missing = [];

  jdWords.forEach(word => {
    if (cvLower.includes(word)) {
      matched.push(word);
    } else {
      missing.push(word);
    }
  });

  const score = jdWords.length > 0 ? Math.round((matched.length / jdWords.length) * 100) : 0;

  return {
    matchedKeywords: matched.slice(0, 20),
    missingKeywords: missing.slice(0, 20),
    keywordScore: score,
    recommendations: generateKeywordRecommendations(matched, missing)
  };
}

function generateKeywordRecommendations(matched, missing) {
  const recs = [];
  if (missing.length > 5) {
    recs.push('Consider adding more keywords from the job description to your CV.');
  }
  if (matched.length < 3) {
    recs.push('Your CV has very few matching keywords. Tailor your CV for this specific job.');
  }
  if (missing.some(w => ATS_KEYWORDS.techSkills.includes(w))) {
    const techMissing = missing.filter(w => ATS_KEYWORDS.techSkills.includes(w));
    recs.push(`Consider adding these technical skills if you have them: ${techMissing.slice(0, 5).join(', ')}`);
  }
  if (matched.length > 10) {
    recs.push('Good keyword match! Your CV is well-aligned with this job description.');
  }
  return recs;
}

async function analyzeCvText(cvText) {
  const contact = analyzeContact(cvText);
  const formatting = analyzeFormatting(cvText);
  const experience = analyzeExperience(cvText);
  const skills = analyzeSkills(cvText);
  const education = analyzeEducation(cvText);
  const summary = analyzeSummary(cvText);
  const { found: matchedKeywords, missing: missingKeywordsFromCv } = extractKeywords(cvText);

  // Weighted overall score
  const overallScore = Math.round(
    contact.score * 0.15 +
    formatting.score * 0.15 +
    experience.score * 0.25 +
    skills.score * 0.20 +
    education.score * 0.15 +
    summary.score * 0.10
  );

  const recommendations = [];
  if (contact.score < 75) recommendations.push('Add your email, phone number, and LinkedIn profile to the header.');
  if (formatting.score < 50) recommendations.push('Use bullet points, clear section headers, and consistent date formatting.');
  if (experience.score < 50) recommendations.push('Add more work experience with action verbs and quantified achievements.');
  if (skills.score < 50) recommendations.push('Add a dedicated skills section with relevant technical skills.');
  if (education.score < 50) recommendations.push('Include your education details with degree, institution, and dates.');
  if (summary.score < 50) recommendations.push('Add a professional summary highlighting your key qualifications.');

  return {
    score: overallScore,
    formattingScore: formatting.score,
    keywordScore: skills.score,
    experienceScore: experience.score,
    skillsScore: skills.score,
    educationScore: education.score,
    contactScore: contact.score,
    summaryScore: summary.score,
    recommendations,
    matchedKeywords,
    missingKeywords: missingKeywordsFromCv,
    details: {
      contact: contact.details,
      formatting: formatting.details,
      experience: experience.details,
      skills: skills.details,
      education: education.details,
      summary: summary.details
    }
  };
}

module.exports = { analyzeCvText, matchKeywordsWithJobDescription };
