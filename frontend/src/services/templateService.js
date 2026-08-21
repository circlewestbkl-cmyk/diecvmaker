import api from './api'

export default {
  getTemplates() {
    return api.get('/templates')
  },
  getTemplate(id) {
    return api.get(`/templates/${id}`)
  }
}
