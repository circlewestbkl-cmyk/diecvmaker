import api from './api'

export default {
  register(data) {
    return api.post('/auth/register', data)
  },
  login(data) {
    return api.post('/auth/login', data)
  },
  logout() {
    return api.post('/auth/logout')
  },
  getMe() {
    return api.get('/auth/me')
  },
  forgotPassword(email) {
    return api.post('/auth/forgot-password', { email })
  },
  resetPassword(data) {
    return api.post('/auth/reset-password', data)
  }
}
