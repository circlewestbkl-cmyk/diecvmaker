<template>
  <div class="min-h-screen bg-slate-50">
    <!-- Top bar -->
    <header class="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-slate-200">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center">
              <FileText class="w-5 h-5 text-white" />
            </div>
            <span class="text-xl font-bold text-slate-800">CVForge</span>
          </div>
          <div class="flex items-center gap-3">
            <button
              v-if="cv"
              @click="downloadPdf"
              class="btn-primary text-sm"
              :disabled="downloading"
            >
              <Download class="w-4 h-4 mr-2 inline" />
              {{ downloading ? 'Downloading...' : 'Download PDF' }}
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <Loader2 class="w-8 h-8 animate-spin text-indigo-600" />
    </div>

    <!-- Error -->
    <div v-else-if="error" class="max-w-md mx-auto py-20 text-center">
      <div class="card p-8">
        <AlertCircle class="w-12 h-12 text-red-400 mx-auto mb-4" />
        <h2 class="text-xl font-bold text-slate-900 mb-2">CV Not Found</h2>
        <p class="text-slate-500">{{ error }}</p>
        <router-link to="/" class="btn-primary mt-6 inline-block">
          Go to CVForge
        </router-link>
      </div>
    </div>

    <!-- CV Content -->
    <div v-else-if="cv" class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Personal Info -->
      <div class="card p-8 mb-6">
        <div class="text-center mb-6">
          <div class="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span class="text-2xl font-bold text-indigo-600">{{ userInitials }}</span>
          </div>
          <h1 class="text-3xl font-bold text-slate-900">{{ cv.personal?.fullName || 'Untitled' }}</h1>
          <p v-if="cv.personal?.professionalTitle" class="text-lg text-indigo-600 mt-1">
            {{ cv.personal.professionalTitle }}
          </p>
          <div class="flex items-center justify-center gap-4 mt-3 text-sm text-slate-500 flex-wrap">
            <span v-if="cv.personal?.email" class="flex items-center gap-1">
              <Mail class="w-4 h-4" /> {{ cv.personal.email }}
            </span>
            <span v-if="cv.personal?.phone" class="flex items-center gap-1">
              <Phone class="w-4 h-4" /> {{ cv.personal.phone }}
            </span>
            <span v-if="cv.personal?.location" class="flex items-center gap-1">
              <MapPin class="w-4 h-4" /> {{ cv.personal.location }}
            </span>
          </div>
          <div class="flex items-center justify-center gap-3 mt-3">
            <a v-if="cv.personal?.website" :href="cv.personal.website" target="_blank" class="text-indigo-600 hover:text-indigo-700">
              <Globe class="w-4 h-4" />
            </a>
            <a v-if="cv.personal?.linkedin" :href="cv.personal.linkedin" target="_blank" class="text-indigo-600 hover:text-indigo-700">
              <Linkedin class="w-4 h-4" />
            </a>
            <a v-if="cv.personal?.github" :href="cv.personal.github" target="_blank" class="text-indigo-600 hover:text-indigo-700">
              <Github class="w-4 h-4" />
            </a>
          </div>
        </div>

        <!-- Summary -->
        <div v-if="cv.summary" class="p-4 bg-slate-50 rounded-xl">
          <p class="text-sm text-slate-700 leading-relaxed">{{ cv.summary }}</p>
        </div>
      </div>

      <!-- Experience -->
      <div v-if="cv.experiences?.length" class="card p-8 mb-6">
        <h2 class="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Briefcase class="w-5 h-5 text-indigo-600" /> Experience
        </h2>
        <div class="space-y-6">
          <div v-for="exp in cv.experiences" :key="exp.id" class="relative pl-6 border-l-2 border-indigo-200">
            <div class="absolute -left-1.5 top-0 w-3 h-3 bg-indigo-500 rounded-full" />
            <div class="flex items-start justify-between">
              <div>
                <h3 class="font-semibold text-slate-900">{{ exp.position }}</h3>
                <p class="text-indigo-600 font-medium text-sm">{{ exp.company }}</p>
                <p class="text-xs text-slate-400 mt-0.5">{{ exp.location }}</p>
              </div>
              <span class="text-xs text-slate-400 whitespace-nowrap">
                {{ formatDateRange(exp.startDate, exp.endDate, exp.current) }}
              </span>
            </div>
            <p v-if="exp.description" class="text-sm text-slate-600 mt-2">{{ exp.description }}</p>
            <ul v-if="exp.achievements?.length" class="mt-2 space-y-1">
              <li v-for="(ach, i) in exp.achievements" :key="i" class="text-sm text-slate-600 flex items-start gap-2">
                <span class="text-indigo-400 mt-1">•</span>
                {{ ach }}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Education -->
      <div v-if="cv.education?.length" class="card p-8 mb-6">
        <h2 class="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <GraduationCap class="w-5 h-5 text-indigo-600" /> Education
        </h2>
        <div class="space-y-4">
          <div v-for="edu in cv.education" :key="edu.id" class="relative pl-6 border-l-2 border-indigo-200">
            <div class="absolute -left-1.5 top-0 w-3 h-3 bg-indigo-500 rounded-full" />
            <div class="flex items-start justify-between">
              <div>
                <h3 class="font-semibold text-slate-900">{{ edu.degree }} in {{ edu.fieldOfStudy }}</h3>
                <p class="text-indigo-600 font-medium text-sm">{{ edu.institution }}</p>
              </div>
              <span class="text-xs text-slate-400 whitespace-nowrap">
                {{ formatDateRange(edu.startDate, edu.endDate) }}
              </span>
            </div>
            <p v-if="edu.gpa" class="text-xs text-slate-500 mt-1">GPA: {{ edu.gpa }}</p>
            <p v-if="edu.description" class="text-sm text-slate-600 mt-1">{{ edu.description }}</p>
          </div>
        </div>
      </div>

      <!-- Skills -->
      <div v-if="cv.skills?.length" class="card p-8 mb-6">
        <h2 class="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Wrench class="w-5 h-5 text-indigo-600" /> Skills
        </h2>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="skill in cv.skills"
            :key="skill.name"
            class="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium"
          >
            {{ skill.name }}
            <span v-if="skill.level" class="text-indigo-400 ml-1">· {{ skill.level }}</span>
          </span>
        </div>
      </div>

      <!-- Projects -->
      <div v-if="cv.projects?.length" class="card p-8 mb-6">
        <h2 class="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <FolderOpen class="w-5 h-5 text-indigo-600" /> Projects
        </h2>
        <div class="grid sm:grid-cols-2 gap-4">
          <div v-for="project in cv.projects" :key="project.name" class="p-4 bg-slate-50 rounded-xl">
            <h3 class="font-semibold text-slate-900">{{ project.name }}</h3>
            <p v-if="project.description" class="text-sm text-slate-600 mt-1">{{ project.description }}</p>
            <div v-if="project.technologies?.length" class="flex flex-wrap gap-1 mt-2">
              <span v-for="t in project.technologies" :key="t" class="text-xs px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full">
                {{ t }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Certifications -->
      <div v-if="cv.certifications?.length" class="card p-8 mb-6">
        <h2 class="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Award class="w-5 h-5 text-indigo-600" /> Certifications
        </h2>
        <div class="space-y-3">
          <div v-for="cert in cv.certifications" :key="cert.name" class="flex items-center gap-3">
            <div class="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center shrink-0">
              <Award class="w-4 h-4 text-indigo-600" />
            </div>
            <div>
              <p class="font-medium text-slate-800 text-sm">{{ cert.name }}</p>
              <p class="text-xs text-slate-400">{{ cert.issuer }} · {{ cert.date }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Languages -->
      <div v-if="cv.languages?.length" class="card p-8">
        <h2 class="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Languages class="w-5 h-5 text-indigo-600" /> Languages
        </h2>
        <div class="flex flex-wrap gap-2">
          <span v-for="lang in cv.languages" :key="lang.language"
            class="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-full text-sm"
          >
            {{ lang.language }} — {{ lang.proficiency }}
          </span>
        </div>
      </div>

      <!-- Footer -->
      <div class="text-center py-8">
        <p class="text-sm text-slate-400">
          Created with <router-link to="/" class="text-indigo-600 hover:text-indigo-700 font-medium">CVForge</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import aiService from '@/services/aiService'
import api from '@/services/api'
import {
  FileText, Download, Loader2, AlertCircle, Mail, Phone, MapPin,
  Globe, Linkedin, Github, Briefcase, GraduationCap, Wrench,
  FolderOpen, Award, Languages
} from 'lucide-vue-next'

const route = useRoute()
const cv = ref(null)
const loading = ref(true)
const error = ref(null)
const downloading = ref(false)

const userInitials = computed(() => {
  const name = cv.value?.personal?.fullName || 'U'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
})

onMounted(async () => {
  const id = route.params.id
  try {
    const response = await aiService.getPublicCv(id)
    cv.value = response.data.data
  } catch (err) {
    error.value = err.response?.data?.message || 'CV not found or not public'
  } finally {
    loading.value = false
  }
})

function formatDateRange(start, end, current) {
  const fmt = d => {
    if (!d) return ''
    const [y, m] = d.split('-')
    const date = new Date(y, m ? m - 1 : 0)
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }
  const startStr = fmt(start)
  const endStr = current ? 'Present' : fmt(end)
  return `${startStr} – ${endStr}`
}

async function downloadPdf() {
  downloading.value = true
  try {
    const response = await api.get(`/cvs/${route.params.id}/pdf`, {
      responseType: 'blob',
      timeout: 60000,
      transformResponse: [data => data]
    })
    const blob = new Blob([response.data], { type: 'application/pdf' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `CV-${cv.value?.personal?.fullName?.replace(/\s+/g, '_') || 'download'}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (err) {
    console.error('PDF download failed:', err)
  } finally {
    downloading.value = false
  }
}
</script>
