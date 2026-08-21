import { defineStore } from 'pinia'
import { ref } from 'vue'
import aiService from '@/services/aiService'

export const useInterviewStore = defineStore('interview', () => {
  const questions = ref([])
  const currentIndex = ref(0)
  const evaluations = ref([])
  const loading = ref(false)
  const error = ref(null)
  const selectedRole = ref('')
  const selectedSkills = ref('')

  async function generateQuestions(role, skills) {
    loading.value = true
    error.value = null
    try {
      const response = await aiService.generateInterviewQuestions({ role, skills })
      const raw = response.data.data.questions || response.data.data
      // Parse questions from AI response (could be text or array)
      const parsed = parseQuestions(raw)
      questions.value = parsed
      currentIndex.value = 0
      evaluations.value = []
      selectedRole.value = role
      selectedSkills.value = skills
      return parsed
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to generate questions'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function evaluateAnswer(question, answer) {
    loading.value = true
    error.value = null
    try {
      const response = await aiService.evaluateAnswer({ question, answer })
      const evaluation = response.data.data.evaluation || response.data.data
      evaluations.value.push({
        question,
        answer,
        evaluation,
        timestamp: new Date().toISOString()
      })
      return evaluation
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to evaluate answer'
      throw err
    } finally {
      loading.value = false
    }
  }

  function nextQuestion() {
    if (currentIndex.value < questions.value.length - 1) {
      currentIndex.value++
    }
  }

  function prevQuestion() {
    if (currentIndex.value > 0) {
      currentIndex.value--
    }
  }

  function reset() {
    questions.value = []
    currentIndex.value = 0
    evaluations.value = []
    loading.value = false
    error.value = null
    selectedRole.value = ''
    selectedSkills.value = ''
  }

  function parseQuestions(raw) {
    if (Array.isArray(raw)) return raw
    if (typeof raw !== 'string') return [{ text: String(raw), category: 'General' }]
    // Parse numbered questions from text
    const lines = raw.split('\n').filter(l => l.trim())
    const parsed = []
    let currentCategory = 'General'
    for (const line of lines) {
      const trimmed = line.trim()
      // Detect category headers
      if (/^(behavioral|technical|hr|star|situational|general)/i.test(trimmed)) {
        currentCategory = trimmed.replace(/^[\d.\s)]:-]+/, '').trim()
        continue
      }
      // Match numbered questions like "1." "2)" "- 3."
      const match = trimmed.match(/^[\d.\)\-\*]+\s*(.+)/)
      if (match) {
        const text = match[1].trim()
        if (text.length > 10) {
          parsed.push({ text, category: currentCategory })
        }
      } else if (trimmed.length > 15 && !trimmed.startsWith('#')) {
        parsed.push({ text: trimmed, category: currentCategory })
      }
    }
    return parsed.length > 0 ? parsed : [{ text: raw, category: 'General' }]
  }

  return {
    questions,
    currentIndex,
    evaluations,
    loading,
    error,
    selectedRole,
    selectedSkills,
    generateQuestions,
    evaluateAnswer,
    nextQuestion,
    prevQuestion,
    reset
  }
})
