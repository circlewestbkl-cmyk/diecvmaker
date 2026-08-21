import api from './api'

export default {
  // Users
  getUsers(params) {
    return api.get('/admin/users', { params })
  },
  getUserStats() {
    return api.get('/admin/users/stats')
  },
  getUser(id) {
    return api.get(`/admin/users/${id}`)
  },
  createUser(data) {
    return api.post('/admin/users', data)
  },
  updateUser(id, data) {
    return api.put(`/admin/users/${id}`, data)
  },
  deleteUser(id) {
    return api.delete(`/admin/users/${id}`)
  },
  toggleRole(id) {
    return api.patch(`/admin/users/${id}/toggle-role`)
  },
  resetPassword(id) {
    return api.patch(`/admin/users/${id}/reset-password`)
  }
}
