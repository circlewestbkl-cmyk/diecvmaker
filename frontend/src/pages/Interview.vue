<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h2 class="text-2xl font-bold text-slate-900">Interview Preparation</h2>
      <p class="text-slate-500 mt-1">Practice with AI-powered interview questions tailored to your role.</p>
    </div>

    <!-- Setup Screen -->
    <div v-if="interviewStore.questions.length === 0" class="space-y-6">
      <!-- Role Selection -->
      <div class="card p-6">
        <h3 class="text-lg font-semibold text-slate-800 mb-4">Select Your Target Role</h3>
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <button
            v-for="role in roles"
            :key="role.value"
            @click="selectedRole = role.value"
            class="flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left"
            :class="selectedRole === role.value ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:border-slate-300'"
          >
            <div class="w-10 h-10 rounded-xl flex items-center justify-center" :class="role.bg">
              <component :is="role.icon" class="w-5 h-5" :class="role.color" />
            </div>
            <div>
              <p class="font-medium text-slate-800 text-sm">{{ role.label }}</p>
              <p class="text-xs text-slate-400">{{ role.desc }}</p>
            </div>
          </button>
        </div>
      </div>

      <!-- Skills Input -->
      <div class="card p-6">
        <h3 class="text-lg font-semibold text-slate-800 mb-4">Your Skills</h3>
        <p class="text-sm text-slate-500 mb-3">Enter your key skills (comma-separated) for more targeted questions.</p>
        <input
          v-model="selectedSkills"
          type="text"
          class="input-field"
          placeholder="e.g. JavaScript, Vue.js, Node.js, React, Python"
        />
      </div>

      <!-- Generate Button -->
      <button
        @click="handleGenerate"
        class="btn-primary w-full py-3"
        :disabled="!selectedRole || interviewStore.loading"
      >
        <Loader2 v-if="interviewStore.loading" class="w-5 h-5 animate-spin mr-2 inline" />
        {{ interviewStore.loading ? 'Generating Questions...' : 'Start Interview Practice' }}
      </button>

      <p v-if="interviewStore.error" class="text-red-500 text-sm text-center">{{ interviewStore.error }}</p>
    </div>

    <!-- Practice Screen -->
    <div v-else class="space-y-6">
      <!-- Progress Bar -->
      <div class="card p-4">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium text-slate-600">
            Question {{ interviewStore.currentIndex + 1 }} of {{ interviewStore.questions.length }}
          </span>
          <div class="flex items-center gap-2">
            <span class="text-xs px-2 py-1 rounded-full font-medium"
              :class="currentQuestion?.category === 'Technical' ? 'bg-blue-100 text-blue-700' :
                      currentQuestion?.category === 'Behavioral' ? 'bg-amber-100 text-amber-700' :
                      'bg-slate-100 text-slate-600'"
            >
              {{ currentQuestion?.category || 'General' }}
            </span>
          </div>
        </div>
        <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            class="h-full bg-indigo-600 rounded-full transition-all duration-500"
            :style="{ width: ((interviewStore.currentIndex + 1) / interviewStore.questions.length * 100) + '%' }"
          />
        </div>
      </div>

      <!-- Question Card -->
      <div class="card p-6">
        <div class="flex items-start gap-3 mb-6">
          <div class="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center shrink-0">
            <HelpCircle class="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <p class="text-xs text-slate-400 mb-1">Interview Question</p>
            <p class="text-lg text-slate-900 font-medium leading-relaxed">
              {{ currentQuestion?.text }}
            </p>
          </div>
        </div>

        <!-- Answer Input -->
        <div v-if="!currentEvaluation">
          <label class="block text-sm font-medium text-slate-700 mb-2">Your Answer</label>
          <textarea
            v-model="answer"
            class="input-field min-h-[150px] resize-y"
            placeholder="Type your answer here... Be specific and use examples where possible."
          />
          <div class="flex gap-3 mt-4">
            <button
              @click="handleSubmitAnswer"
              class="btn-primary"
              :disabled="!answer.trim() || interviewStore.loading"
            >
              <Loader2 v-if="interviewStore.loading" class="w-4 h-4 animate-spin mr-2 inline" />
              {{ interviewStore.loading ? 'Evaluating...' : 'Submit Answer' }}
            </button>
            <button
              @click="handleSkip"
              class="btn-secondary"
            >
              Skip
            </button>
          </div>
        </div>

        <!-- Evaluation Result -->
        <div v-else class="space-y-4">
          <div class="p-4 bg-slate-50 rounded-xl">
            <p class="text-sm text-slate-600 mb-2 font-medium">Your Answer:</p>
            <p class="text-sm text-slate-700">{{ answer }}</p>
          </div>

          <div class="p-4 rounded-xl" :class="evaluationScore >= 7 ? 'bg-green-50 border border-green-200' :
                                                 evaluationScore >= 5 ? 'bg-amber-50 border border-amber-200' :
                                                 'bg-red-50 border border-red-200'">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                :class="evaluationScore >= 7 ? 'bg-green-500' : evaluationScore >= 5 ? 'bg-amber-500' : 'bg-red-500'"
              >
                {{ evaluationScore }}
              </div>
              <div>
                <p class="font-semibold text-slate-800">Score: {{ evaluationScore }}/10</p>
                <p class="text-sm text-slate-500">
                  {{ evaluationScore >= 7 ? 'Great answer!' : evaluationScore >= 5 ? 'Good, but room for improvement' : 'Needs improvement' }}
                </p>
              </div>
            </div>
          </div>

          <div v-if="parsedEvaluation" class="space-y-3">
            <div v-if="parsedEvaluation.good" class="p-4 bg-green-50 rounded-xl">
              <p class="text-sm font-semibold text-green-700 mb-1">✅ What's Good</p>
              <p class="text-sm text-green-600">{{ parsedEvaluation.good }}</p>
            </div>
            <div v-if="parsedEvaluation.improve" class="p-4 bg-amber-50 rounded-xl">
              <p class="text-sm font-semibold text-amber-700 mb-1">⚠️ What to Improve</p>
              <p class="text-sm text-amber-600">{{ parsedEvaluation.improve }}</p>
            </div>
            <div v-if="parsedEvaluation.sample" class="p-4 bg-indigo-50 rounded-xl">
              <p class="text-sm font-semibold text-indigo-700 mb-1">💡 Sample Better Answer</p>
              <p class="text-sm text-indigo-600">{{ parsedEvaluation.sample }}</p>
            </div>
          </div>

          <!-- Raw evaluation if parsing fails -->
          <div v-if="!parsedEvaluation && currentEvaluation" class="p-4 bg-slate-50 rounded-xl">
            <p class="text-sm font-semibold text-slate-700 mb-1">Evaluation</p>
            <p class="text-sm text-slate-600 whitespace-pre-line">{{ typeof currentEvaluation === 'string' ? currentEvaluation : JSON.stringify(currentEvaluation) }}</p>
          </div>

          <button
            v-if="interviewStore.currentIndex < interviewStore.questions.length - 1"
            @click="goNext"
            class="btn-primary w-full"
          >
            Next Question
            <ArrowRight class="w-4 h-4 ml-2 inline" />
          </button>
          <button v-else @click="showSummary = true" class="btn-primary w-full">
            View Summary
            <Trophy class="w-4 h-4 ml-2 inline" />
          </button>
        </div>
      </div>

      <!-- Navigation -->
      <div v-if="!currentEvaluation" class="flex items-center justify-between">
        <button
          @click="interviewStore.prevQuestion()"
          :disabled="interviewStore.currentIndex === 0"
          class="btn-secondary"
          :class="{ 'opacity-50 cursor-not-allowed': interviewStore.currentIndex === 0 }"
        >
          <ArrowLeft class="w-4 h-4 mr-2 inline" />
          Previous
        </button>
        <button
          @click="showSummary = true"
          class="text-sm text-slate-500 hover:text-slate-700"
        >
          End Session
        </button>
      </div>

      <!-- Summary Modal -->
      <div v-if="showSummary" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto p-6">
          <div class="text-center mb-6">
            <div class="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy class="w-8 h-8 text-indigo-600" />
            </div>
            <h3 class="text-xl font-bold text-slate-900">Interview Practice Summary</h3>
            <p class="text-slate-500 mt-1">{{ interviewStore.questions.length }} questions completed</p>
          </div>

          <div class="space-y-4 mb-6">
            <div class="grid grid-cols-3 gap-3 text-center">
              <div class="p-3 bg-green-50 rounded-xl">
                <p class="text-2xl font-bold text-green-600">{{ evaluationsWithScore.filter(e => e.score >= 7).length }}</p>
                <p class="text-xs text-green-600">Great</p>
              </div>
              <div class="p-3 bg-amber-50 rounded-xl">
                <p class="text-2xl font-bold text-amber-600">{{ evaluationsWithScore.filter(e => e.score >= 5 && e.score < 7).length }}</p>
                <p class="text-xs text-amber-600">Good</p>
              </div>
              <div class="p-3 bg-red-50 rounded-xl">
                <p class="text-2xl font-bold text-red-600">{{ evaluationsWithScore.filter(e => e.score < 5).length }}</p>
                <p class="text-xs text-red-600">Needs Work</p>
              </div>
            </div>

            <div v-if="averageScore > 0" class="p-4 bg-slate-50 rounded-xl text-center">
              <p class="text-sm text-slate-500">Average Score</p>
              <p class="text-3xl font-bold text-slate-900">{{ averageScore.toFixed(1) }}/10</p>
            </div>
          </div>

          <div class="flex gap-3">
            <button @click="showSummary = false; handleRestart()" class="btn-primary flex-1">
              Practice Again
            </button>
            <button @click="showSummary = false" class="btn-secondary flex-1">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useInterviewStore } from '@/stores/interviewStore'
