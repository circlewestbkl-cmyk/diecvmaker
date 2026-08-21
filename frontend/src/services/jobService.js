import api from './api'

export default {
  // Job Portal
  getJobs(params) {
    return api.get('/jobs', { params })
  },
  getJob(id) {
    return api.get(`/jobs/${id}`)
  },
  createJob(data) {
    return api.post('/jobs', data)
  },
  updateJob(id, data) {
    return api.put(`/jobs/${id}`, data)
  },
  deleteJob(id) {
    return api.delete(`/jobs/${id}`)
  },

  // Job Matcher
  analyzeMatch(data) {
    return api.post('/job-matcher/analyze', data)
  },

  // Applications
  getApplications() {
    return api.get('/applications')
  },
  getApplicationStats() {
    return api.get('/applications/stats')
  },
  getApplication(id) {
    return api.get(`/applications/${id}`)
  },
  applyToJob(data) {
    return api.post('/applications', data)
  },
  updateApplication(id, data) {
    return api.patch(`/applications/${id}`, data)
  },
  deleteApplication(id) {
    return api.delete(`/applications/${id}`)
  },

  // Saved Jobs
  getSavedJobs() {
    return api.get('/saved-jobs')
  },
  saveJob(jobId) {
    return api.post('/saved-jobs', { jobId })
  },
  unsaveJob(jobId) {
    return api.delete(`/saved-jobs/${jobId}`)
  },
  checkSavedJob(jobId) {
    return api.get(`/saved-jobs/check/${jobId}`)
  }
}
