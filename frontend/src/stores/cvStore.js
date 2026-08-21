import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import cvService from '@/services/cvService'

export const useCvStore = defineStore('cv', () => {
  const cvs = ref([])
  const currentCv = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const totalCvs = computed(() => cvs.value.length)

  async function fetchCvs() {
    loading.value = true
    error.value = null
    try {
      const response = await cvService.getCvs()
      cvs.value = response.data.data || []
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to load CVs'
    } finally {
      loading.value = false
    }
  }

  async function fetchCv(id) {
    loading.value = true
    error.value = null
    try {
      const response = await cvService.getCv(id)
      currentCv.value = response.data.data
      return response.data.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to load CV'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createCv(data) {
    loading.value = true
    error.value = null
    try {
      const response = await cvService.createCv(data)
      cvs.value.push(response.data.data)
      currentCv.value = response.data.data
      return response.data.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to create CV'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateCv(id, data) {
    loading.value = true
    error.value = null
    try {
      const response = await cvService.updateCv(id, data)
      const index = cvs.value.findIndex(cv => cv.id === id)
      if (index !== -1) cvs.value[index] = response.data.data
      if (currentCv.value?.id === id) currentCv.value = response.data.data
      return response.data.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to update CV'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteCv(id) {
    loading.value = true
    error.value = null
    try {
      await cvService.deleteCv(id)
      cvs.value = cvs.value.filter(cv => cv.id !== id)
      if (currentCv.value?.id === id) currentCv.value = null
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to delete CV'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function duplicateCv(id) {
    loading.value = true
    error.value = null
    try {
      const response = await cvService.duplicateCv(id)
      cvs.value.push(response.data.data)
      return response.data.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to duplicate CV'
      throw err
    } finally {
      loading.value = false
    }
  }

  function setCurrentCv(cv) {
    currentCv.value = cv ? { ...cv } : null
  }

  function updateCurrentCv(data) {
    if (currentCv.value) {
      currentCv.value = { ...currentCv.value, ...data }
    }
  }

  return {
    cvs,
    currentCv,
    loading,
    error,
    totalCvs,
    fetchCvs,
    fetchCv,
    createCv,
    updateCv,
    deleteCv,
    duplicateCv,
    setCurrentCv,
    updateCurrentCv
  }
})
