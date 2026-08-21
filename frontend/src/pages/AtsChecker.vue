<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-2xl font-bold text-slate-900">ATS Checker</h2>
      <p class="text-slate-500 mt-1">Analyze your CV against Applicant Tracking Systems.</p>
    </div>

    <!-- Input Methods -->
    <div class="grid lg:grid-cols-3 gap-6">
      <!-- Method 1: Use existing CV -->
      <div class="card p-6">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
            <FileText class="w-5 h-5 text-indigo-600" />
          </div>
          <h3 class="font-semibold text-slate-800">Use My CV</h3>
        </div>
        <select v-model="selectedCvId" class="input-field mb-3">
          <option value="">Select a CV...</option>
          <option v-for="cv in cvStore.cvs" :key="cv.id" :value="cv.id">{{ cv.title }}</option>
        </select>
        <button @click="analyzeWithCv" class="btn-primary w-full" :disabled="!selectedCvId || atsStore.loading">
          <Loader2 v-if="atsStore.loading" class="w-4 h-4 animate-spin mr-2" />
          Analyze CV
        </button>
      </div>

      <!-- Method 2: Paste text -->
      <div class="card p-6">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
            <AlignLeft class="w-5 h-5 text-emerald-600" />
          </div>
          <h3 class="font-semibold text-slate-800">Paste CV Text</h3>
        </div>
        <textarea v-model="cvText" class="input-field mb-3" rows="5" placeholder="Paste your CV text here..." />
        <button @click="analyzeWithText" class="btn-primary w-full" :disabled="!cvText || atsStore.loading">
          <Loader2 v-if="atsStore.loading" class="w-4 h-4 animate-spin mr-2" />
          Analyze Text
        </button>
      </div>

      <!-- Method 3: Job Description Match -->
      <div class="card p-6">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
            <Target class="w-5 h-5 text-amber-600" />
          </div>
          <h3 class="font-semibold text-slate-800">Keyword Match</h3>
        </div>
        <select v-model="kwSelectedCvId" class="input-field mb-3">
          <option value="">Select a CV...</option>
          <option v-for="cv in cvStore.cvs" :key="cv.id" :value="cv.id">{{ cv.title }}</option>
        </select>
        <textarea v-model="jobDescription" class="input-field mb-3" rows="3" placeholder="Paste job description..." />
        <button @click="analyzeKeywords" class="btn-primary w-full" :disabled="!kwSelectedCvId || !jobDescription || atsStore.loading">
          <Loader2 v-if="atsStore.loading" class="w-4 h-4 animate-spin mr-2" />
          Match Keywords
        </button>
      </div>
    </div>

    <!-- ATS Score Results -->
    <div v-if="atsStore.result" class="space-y-6">
      <!-- Overall Score -->
      <div class="card p-8 text-center">
        <div class="inline-flex items-center justify-center w-32 h-32 rounded-full mb-4" :class="scoreColor(atsStore.result.score)">
          <span class="text-4xl font-bold text-white">{{ atsStore.result.score }}</span>
        </div>
        <h3 class="text-xl font-bold text-slate-900">ATS Score</h3>
        <p class="text-slate-500 mt-1">{{ scoreLabel(atsStore.result.score) }}</p>
      </div>

      <!-- Score Breakdown -->
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="item in scoreBreakdown" :key="item.label" class="card p-5">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium text-slate-600">{{ item.label }}</span>
            <span class="text-sm font-bold" :class="item.score >= 70 ? 'text-emerald-600' : item.score >= 40 ? 'text-amber-600' : 'text-red-600'">
              {{ item.score }}%
            </span>
          </div>
          <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div class="h-full rounded-full transition-all duration-700" :class="item.score >= 70 ? 'bg-emerald-500' : item.score >= 40 ? 'bg-amber-500' : 'bg-red-500'" :style="{ width: item.score + '%' }" />
          </div>
        </div>
      </div>

      <!-- Recommendations -->
      <div v-if="atsStore.result.recommendations?.length" class="card p-6">
        <h3 class="text-lg font-semibold text-slate-800 mb-3">Recommendations</h3>
        <ul class="space-y-2">
          <li v-for="(rec, i) in atsStore.result.recommendations" :key="i" class="flex items-start gap-2 text-sm text-slate-700">
            <Lightbulb class="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
            {{ rec }}
          </li>
        </ul>
      </div>

      <!-- Details -->
      <div v-if="atsStore.result.details" class="card p-6">
        <h3 class="text-lg font-semibold text-slate-800 mb-3">Detailed Analysis</h3>
        <div class="space-y-4">
          <div v-for="(items, category) in atsStore.result.details" :key="category">
            <h4 class="text-sm font-semibold text-slate-600 uppercase mb-1">{{ category }}</h4>
            <ul class="space-y-0.5">
              <li v-for="(item, i) in items" :key="i" class="text-sm text-slate-600 flex items-center gap-1">
                <span :class="item.startsWith('✓') ? 'text-emerald-500' : item.startsWith('✗') ? 'text-red-500' : 'text-amber-500'">
                  {{ item.charAt(0) }}
                </span>
                {{ item.slice(2) }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Keyword Match Results -->
    <div v-if="atsStore.keywordResult" class="space-y-6">
      <div class="card p-8 text-center">
        <div class="inline-flex items-center justify-center w-32 h-32 rounded-full mb-4" :class="scoreColor(atsStore.keywordResult.keywordScore)">
          <span class="text-4xl font-bold text-white">{{ atsStore.keywordResult.keywordScore }}</span>
        </div>
        <h3 class="text-xl font-bold text-slate-900">Keyword Match Score</h3>
      </div>

      <div class="grid sm:grid-cols-2 gap-6">
        <div class="card p-6">
          <h3 class="font-semibold text-emerald-600 mb-3 flex items-center gap-2">
            <CheckCircle class="w-5 h-5" /> Matched Keywords ({{ atsStore.keywordResult.matchedKeywords?.length }})
          </h3>
          <div class="flex flex-wrap gap-2">
            <span v-for="kw in atsStore.keywordResult.matchedKeywords" :key="kw" class="px-3 py-1 bg-emerald-50 text-emerald-700 text-sm rounded-full">
              {{ kw }}
            </span>
          </div>
        </div>
        <div class="card p-6">
          <h3 class="font-semibold text-red-600 mb-3 flex items-center gap-2">
            <XCircle class="w-5 h-5" /> Missing Keywords ({{ atsStore.keywordResult.missingKeywords?.length }})
          </h3>
          <div class="flex flex-wrap gap-2">
            <span v-for="kw in atsStore.keywordResult.missingKeywords" :key="kw" class="px-3 py-1 bg-red-50 text-red-700 text-sm rounded-full">
              {{ kw }}
            </span>
          </div>
        </div>
      </div>

      <div v-if="atsStore.keywordResult.recommendations?.length" class="card p-6">
        <h3 class="text-lg font-semibold text-slate-800 mb-3">Recommendations</h3>
        <ul class="space-y-2">
          <li v-for="(rec, i) in atsStore.keywordResult.recommendations" :key="i" class="flex items-start gap-2 text-sm text-slate-700">
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
import { useAtsStore } from '@/stores/atsStore'
import { FileText, AlignLeft, Target, Loader2, Lightbulb, CheckCircle, XCircle } from 'lucide-vue-next'

const cvStore = useCvStore()
const atsStore = useAtsStore()

const selectedCvId = ref('')
const cvText = ref('')
const kwSelectedCvId = ref('')
const jobDescription = ref('')

onMounted(() => {
  cvStore.fetchCvs()
})

async function analyzeWithCv() {
  await atsStore.analyzeCv({ cvId: selectedCvId.value })
}

async function analyzeWithText() {
  await atsStore.analyzeCv({ cvText: cvText.value })
}

async function analyzeKeywords() {
  const cv = cvStore.cvs.find(c => c.id === kwSelectedCvId.value)
  if (!cv) return
  const fullText = [
    cv.personal?.fullName, cv.summary,
    ...(cv.experiences || []).map(e => `${e.position} ${e.company} ${e.description} ${(e.achievements || []).join(' ')}`),
    ...(cv.skills || []).map(s => s.name),
  ].filter(Boolean).join(' ')
  await atsStore.analyzeKeywords({ cvText: fullText, jobDescription: jobDescription.value })
}

function scoreColor(score) {
  if (score >= 80) return 'bg-emerald-500'
  if (score >= 60) return 'bg-amber-500'
  if (score >= 40) return 'bg-orange-500'
  return 'bg-red-500'
}

function scoreLabel(score) {
  if (score >= 90) return 'Excellent! Your CV is highly ATS-friendly.'
  if (score >= 75) return 'Good. Minor improvements could help.'
  if (score >= 50) return 'Fair. Some improvements needed.'
  return 'Needs work. Follow the recommendations below.'
}

const scoreBreakdown = ref([])

// Watch for result changes
import { watch } from 'vue'
watch(() => atsStore.result, (r) => {
  if (r) {
    scoreBreakdown.value = [
      { label: 'Contact Info', score: r.contactScore },
      { label: 'Formatting', score: r.formattingScore },
      { label: 'Experience', score: r.experienceScore },
      { label: 'Skills', score: r.skillsScore },
      { label: 'Education', score: r.educationScore },
      { label: 'Summary', score: r.summaryScore },
    ]
  }
})
</script>
