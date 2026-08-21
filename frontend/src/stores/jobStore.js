import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import jobService from '@/services/jobService'

export const useJobStore = defineStore('job', () => {
  const jobs = ref([])
  const currentJob = ref(null)
  const savedJobs = ref([])
  const loading = ref(false)
  const error = ref(null)
  const filters = ref({
    search: '',
    employmentType: '',
    workplaceType: '',
    location: '',
    skill: '',
    sort: 'newest'
  })

  const totalJobs = computed(() => jobs.value.length)

  async function fetchJobs(params = {}) {
    loading.value = true
    error.value = null
    try {
      const response = await jobService.getJobs({ ...filters.value, ...params })
      jobs.value = response.data.data || []
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to load jobs'
    } finally {
      loading.value = false
    }
  }

  async function fetchJob(id) {
    loading.value = true
    error.value = null
    try {
      const response = await jobService.getJob(id)
      currentJob.value = response.data.data
      return response.data.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to load job'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createJob(data) {
    loading.value = true
    error.value = null
    try {
      const response = await jobService.createJob(data)
      jobs.value.unshift(response.data.data)
      return response.data.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to create job'
      throw err
    } finally {
      loading.value = false
    }
  }

  function setFilters(newFilters) {
    filters.value = { ...filters.value, ...newFilters }
  }

  function clearFilters() {
    filters.value = { search: '', employmentType: '', workplaceType: '', location: '', skill: '', sort: 'newest' }
  }

  // Saved Jobs
  async function fetchSavedJobs() {
    loading.value = true
    try {
      const response = await jobService.getSavedJobs()
      savedJobs.value = response.data.data || []
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to load saved jobs'
    } finally {
      loading.value = false
    }
  }

  async function toggleSaveJob(jobId) {
    try {
      const isSaved = savedJobs.value.some(s => s.jobId === jobId)
      if (isSaved) {
        await jobService.unsaveJob(jobId)
        savedJobs.value = savedJobs.value.filter(s => s.jobId !== jobId)
      } else {
        await jobService.saveJob(jobId)
        savedJobs.value.push({ jobId, createdAt: new Date().toISOString() })
      }
      return !isSaved
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to save/unsave job'
      throw err
    }
  }

  function isJobSaved(jobId) {
    return savedJobs.value.some(s => s.jobId === jobId)
  }

  return {
    jobs,
    currentJob,
    savedJobs,
    loading,
    error,
    filters,
    totalJobs,
    fetchJobs,
    fetchJob,
    createJob,
    setFilters,
    clearFilters,
    fetchSavedJobs,
    toggleSaveJob,
    isJobSaved
  }
})
