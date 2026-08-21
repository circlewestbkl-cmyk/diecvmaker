import api from './api'

export default {
  getProfile() {
    return api.get('/profile')
  },
  updateProfile(data) {
    return api.put('/profile', data)
  },
  uploadAvatar(file) {
    const formData = new FormData()
    formData.append('avatar', file)
    return api.post('/profile/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  }
}
