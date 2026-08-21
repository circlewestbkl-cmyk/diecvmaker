import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import jobService from '@/services/jobService'

export const useApplicationStore = defineStore('application', () => {
  const applications = ref([])
  const stats = ref({ total: 0, applied: 0, interviewing: 0, offered: 0, rejected: 0, withdrawn: 0 })
  const loading = ref(false)
  const error = ref(null)

  const totalApplications = computed(() => stats.value.total)

  async function fetchApplications() {
    loading.value = true
    error.value = null
    try {
      const response = await jobService.getApplications()
      applications.value = response.data.data || []
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to load applications'
    } finally {
      loading.value = false
    }
  }

  async function fetchStats() {
    try {
      const response = await jobService.getApplicationStats()
      stats.value = response.data.data || stats.value
    } catch (err) {
      console.error('Failed to fetch stats:', err)
    }
  }

  async function applyToJob(data) {
    loading.value = true
    error.value = null
    try {
      const response = await jobService.applyToJob(data)
      applications.value.unshift(response.data.data)
      await fetchStats()
      return response.data.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to apply'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateApplication(id, data) {
    loading.value = true
    error.value = null
    try {
      const response = await jobService.updateApplication(id, data)
      const index = applications.value.findIndex(a => a.id === id)
      if (index !== -1) {
        applications.value[index] = { ...applications.value[index], ...response.data.data }
      }
      await fetchStats()
      return response.data.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to update application'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteApplication(id) {
    loading.value = true
    error.value = null
    try {
      await jobService.deleteApplication(id)
      applications.value = applications.value.filter(a => a.id !== id)
      await fetchStats()
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to delete application'
      throw err
    } finally {
      loading.value = false
    }
  }

  function hasApplied(jobId) {
    return applications.value.some(a => a.jobId === jobId)
  }

  function getApplicationForJob(jobId) {
    return applications.value.find(a => a.jobId === jobId) || null
  }

  return {
    applications,
    stats,
    loading,
    error,
    totalApplications,
    fetchApplications,
    fetchStats,
    applyToJob,
    updateApplication,
    deleteApplication,
    hasApplied,
    getApplicationForJob
  }
})
