import api from './api'

export default {
  analyzeCv(data) {
    return api.post('/ats/analyze', data)
  },
  analyzeKeywords(data) {
    return api.post('/ats/keywords', data)
  },
  // Real-time ATS analysis based on CV object
  analyzeAtsReadiness(cv) {
    return api.post('/ats-analysis/analyze', { cv })
  }
}
