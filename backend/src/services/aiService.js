/**
 * AI Service - OpenAI Integration
 * All AI calls go through backend only. API key never exposed to frontend.
 */

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4';

async function callOpenAI(prompt, systemMessage = 'You are a professional CV writing assistant.') {
  if (!OPENAI_API_KEY) {
    // Fallback: return a helpful template-based response
    return generateFallbackResponse(prompt, systemMessage);
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (err) {
    console.error('OpenAI API error:', err.message);
    return generateFallbackResponse(prompt, systemMessage);
  }
}

function generateFallbackResponse(prompt, systemMessage) {
  // Template-based fallback when no API key
  // IMPORTANT: Order matters - check more specific patterns first

  // Interview answer evaluation
  if (prompt.includes('Evaluate') || prompt.includes('evaluate')) {
    return 'Score: 7/10\n\nWhat is good: Your answer demonstrates relevant experience and shows you can communicate technical concepts clearly.\n\nWhat to improve: Consider adding more specific metrics or quantified results to make your answer more impactful.\n\nSample better answer: With over 3 years of hands-on experience in Vue.js, I have built multiple single-page applications serving thousands of users. I created a reusable component library that reduced development time by 40% across three teams, and I led the migration of a legacy jQuery app to Vue 3, improving performance scores by 60%.';
  }

  // Interview questions generation
  if (prompt.includes('interview') && prompt.includes('question')) {
    const roleMatch = prompt.match(/Generate \d+ interview questions for a (.+?) position/);
    const role = roleMatch ? roleMatch[1] : 'Software';
    return `1. Tell me about yourself and your experience as a ${role} professional.\n2. What are your greatest strengths and how do they apply to this role?\n3. Describe a challenging project you worked on and how you overcame obstacles.\n4. (Technical) What technical skills do you consider your strongest, and how have you applied them in past projects?\n5. (Technical) How do you stay current with new technologies and industry trends?\n6. (Technical) Describe your approach to debugging complex issues.\n7. (STAR) Tell me about a time you had to meet a tight deadline. What was the situation and what was the result?\n8. (STAR) Describe a situation where you had a conflict with a team member. How did you resolve it?\n9. (STAR) Give an example of when you went above and beyond in your role.\n10. (Behavioral) Where do you see yourself in 5 years?`;
  }

  // Cover letter
  if (prompt.includes('cover letter')) {
    return 'Dear Hiring Manager,\n\nI am writing to express my strong interest in the position at your company. With my extensive experience in the field, I am confident in my ability to contribute meaningfully to your team.\n\nThroughout my career, I have developed a strong skill set that aligns well with the requirements of this role. My background includes successfully delivering projects, collaborating with cross-functional teams, and continuously learning new technologies.\n\nI would welcome the opportunity to discuss how my skills and experience can benefit your organization. Thank you for considering my application.\n\nBest regards';
  }

  // Summary
  if (prompt.includes('summary') || prompt.includes('Summary')) {
    return 'Results-driven professional with proven experience in delivering high-quality solutions. Skilled in problem-solving, team collaboration, and continuous learning. Passionate about creating efficient and innovative solutions.';
  }

  // Improve description
  if (prompt.includes('improve') || prompt.includes('description')) {
    return 'Developed and maintained scalable web applications using modern frameworks, resulting in improved performance and user experience. Collaborated with cross-functional teams to deliver projects on time and within budget.';
  }

  // Achievement
  if (prompt.includes('achievement')) {
    return 'Led a team of 5 developers to deliver a major project 2 weeks ahead of schedule, resulting in a 30% improvement in operational efficiency.';
  }

  // Skills suggestion
  if (prompt.includes('skill')) {
    return 'JavaScript, TypeScript, Vue.js, React, Node.js, Express, REST APIs, Git, Docker, AWS, SQL, MongoDB, Agile/Scrum';
  }

  // CV optimization
  if (prompt.includes('optimize') || prompt.includes('CV')) {
    return 'Your CV looks good! Consider: 1) Adding more quantified achievements (numbers, percentages), 2) Using stronger action verbs, 3) Tailoring skills to match the job description, 4) Keeping it concise (1-2 pages).';
  }

  return 'I can help you with your CV. Please provide more details about what you need assistance with.';
}

async function generateSummary(professionalTitle, experience, skills) {
  const prompt = `Generate a professional CV summary for a ${professionalTitle} with experience in ${experience || 'web development'}. Skills include: ${skills || 'various technologies'}. Keep it 2-3 sentences, professional and concise.`;
  return await callOpenAI(prompt);
}

async function improveDescription(description) {
  const prompt = `Improve this work experience description to be more impactful and ATS-friendly. Use action verbs, quantify achievements where possible. Original: "${description}". Return only the improved description, nothing else.`;
  return await callOpenAI(prompt);
}

async function generateAchievement(role, company) {
  const prompt = `Generate 3 professional achievement bullet points for a ${role} at ${company}. Use the format: Action verb + what you did + result/impact. Make them specific and quantified where possible.`;
  return await callOpenAI(prompt);
}

async function suggestSkills(role) {
  const prompt = `Suggest 10-15 relevant technical and soft skills for a ${role} position. Format as a comma-separated list.`;
  return await callOpenAI(prompt);
}

async function optimizeCV(cvText, targetRole) {
  const prompt = `Analyze this CV text and provide specific recommendations to optimize it for a ${targetRole || 'software developer'} position. Focus on: keywords, formatting, achievements, and ATS compatibility.\n\nCV:\n${cvText}`;
  return await callOpenAI(prompt);
}

async function generateCoverLetter(cvSummary, jobDescription, companyName, position) {
  const prompt = `Write a professional cover letter for a ${position} position at ${companyName}.\n\nMy background: ${cvSummary}\n\nJob description: ${jobDescription}\n\nWrite a compelling 3-paragraph cover letter. Be specific to the role and company.`;
  return await callOpenAI(prompt);
}

async function generateInterviewQuestions(role, skills) {
  const prompt = `Generate 10 interview questions for a ${role} position. Include: 3 HR/behavioral questions, 3 technical questions, and 4 behavioral questions using the STAR method. Skills: ${skills || 'general'}.`;
  return await callOpenAI(prompt);
}

async function evaluateInterviewAnswer(question, answer) {
  const prompt = `Evaluate this interview answer and provide feedback.\n\nQuestion: ${question}\nAnswer: ${answer}\n\nProvide: 1) Score (1-10), 2) What's good, 3) What to improve, 4) A sample better answer.`;
  return await callOpenAI(prompt);
}

// Rate limiter for AI endpoints
const aiRateLimit = {};
function checkAiRateLimit(userId) {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 10;

  if (!aiRateLimit[userId]) {
    aiRateLimit[userId] = [];
  }

  // Clean old entries
  aiRateLimit[userId] = aiRateLimit[userId].filter(t => now - t < windowMs);

  if (aiRateLimit[userId].length >= maxRequests) {
    return false;
  }

  aiRateLimit[userId].push(now);
  return true;
}

module.exports = {
  generateSummary,
  improveDescription,
  generateAchievement,
  suggestSkills,
  optimizeCV,
  generateCoverLetter,
  generateInterviewQuestions,
  evaluateInterviewAnswer,
  checkAiRateLimit
};
