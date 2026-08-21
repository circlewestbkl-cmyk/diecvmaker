import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import authService from '@/services/authService'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const isAuthenticated = computed(() => !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')

  async function register(data) {
    loading.value = true
    error.value = null
    try {
      const response = await authService.register(data)
      const { user: userData, token } = response.data.data
      localStorage.setItem('token', token)
      user.value = userData
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Registration failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function login(data) {
    loading.value = true
    error.value = null
    try {
      const response = await authService.login(data)
      const { user: userData, token } = response.data.data
      localStorage.setItem('token', token)
      user.value = userData
      return response.data
    } catch (err) {
      const message = err.response?.data?.message
      error.value = message || 'Login failed. Please check your credentials.'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    try {
      await authService.logout()
    } catch (err) {
      // Ignore logout errors
    } finally {
      localStorage.removeItem('token')
      user.value = null
    }
  }

  async function fetchUser() {
    const token = localStorage.getItem('token')
    if (!token) return

    loading.value = true
    try {
      const response = await authService.getMe()
      user.value = response.data.data
    } catch (err) {
      localStorage.removeItem('token')
      user.value = null
    } finally {
      loading.value = false
    }
  }

  return {
    user,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    register,
    login,
    logout,
    fetchUser
  }
})
