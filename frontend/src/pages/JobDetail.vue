<template>
  <div class="space-y-6">
    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-16">
      <Loader2 class="w-8 h-8 animate-spin text-indigo-600" />
    </div>

    <template v-else-if="job">
      <!-- Back link & Header -->
      <div>
        <router-link to="/dashboard/jobs" class="text-sm text-slate-500 hover:text-indigo-600 mb-3 inline-flex items-center gap-1">
          <ArrowLeft class="w-4 h-4" /> Back to Jobs
        </router-link>

        <div class="flex items-start justify-between gap-4 flex-wrap">
          <div class="flex items-start gap-4">
            <div class="w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold" :class="getCompanyColor(job.company)">
              {{ job.company.charAt(0) }}
            </div>
            <div>
              <h2 class="text-2xl font-bold text-slate-900">{{ job.title }}</h2>
              <p class="text-slate-500 mt-1">{{ job.company }}</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button
              @click="handleSave"
              class="btn-secondary text-sm"
              :class="isSaved ? 'border-amber-300 text-amber-600' : ''"
            >
              <BookmarkCheck v-if="isSaved" class="w-4 h-4 mr-2" />
              <Bookmark v-else class="w-4 h-4 mr-2" />
              {{ isSaved ? 'Saved' : 'Save' }}
            </button>
            <button
              @click="showApplyModal = true"
              class="btn-primary"
              :disabled="hasApplied"
            >
              <Send v-if="!hasApplied" class="w-4 h-4 mr-2" />
              <CheckCircle v-else class="w-4 h-4 mr-2" />
              {{ hasApplied ? 'Applied' : 'Apply Now' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Content Grid -->
      <div class="grid lg:grid-cols-3 gap-6">
        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Job Info Cards -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div class="card p-4 text-center">
              <MapPin class="w-5 h-5 text-slate-400 mx-auto mb-2" />
              <p class="text-xs text-slate-500">Location</p>
              <p class="text-sm font-semibold text-slate-800 mt-1">{{ job.location }}</p>
            </div>
            <div class="card p-4 text-center">
              <Clock class="w-5 h-5 text-slate-400 mx-auto mb-2" />
              <p class="text-xs text-slate-500">Type</p>
              <p class="text-sm font-semibold text-slate-800 mt-1">{{ job.employmentType }}</p>
            </div>
            <div class="card p-4 text-center">
              <Building class="w-5 h-5 text-slate-400 mx-auto mb-2" />
              <p class="text-xs text-slate-500">Workplace</p>
              <p class="text-sm font-semibold text-slate-800 mt-1">{{ job.workplaceType }}</p>
            </div>
            <div class="card p-4 text-center">
              <DollarSign class="w-5 h-5 text-slate-400 mx-auto mb-2" />
              <p class="text-xs text-slate-500">Salary</p>
              <p class="text-sm font-semibold text-emerald-600 mt-1">
                {{ job.salaryMin || job.salaryMax ? `$${(job.salaryMin/1000).toFixed(0)}k - $${(job.salaryMax/1000).toFixed(0)}k` : 'N/A' }}
              </p>
            </div>
          </div>

          <!-- Description -->
          <div class="card p-6">
            <h3 class="text-lg font-semibold text-slate-800 mb-3">Job Description</h3>
            <p class="text-slate-600 leading-relaxed whitespace-pre-wrap">{{ job.description }}</p>
          </div>

          <!-- Requirements -->
          <div v-if="job.requirements?.length" class="card p-6">
            <h3 class="text-lg font-semibold text-slate-800 mb-3">Requirements</h3>
            <ul class="space-y-2">
              <li v-for="(req, i) in job.requirements" :key="i" class="flex items-start gap-2 text-sm text-slate-600">
                <CheckCircle class="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                {{ req }}
              </li>
            </ul>
          </div>

          <!-- Benefits -->
          <div v-if="job.benefits?.length" class="card p-6">
            <h3 class="text-lg font-semibold text-slate-800 mb-3">Benefits</h3>
            <ul class="space-y-2">
              <li v-for="(benefit, i) in job.benefits" :key="i" class="flex items-start gap-2 text-sm text-slate-600">
                <Gift class="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" />
                {{ benefit }}
              </li>
            </ul>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Skills -->
          <div class="card p-6">
            <h3 class="text-lg font-semibold text-slate-800 mb-3">Required Skills</h3>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="skill in (job.skills || [])"
                :key="skill"
                class="px-3 py-1.5 bg-indigo-50 text-indigo-700 text-sm font-medium rounded-lg"
              >
                {{ skill }}
              </span>
            </div>
          </div>

          <!-- Job Summary -->
          <div class="card p-6">
            <h3 class="text-lg font-semibold text-slate-800 mb-3">Job Summary</h3>
            <div class="space-y-3">
              <div class="flex items-center gap-3 text-sm">
                <Calendar class="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span class="text-slate-500">Posted:</span>
                <span class="font-medium text-slate-700">{{ formatDate(job.createdAt) }}</span>
              </div>
              <div class="flex items-center gap-3 text-sm">
                <Briefcase class="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span class="text-slate-500">Company:</span>
                <span class="font-medium text-slate-700">{{ job.company }}</span>
              </div>
              <div class="flex items-center gap-3 text-sm">
                <MapPin class="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span class="text-slate-500">Location:</span>
                <span class="font-medium text-slate-700">{{ job.location }}</span>
              </div>
            </div>
          </div>

          <!-- Application Status (if applied) -->
          <div v-if="hasApplied && application" class="card p-6 border-emerald-200">
            <h3 class="text-lg font-semibold text-emerald-600 mb-2 flex items-center gap-2">
              <CheckCircle class="w-5 h-5" />
              Applied
            </h3>
            <div class="space-y-2 text-sm">
              <div class="flex items-center justify-between">
                <span class="text-slate-500">Status:</span>
                <span class="px-2 py-0.5 text-xs font-semibold rounded-full" :class="statusColor(application.status)">
                  {{ application.status }}
                </span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-slate-500">Applied on:</span>
                <span class="font-medium text-slate-700">{{ formatDate(application.appliedAt || application.createdAt) }}</span>
              </div>
            </div>
            <button @click="handleWithdraw" class="btn-secondary text-sm w-full mt-4">
              <XCircle class="w-4 h-4 mr-2" />
              Withdraw Application
            </button>
          </div>
        </div>
      </div>
    </template>
  </div>

  <!-- Apply Modal -->
  <div v-if="showApplyModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" @click.self="showApplyModal = false">
    <div class="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-slate-800">Apply to {{ job?.company }}</h3>
        <button @click="showApplyModal = false" class="p-1 rounded-lg hover:bg-slate-100">
          <X class="w-5 h-5 text-slate-400" />
        </button>
      </div>

      <div>
        <label class="block text-sm font-medium text-slate-700 mb-1.5">Select CV (optional)</label>
        <select v-model="applyForm.cvId" class="input-field">
          <option value="">No CV attached</option>
          <option v-for="cv in cvStore.cvs" :key="cv.id" :value="cv.id">{{ cv.title }}</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-slate-700 mb-1.5">Cover Letter (optional)</label>
        <textarea v-model="applyForm.notes" class="input-field" rows="4" placeholder="Write a brief note or paste a cover letter..." />
      </div>

      <div class="flex items-center gap-3 pt-2">
        <button @click="showApplyModal = false" class="btn-secondary flex-1">Cancel</button>
        <button @click="handleApply" class="btn-primary flex-1" :disabled="applying">
          <Loader2 v-if="applying" class="w-4 h-4 animate-spin mr-2" />
          <Send v-else class="w-4 h-4 mr-2" />
          {{ applying ? 'Submitting...' : 'Submit Application' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useJobStore } from '@/stores/jobStore'
import { useCvStore } from '@/stores/cvStore'
import { useApplicationStore } from '@/stores/applicationStore'
import {
  ArrowLeft, MapPin, Clock, Building, DollarSign, Send, Bookmark, BookmarkCheck,
  CheckCircle, XCircle, Calendar, Briefcase, Gift, X, Loader2
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const jobStore = useJobStore()
const cvStore = useCvStore()
const applicationStore = useApplicationStore()

const loading = ref(true)
const applying = ref(false)
const showApplyModal = ref(false)
const isSaved = ref(false)

const applyForm = ref({ cvId: '', notes: '' })

const job = computed(() => jobStore.currentJob)

const hasApplied = computed(() => {
  if (!job.value) return false
  return applicationStore.hasApplied(job.value.id)
})

const application = computed(() => {
  if (!job.value) return null
  return applicationStore.getApplicationForJob(job.value.id)
})

onMounted(async () => {
  try {
    await jobStore.fetchJob(route.params.id)
    await cvStore.fetchCvs()
    await applicationStore.fetchApplications()
    if (job.value) {
      const saved = await jobStore.savedJobs.find(s => s.jobId === job.value.id)
      isSaved.value = !!saved
    }
  } catch (err) {
    router.push('/dashboard/jobs')
  } finally {
    loading.value = false
  }
})

async function handleSave() {
  try {
    const result = await jobStore.toggleSaveJob(job.value.id)
    isSaved.value = result
  } catch (err) {
    console.error('Save failed:', err)
  }
}

async function handleApply() {
  applying.value = true
  try {
    await applicationStore.applyToJob({
      jobId: job.value.id,
      cvId: applyForm.value.cvId || undefined,
      notes: applyForm.value.notes
    })
    showApplyModal.value = false
    applyForm.value = { cvId: '', notes: '' }
  } catch (err) {
    alert(err.response?.data?.message || 'Failed to submit application')
  } finally {
    applying.value = false
  }
}

async function handleWithdraw() {
  if (!application.value) return
  if (confirm('Are you sure you want to withdraw this application?')) {
    try {
      await applicationStore.deleteApplication(application.value.id)
    } catch (err) {
      console.error('Withdraw failed:', err)
    }
  }
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

function statusColor(status) {
  const colors = {
    applied: 'bg-blue-100 text-blue-700',
    reviewing: 'bg-amber-100 text-amber-700',
    interviewing: 'bg-purple-100 text-purple-700',
    offered: 'bg-emerald-100 text-emerald-700',
    rejected: 'bg-red-100 text-red-700',
    withdrawn: 'bg-slate-100 text-slate-600'
  }
  return colors[status] || 'bg-slate-100 text-slate-600'
}

const companyColors = {
  'Google': 'bg-blue-100 text-blue-600',
  'Microsoft': 'bg-emerald-100 text-emerald-600',
  'Meta': 'bg-indigo-100 text-indigo-600',
  'Amazon': 'bg-amber-100 text-amber-600',
  'Netflix': 'bg-red-100 text-red-600',
  'Spotify': 'bg-green-100 text-green-600',
  'Apple': 'bg-slate-100 text-slate-600',
}

function getCompanyColor(company) {
  return companyColors[company] || 'bg-indigo-100 text-indigo-600'
}
</script>
