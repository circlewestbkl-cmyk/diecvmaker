<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between flex-wrap gap-4">
      <div>
        <h2 class="text-2xl font-bold text-slate-900">Job Portal</h2>
        <p class="text-slate-500 mt-1">Browse available job listings.</p>
      </div>
      <div class="flex items-center gap-2 text-sm text-slate-500">
        <Briefcase class="w-4 h-4" />
        <span>{{ jobStore.totalJobs }} jobs found</span>
      </div>
    </div>

    <!-- Search & Filters -->
    <div class="card p-4">
      <div class="flex flex-col lg:flex-row gap-3">
        <!-- Search -->
        <div class="flex-1 relative">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            v-model="searchQuery"
            class="input-field pl-10"
            placeholder="Search by title, company, or keyword..."
            @input="debouncedSearch"
          />
        </div>

        <!-- Filter toggles -->
        <button
          @click="showFilters = !showFilters"
          class="btn-secondary text-sm"
        >
          <SlidersHorizontal class="w-4 h-4 mr-2" />
          Filters
          <span v-if="activeFilterCount" class="ml-2 px-2 py-0.5 bg-indigo-100 text-indigo-600 text-xs font-semibold rounded-full">
            {{ activeFilterCount }}
          </span>
        </button>

        <!-- Sort -->
        <select v-model="sortBy" class="input-field w-44" @change="handleSearch">
          <option value="newest">Newest First</option>
          <option value="salary">Highest Salary</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>

      <!-- Expanded Filters -->
      <div v-if="showFilters" class="mt-4 pt-4 border-t border-slate-100 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div>
          <label class="block text-xs font-medium text-slate-600 mb-1.5">Employment Type</label>
          <select v-model="filterEmployment" class="input-field text-sm" @change="handleSearch">
            <option value="">All Types</option>
            <option>Full-time</option>
            <option>Part-time</option>
            <option>Contract</option>
            <option>Freelance</option>
            <option>Internship</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-medium text-slate-600 mb-1.5">Workplace</label>
          <select v-model="filterWorkplace" class="input-field text-sm" @change="handleSearch">
            <option value="">All Locations</option>
            <option>Remote</option>
            <option>Hybrid</option>
            <option>On-site</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-medium text-slate-600 mb-1.5">Location</label>
          <input
            v-model="filterLocation"
            class="input-field text-sm"
            placeholder="e.g. Jakarta"
            @input="debouncedSearch"
          />
        </div>
        <div>
          <label class="block text-xs font-medium text-slate-600 mb-1.5">Skill</label>
          <input
            v-model="filterSkill"
            class="input-field text-sm"
            placeholder="e.g. Vue.js"
            @input="debouncedSearch"
          />
        </div>
        <div class="sm:col-span-2 lg:col-span-4 flex justify-end">
          <button @click="clearAllFilters" class="text-sm text-slate-500 hover:text-slate-700 font-medium">
            Clear All Filters
          </button>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="jobStore.loading && !jobStore.jobs.length" class="flex items-center justify-center py-16">
      <Loader2 class="w-8 h-8 animate-spin text-indigo-600" />
    </div>

    <!-- Empty State -->
    <div v-else-if="!jobStore.jobs.length" class="card p-12 text-center">
      <SearchX class="w-12 h-12 text-slate-300 mx-auto mb-4" />
      <h3 class="text-lg font-semibold text-slate-700">No jobs found</h3>
      <p class="text-slate-500 mt-1 mb-4">Try adjusting your search or filters.</p>
      <button @click="clearAllFilters" class="btn-secondary text-sm">Clear Filters</button>
    </div>

    <!-- Job Listings -->
    <div v-else class="space-y-3">
      <div
        v-for="job in jobStore.jobs"
        :key="job.id"
        class="card p-5 hover:shadow-soft transition-all duration-300 cursor-pointer group"
        @click="router.push(`/dashboard/jobs/${job.id}`)"
      >
        <div class="flex items-start justify-between gap-4">
          <div class="flex items-start gap-4 flex-1 min-w-0">
            <!-- Company Logo Placeholder -->
            <div class="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-lg font-bold" :class="getCompanyColor(job.company)">
              {{ job.company.charAt(0) }}
            </div>

            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-2 flex-wrap">
                <h3 class="font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">{{ job.title }}</h3>
                <span v-if="isJobNew(job.createdAt)" class="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-semibold rounded-full">NEW</span>
              </div>
              <p class="text-sm text-slate-500 mt-0.5">{{ job.company }}</p>

              <!-- Meta info -->
              <div class="flex items-center gap-3 mt-2 flex-wrap">
                <span class="inline-flex items-center gap-1 text-xs text-slate-500">
                  <MapPin class="w-3.5 h-3.5" />
                  {{ job.location }}
                </span>
                <span class="inline-flex items-center gap-1 text-xs text-slate-500">
                  <Clock class="w-3.5 h-3.5" />
                  {{ job.employmentType }}
                </span>
                <span class="inline-flex items-center gap-1 text-xs text-slate-500">
                  <Building class="w-3.5 h-3.5" />
                  {{ job.workplaceType }}
                </span>
                <span v-if="job.salaryMin || job.salaryMax" class="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
                  <DollarSign class="w-3.5 h-3.5" />
                  {{ formatSalary(job.salaryMin) }} - {{ formatSalary(job.salaryMax) }}
                </span>
              </div>

              <!-- Skills -->
              <div class="flex items-center gap-2 mt-3 flex-wrap">
                <span
                  v-for="skill in (job.skills || []).slice(0, 5)"
                  :key="skill"
                  class="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-lg"
                >
                  {{ skill }}
                </span>
                <span v-if="(job.skills || []).length > 5" class="text-xs text-slate-400">
                  +{{ job.skills.length - 5 }} more
                </span>
              </div>
            </div>
          </div>

          <!-- Save Button -->
          <button
            @click.stop="handleSaveJob(job.id)"
            class="p-2 rounded-lg hover:bg-slate-100 transition-colors flex-shrink-0"
            :class="jobStore.isJobSaved(job.id) ? 'text-amber-500' : 'text-slate-400 hover:text-slate-600'"
          >
            <BookmarkCheck v-if="jobStore.isJobSaved(job.id)" class="w-5 h-5" />
            <Bookmark v-else class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useJobStore } from '@/stores/jobStore'
