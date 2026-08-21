<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-2xl font-bold text-slate-900">Job Matcher</h2>
      <p class="text-slate-500 mt-1">See how well your CV matches a specific job description.</p>
    </div>

    <!-- Input -->
    <div class="card p-6 space-y-4">
      <div>
        <label class="block text-sm font-medium text-slate-700 mb-1.5">Select Your CV</label>
        <select v-model="selectedCvId" class="input-field">
          <option value="">Choose a CV...</option>
          <option v-for="cv in cvStore.cvs" :key="cv.id" :value="cv.id">{{ cv.title }}</option>
        </select>
      </div>
      <div>
        <label class="block text-sm font-medium text-slate-700 mb-1.5">Job Description</label>
        <textarea v-model="jobDescription" class="input-field" rows="8" placeholder="Paste the full job description here..." />
      </div>
      <button @click="analyze" class="btn-primary" :disabled="!selectedCvId || !jobDescription || loading">
        <Loader2 v-if="loading" class="w-4 h-4 animate-spin mr-2" />
        <Target v-else class="w-4 h-4 mr-2" />
        {{ loading ? 'Analyzing...' : 'Analyze Match' }}
      </button>
    </div>

    <!-- Results -->
    <div v-if="result" class="space-y-6">
      <!-- Match Score -->
      <div class="card p-8 text-center">
        <div class="inline-flex items-center justify-center w-32 h-32 rounded-full mb-4" :class="scoreColor(result.matchScore)">
          <span class="text-4xl font-bold text-white">{{ result.matchScore }}%</span>
        </div>
        <h3 class="text-xl font-bold text-slate-900">Match Score</h3>
        <p class="text-slate-500 mt-1">{{ scoreLabel(result.matchScore) }}</p>
      </div>

      <!-- Breakdown -->
      <div class="grid sm:grid-cols-2 gap-4">
        <div class="card p-5">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium text-slate-600">Experience Match</span>
            <span class="text-sm font-bold text-indigo-600">{{ result.experienceMatch }}%</span>
          </div>
          <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div class="h-full bg-indigo-500 rounded-full" :style="{ width: result.experienceMatch + '%' }" />
          </div>
        </div>
        <div class="card p-5">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium text-slate-600">Education Match</span>
            <span class="text-sm font-bold text-indigo-600">{{ result.educationMatch }}%</span>
          </div>
          <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div class="h-full bg-indigo-500 rounded-full" :style="{ width: result.educationMatch + '%' }" />
          </div>
        </div>
      </div>

      <!-- Skills -->
      <div class="grid sm:grid-cols-2 gap-6">
        <div class="card p-6">
          <h3 class="font-semibold text-emerald-600 mb-3 flex items-center gap-2">
            <CheckCircle class="w-5 h-5" /> Matched Skills ({{ result.matchedSkills?.length }})
          </h3>
          <div class="flex flex-wrap gap-2">
            <span v-for="s in result.matchedSkills" :key="s.name" class="px-3 py-1 bg-emerald-50 text-emerald-700 text-sm rounded-full">
              {{ s.name }}
            </span>
            <span v-if="!result.matchedSkills?.length" class="text-sm text-slate-400">No matching skills found</span>
          </div>
        </div>
        <div class="card p-6">
          <h3 class="font-semibold text-red-600 mb-3 flex items-center gap-2">
            <XCircle class="w-5 h-5" /> Missing Skills ({{ result.missingSkills?.length }})
          </h3>
          <div class="flex flex-wrap gap-2">
            <span v-for="s in result.missingSkills" :key="s.name" class="px-3 py-1 bg-red-50 text-red-700 text-sm rounded-full">
              {{ s.name }}
            </span>
          </div>
        </div>
      </div>

      <!-- Recommendations -->
      <div v-if="result.recommendations?.length" class="card p-6">
        <h3 class="text-lg font-semibold text-slate-800 mb-3">Recommendations</h3>
        <ul class="space-y-2">
          <li v-for="(rec, i) in result.recommendations" :key="i" class="flex items-start gap-2 text-sm text-slate-700">
            <Lightbulb class="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
            {{ rec }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useCvStore } from '@/stores/cvStore'
import jobService from '@/services/jobService'
import { Target, Loader2, CheckCircle, XCircle, Lightbulb } from 'lucide-vue-next'

const cvStore = useCvStore()
const selectedCvId = ref('')
const jobDescription = ref('')
const loading = ref(false)
const result = ref(null)

onMounted(() => { cvStore.fetchCvs() })

async function analyze() {
  loading.value = true
  try {
    const response = await jobService.analyzeMatch({
      cvId: selectedCvId.value,
      jobDescription: jobDescription.value
    })
    result.value = response.data.data
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

function scoreColor(score) {
  if (score >= 80) return 'bg-emerald-500'
  if (score >= 60) return 'bg-amber-500'
  return 'bg-red-500'
}

function scoreLabel(score) {
  if (score >= 80) return 'Excellent match! Your CV is well-aligned with this job.'
  if (score >= 60) return 'Good match. Consider adding the missing skills.'
  if (score >= 40) return 'Moderate match. Significant tailoring recommended.'
  return 'Low match. Your CV needs substantial updates for this role.'
}
</script>
