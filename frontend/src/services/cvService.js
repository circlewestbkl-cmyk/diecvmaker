import api from './api'

export default {
  getCvs() {
    return api.get('/cvs')
  },
  getCv(id) {
    return api.get(`/cvs/${id}`)
  },
  createCv(data) {
    return api.post('/cvs', data)
  },
  updateCv(id, data) {
    return api.put(`/cvs/${id}`, data)
  },
  deleteCv(id) {
    return api.delete(`/cvs/${id}`)
  },
  duplicateCv(id) {
    return api.post(`/cvs/${id}/duplicate`)
  },
  togglePublic(id, isPublic) {
    return api.put(`/cvs/${id}/public`, { isPublic })
  },
  downloadPdf(id) {
    return api.get(`/cvs/${id}/pdf`, {
      responseType: 'blob',
      // Ensure proper timeout for PDF generation
      timeout: 60000,
      // Don't transform the response
      transformResponse: [(data) => data]
    })
  }
}
