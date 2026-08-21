import { defineStore } from 'pinia'
import { ref } from 'vue'
import atsService from '@/services/atsService'

export const useAtsStore = defineStore('ats', () => {
  const result = ref(null)
  const keywordResult = ref(null)
  const loading = ref(false)
  const error = ref(null)

  async function analyzeCv(data) {
    loading.value = true
    error.value = null
    try {
      const response = await atsService.analyzeCv(data)
      result.value = response.data.data
      return response.data.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Analysis failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function analyzeKeywords(data) {
    loading.value = true
    error.value = null
    try {
      const response = await atsService.analyzeKeywords(data)
      keywordResult.value = response.data.data
      return response.data.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Keyword analysis failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  function reset() {
    result.value = null
    keywordResult.value = null
    error.value = null
  }

  return { result, keywordResult, loading, error, analyzeCv, analyzeKeywords, reset }
})