import {
  MessageSquare, HelpCircle, ArrowRight, ArrowLeft, Trophy,
  Loader2, Code, Briefcase, Users, Brain
} from 'lucide-vue-next'

const interviewStore = useInterviewStore()

const selectedRole = ref('')
const selectedSkills = ref('')
const answer = ref('')
const showSummary = ref(false)

const roles = [
  { value: 'Frontend Developer', label: 'Frontend Developer', desc: 'Vue, React, CSS', icon: Code, bg: 'bg-blue-50', color: 'text-blue-600' },
  { value: 'Backend Developer', label: 'Backend Developer', desc: 'Node.js, Python, APIs', icon: Code, bg: 'bg-emerald-50', color: 'text-emerald-600' },
  { value: 'Full Stack Developer', label: 'Full Stack Developer', desc: 'End-to-end development', icon: Brain, bg: 'bg-indigo-50', color: 'text-indigo-600' },
  { value: 'Project Manager', label: 'Project Manager', desc: 'Leadership, Agile', icon: Briefcase, bg: 'bg-amber-50', color: 'text-amber-600' },
  { value: 'Data Scientist', label: 'Data Scientist', desc: 'ML, Analytics', icon: Brain, bg: 'bg-purple-50', color: 'text-purple-600' },
  { value: 'Software Engineer', label: 'Software Engineer', desc: 'General engineering', icon: Code, bg: 'bg-rose-50', color: 'text-rose-600' },
]

