import api from './api'

export default {
  generateSummary(data) {
    return api.post('/ai/summary', data)
  },
  improveDescription(data) {
    return api.post('/ai/improve-description', data)
  },
  generateAchievement(data) {
    return api.post('/ai/achievement', data)
  },
  suggestSkills(data) {
    return api.post('/ai/skills', data)
  },
  optimizeCV(data) {
    return api.post('/ai/optimize-cv', data)
  },
  generateCoverLetter(data) {
    return api.post('/ai/cover-letter', data)
  },
  generateInterviewQuestions(data) {
    return api.post('/ai/interview-questions', data)
  },
  evaluateAnswer(data) {
    return api.post('/ai/evaluate-answer', data)
  },
  getPublicCv(id) {
    return api.get(`/public/cv/${id}`)
  }
}