import {
  Search, SearchX, Briefcase, MapPin, Clock, Building, DollarSign,
  SlidersHorizontal, Bookmark, BookmarkCheck, Loader2
} from 'lucide-vue-next'

const router = useRouter()
const jobStore = useJobStore()

const searchQuery = ref('')
const showFilters = ref(false)
const filterEmployment = ref('')
const filterWorkplace = ref('')
const filterLocation = ref('')
const filterSkill = ref('')
const sortBy = ref('newest')

let searchTimer = null

const activeFilterCount = computed(() => {
  let count = 0
  if (filterEmployment.value) count++
  if (filterWorkplace.value) count++
  if (filterLocation.value) count++
  if (filterSkill.value) count++
  return count
})

onMounted(async () => {
  await jobStore.fetchJobs()
  await jobStore.fetchSavedJobs()
})

function debouncedSearch() {
  if (searchTimer) clearTimeout(searchTimer)
  searchTimer = setTimeout(() => handleSearch(), 300)
}

async function handleSearch() {
  jobStore.setFilters({
    search: searchQuery.value,
    employmentType: filterEmployment.value,
    workplaceType: filterWorkplace.value,
    location: filterLocation.value,
    skill: filterSkill.value,
    sort: sortBy.value
  })
  await jobStore.fetchJobs()
}

function clearAllFilters() {
  searchQuery.value = ''
  filterEmployment.value = ''
  filterWorkplace.value = ''
  filterLocation.value = ''
  filterSkill.value = ''
  sortBy.value = 'newest'
  jobStore.clearFilters()
  handleSearch()
}

async function handleSaveJob(jobId) {
  try {
    await jobStore.toggleSaveJob(jobId)
  } catch (err) {
    console.error('Save job failed:', err)
  }
}

function formatSalary(amount) {
  if (!amount) return ''
  return '$' + (amount / 1000).toFixed(0) + 'k'
}

function isJobNew(dateStr) {
  if (!dateStr) return false
  const diff = Date.now() - new Date(dateStr).getTime()
  return diff < 7 * 24 * 60 * 60 * 1000 // 7 days
}

const companyColors = {
  'Google': 'bg-blue-100 text-blue-600',
  'Microsoft': 'bg-emerald-100 text-emerald-600',
  'Meta': 'bg-indigo-100 text-indigo-600',
  'Amazon': 'bg-amber-100 text-amber-600',
  'Netflix': 'bg-red-100 text-red-600',
  'Spotify': 'bg-green-100 text-green-600',
  'Apple': 'bg-slate-100 text-slate-600',
  'Tesla': 'bg-rose-100 text-rose-600',
}

function getCompanyColor(company) {
  return companyColors[company] || 'bg-indigo-100 text-indigo-600'
}
</script>