const currentQuestion = computed(() => interviewStore.questions[interviewStore.currentIndex] || null)

const currentEvaluation = computed(() => {
  const ev = interviewStore.evaluations.find(
    e => e.question === currentQuestion.value?.text
  )
  return ev?.evaluation || null
})

const evaluationScore = computed(() => {
  if (!currentEvaluation.value) return 0
  if (typeof currentEvaluation.value === 'object') return currentEvaluation.value.score || 0
  // Try to extract score from text
  const match = String(currentEvaluation.value).match(/(\d+)\s*(?:\/\s*10|out of 10|\/10)/i)
  if (match) return parseInt(match[1])
  // Look for "Score: X"
  const scoreMatch = String(currentEvaluation.value).match(/score[:\s]*(\d+)/i)
  if (scoreMatch) return parseInt(scoreMatch[1])
  return 7 // Default score
})

const parsedEvaluation = computed(() => {
  if (!currentEvaluation.value) return null
  if (typeof currentEvaluation.value === 'object') {
    return {
      good: currentEvaluation.value.good || currentEvaluation.value.strengths,
      improve: currentEvaluation.value.improve || currentEvaluation.value.improvements || currentEvaluation.value.weaknesses,
      sample: currentEvaluation.value.sample || currentEvaluation.value.sampleAnswer || currentEvaluation.value.sample_answer
    }
  }
  // Parse from text
  const text = String(currentEvaluation.value)
  const goodMatch = text.match(/(?:what'?s good|strengths?|good)[\s:]+(.+?)(?=\n|$)/i)
  const improveMatch = text.match(/(?:what to improve|improvements?|weaknesses?)[\s:]+(.+?)(?=\n|$)/i)
  const sampleMatch = text.match(/(?:sample|better answer|improved)[\s:]+(.+?)(?=\n|$)/i)
  return {
    good: goodMatch?.[1]?.trim() || null,
    improve: improveMatch?.[1]?.trim() || null,
    sample: sampleMatch?.[1]?.trim() || null
  }
})

const evaluationsWithScore = computed(() => {
  return interviewStore.evaluations.map(e => {
    const ev = e.evaluation
    let score = 0
    if (typeof ev === 'object') score = ev.score || 0
    else {
      const match = String(ev).match(/(\d+)\s*(?:\/\s*10|out of 10)/i)
      score = match ? parseInt(match[1]) : 7
    }
    return { ...e, score }
  })
})

const averageScore = computed(() => {
  const scores = evaluationsWithScore.value.map(e => e.score).filter(s => s > 0)
  return scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0
})

async function handleGenerate() {
  answer.value = ''
  await interviewStore.generateQuestions(selectedRole.value, selectedSkills.value)
}

async function handleSubmitAnswer() {
  if (!answer.value.trim()) return
  await interviewStore.evaluateAnswer(currentQuestion.value.text, answer.value)
}

function handleSkip() {
  answer.value = ''
  if (interviewStore.currentIndex < interviewStore.questions.length - 1) {
    interviewStore.nextQuestion()
  } else {
    showSummary.value = true
  }
}

function goNext() {
  answer.value = ''
  interviewStore.nextQuestion()
}

function handleRestart() {
  interviewStore.reset()
  selectedRole.value = ''
  selectedSkills.value = ''
  answer.value = ''
}
</script>
