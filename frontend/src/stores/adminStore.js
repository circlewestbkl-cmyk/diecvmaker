import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import adminService from '@/services/adminService'

export const useAdminStore = defineStore('admin', () => {
  const users = ref([])
  const stats = ref({ total: 0, admins: 0, regular: 0, thisMonth: 0 })
  const loading = ref(false)
  const error = ref(null)
  const filters = ref({ search: '', role: '', sort: 'newest' })

  const totalUsers = computed(() => stats.value.total)

  async function fetchUsers(params = {}) {
    loading.value = true
    error.value = null
    try {
      const response = await adminService.getUsers({ ...filters.value, ...params })
      users.value = response.data.data || []
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to load users'
    } finally {
      loading.value = false
    }
  }

  async function fetchStats() {
    try {
      const response = await adminService.getUserStats()
      stats.value = response.data.data || stats.value
    } catch (err) {
      console.error('Failed to fetch stats:', err)
    }
  }

  async function createUser(data) {
    loading.value = true
    error.value = null
    try {
      const response = await adminService.createUser(data)
      users.value.unshift(response.data.data)
      await fetchStats()
      return response.data.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to create user'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateUser(id, data) {
    loading.value = true
    error.value = null
    try {
      const response = await adminService.updateUser(id, data)
      const index = users.value.findIndex(u => u.id === id)
      if (index !== -1) {
        users.value[index] = response.data.data
      }
      return response.data.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to update user'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteUser(id) {
    loading.value = true
    error.value = null
    try {
      await adminService.deleteUser(id)
      users.value = users.value.filter(u => u.id !== id)
      await fetchStats()
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to delete user'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function toggleRole(id) {
    try {
      const response = await adminService.toggleRole(id)
      const index = users.value.findIndex(u => u.id === id)
      if (index !== -1) {
        users.value[index].role = response.data.data.role
      }
      await fetchStats()
      return response.data.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to toggle role'
      throw err
    }
  }

  async function resetPassword(id) {
    try {
      const response = await adminService.resetPassword(id)
      return response.data.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to reset password'
      throw err
    }
  }

  function setFilters(newFilters) {
    filters.value = { ...filters.value, ...newFilters }
  }

  function clearFilters() {
    filters.value = { search: '', role: '', sort: 'newest' }
  }

  return {
    users,
    stats,
    loading,
    error,
    filters,
    totalUsers,
    fetchUsers,
    fetchStats,
    createUser,
    updateUser,
    deleteUser,
    toggleRole,
    resetPassword,
    setFilters,
    clearFilters
  }
})
