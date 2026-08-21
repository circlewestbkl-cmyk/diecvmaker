import { defineStore } from 'pinia'
import { ref } from 'vue'
import templateService from '@/services/templateService'

export const useTemplateStore = defineStore('template', () => {
  const templates = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function fetchTemplates() {
    loading.value = true
    error.value = null
    try {
      const response = await templateService.getTemplates()
      templates.value = response.data.data || []
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to load templates'
    } finally {
      loading.value = false
    }
  }

  return { templates, loading, error, fetchTemplates }
})
