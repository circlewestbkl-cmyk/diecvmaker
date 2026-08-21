import api from './api'

export default {
  getCoverLetters() {
    return api.get('/cover-letters')
  },
  getCoverLetter(id) {
    return api.get(`/cover-letters/${id}`)
  },
  createCoverLetter(data) {
    return api.post('/cover-letters', data)
  },
  updateCoverLetter(id, data) {
    return api.put(`/cover-letters/${id}`, data)
  },
  deleteCoverLetter(id) {
    return api.delete(`/cover-letters/${id}`)
  }
}
