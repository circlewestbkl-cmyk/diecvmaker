import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import coverLetterService from '@/services/coverLetterService'

export const useCoverLetterStore = defineStore('coverLetter', () => {
  const letters = ref([])
  const currentLetter = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const totalLetters = computed(() => letters.value.length)

  async function fetchLetters() {
    loading.value = true
    error.value = null
    try {
      const response = await coverLetterService.getCoverLetters()
      letters.value = response.data.data || []
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to load cover letters'
    } finally {
      loading.value = false
    }
  }

  async function createLetter(data) {
    loading.value = true
    error.value = null
    try {
      const response = await coverLetterService.createCoverLetter(data)
      letters.value.push(response.data.data)
      currentLetter.value = response.data.data
      return response.data.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to create cover letter'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateLetter(id, data) {
    loading.value = true
    error.value = null
    try {
      const response = await coverLetterService.updateCoverLetter(id, data)
      const index = letters.value.findIndex(l => l.id === id)
      if (index !== -1) letters.value[index] = response.data.data
      if (currentLetter.value?.id === id) currentLetter.value = response.data.data
      return response.data.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to update'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteLetter(id) {
    loading.value = true
    error.value = null
    try {
      await coverLetterService.deleteCoverLetter(id)
      letters.value = letters.value.filter(l => l.id !== id)
      if (currentLetter.value?.id === id) currentLetter.value = null
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to delete'
      throw err
    } finally {
      loading.value = false
    }
  }

  return { letters, currentLetter, loading, error, totalLetters, fetchLetters, createLetter, updateLetter, deleteLetter }
})
