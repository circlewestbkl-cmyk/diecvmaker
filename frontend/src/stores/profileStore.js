import { defineStore } from 'pinia'
import { ref } from 'vue'
import profileService from '@/services/profileService'

export const useProfileStore = defineStore('profile', () => {
  const profile = ref({})
  const loading = ref(false)
  const error = ref(null)

  async function fetchProfile() {
    loading.value = true
    error.value = null
    try {
      const response = await profileService.getProfile()
      profile.value = response.data.data || {}
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to load profile'
    } finally {
      loading.value = false
    }
  }

  async function updateProfile(data) {
    loading.value = true
    error.value = null
    try {
      const response = await profileService.updateProfile(data)
      profile.value = response.data.data
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to update profile'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function uploadAvatar(file) {
    loading.value = true
    error.value = null
    try {
      const response = await profileService.uploadAvatar(file)
      profile.value.avatar = response.data.data.avatar
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to upload avatar'
      throw err
    } finally {
      loading.value = false
    }
  }

  return { profile, loading, error, fetchProfile, updateProfile, uploadAvatar }
})
