<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h2 class="text-2xl font-bold text-slate-900">My Applications</h2>
      <p class="text-slate-500 mt-1">Track and manage your job applications.</p>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-2 lg:grid-cols-5 gap-3">
      <div v-for="stat in statsList" :key="stat.label" class="card p-4">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-lg flex items-center justify-center" :class="stat.bg">
            <component :is="stat.icon" class="w-4 h-4" :class="stat.color" />
          </div>
          <div>
            <p class="text-xl font-bold text-slate-900">{{ stat.value }}</p>
            <p class="text-[10px] text-slate-500 uppercase tracking-wider font-medium">{{ stat.label }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filter Tabs -->
    <div class="flex gap-2 overflow-x-auto pb-1">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        @click="activeTab = tab.value"
        class="px-4 py-2 text-sm font-medium rounded-xl whitespace-nowrap transition-all"
        :class="activeTab === tab.value ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'"
      >
        {{ tab.label }}
        <span v-if="tab.count > 0" class="ml-1.5 px-1.5 py-0.5 text-xs rounded-full" :class="activeTab === tab.value ? 'bg-white/20' : 'bg-slate-100'">
          {{ tab.count }}
        </span>
      </button>
    </div>

    <!-- Loading -->
    <div v-if="appStore.loading && !appStore.applications.length" class="flex items-center justify-center py-16">
      <Loader2 class="w-8 h-8 animate-spin text-indigo-600" />
    </div>

    <!-- Empty State -->
    <div v-else-if="!filteredApplications.length" class="card p-12 text-center">
      <FolderOpen class="w-12 h-12 text-slate-300 mx-auto mb-4" />
      <h3 class="text-lg font-semibold text-slate-700">
        {{ activeTab === 'all' ? 'No applications yet' : `No ${activeTab} applications` }}
      </h3>
      <p class="text-slate-500 mt-1 mb-4">
        {{ activeTab === 'all' ? 'Start applying to jobs to track your progress.' : 'Try a different filter.' }}
      </p>
      <router-link v-if="activeTab === 'all'" to="/dashboard/jobs" class="btn-primary text-sm">
        <Briefcase class="w-4 h-4 mr-2" /> Browse Jobs
      </router-link>
    </div>

    <!-- Applications List -->
    <div v-else class="space-y-3">
      <div
        v-for="app in filteredApplications"
        :key="app.id"
        class="card p-5 hover:shadow-soft transition-all duration-300"
      >
        <div class="flex items-start justify-between gap-4">
          <div class="flex items-start gap-4 flex-1 min-w-0">
            <!-- Company Logo -->
            <div class="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 text-sm font-bold" :class="getCompanyColor(app.job?.company)">
              {{ (app.job?.company || '?').charAt(0) }}
            </div>

            <div class="min-w-0 flex-1">
              <router-link
                :to="`/dashboard/jobs/${app.jobId}`"
                class="font-semibold text-slate-800 hover:text-indigo-600 transition-colors"
              >
                {{ app.job?.title || 'Unknown Position' }}
              </router-link>
              <p class="text-sm text-slate-500">{{ app.job?.company || 'Unknown Company' }}</p>

              <div class="flex items-center gap-3 mt-2 flex-wrap">
                <span class="inline-flex items-center gap-1 text-xs text-slate-500">
                  <MapPin class="w-3.5 h-3.5" />
                  {{ app.job?.location || 'N/A' }}
                </span>
                <span class="inline-flex items-center gap-1 text-xs text-slate-500">
                  <Calendar class="w-3.5 h-3.5" />
                  Applied {{ formatDate(app.appliedAt || app.createdAt) }}
                </span>
                <span v-if="app.cvId" class="inline-flex items-center gap-1 text-xs text-emerald-600">
                  <FileText class="w-3.5 h-3.5" />
                  CV attached
                </span>
              </div>
            </div>
          </div>

          <!-- Status & Actions -->
          <div class="flex items-center gap-3 flex-shrink-0">
            <!-- Status Badge -->
            <div class="relative">
              <button
                @click="toggleStatusMenu(app.id)"
                class="px-3 py-1.5 text-xs font-semibold rounded-full cursor-pointer transition-colors"
                :class="statusColor(app.status)"
              >
                {{ statusLabel(app.status) }}
              </button>
              <div
                v-if="statusMenuOpen === app.id"
                class="absolute right-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-10 py-1 min-w-[160px]"
              >
                <button
                  v-for="s in allStatuses"
                  :key="s.value"
                  @click="changeStatus(app.id, s.value)"
                  class="flex items-center gap-2 px-3 py-2 text-sm w-full text-left hover:bg-slate-50 transition-colors"
                  :class="app.status === s.value ? 'font-semibold text-indigo-600' : 'text-slate-700'"
                >
                  <span class="w-2 h-2 rounded-full" :class="statusDotColor(s.value)" />
                  {{ s.label }}
                </button>
              </div>
            </div>

            <!-- Menu -->
            <div class="relative">
              <button @click="toggleMenu(app.id)" class="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
                <MoreVertical class="w-4 h-4 text-slate-400" />
              </button>
              <div
                v-if="menuOpen === app.id"
                class="absolute right-0 top-8 bg-white border border-slate-200 rounded-xl shadow-lg z-10 py-1 min-w-[160px]"
              >
                <router-link
                  :to="`/dashboard/jobs/${app.jobId}`"
                  class="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                  @click="menuOpen = null"
                >
                  <ExternalLink class="w-4 h-4" /> View Job
                </router-link>
                <button
                  @click="handleDelete(app.id)"
                  class="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                >
                  <Trash2 class="w-4 h-4" /> Delete
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Notes preview -->
        <div v-if="app.notes" class="mt-3 p-3 bg-slate-50 rounded-lg">
          <p class="text-xs text-slate-500 line-clamp-2">{{ app.notes }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useApplicationStore } from '@/stores/applicationStore'
import {
  FolderOpen, Briefcase, Calendar, MapPin, FileText, Loader2,
  MoreVertical, ExternalLink, Trash2, Clock, CheckCircle, XCircle, Award, Ban
} from 'lucide-vue-next'

const appStore = useApplicationStore()

const activeTab = ref('all')
const menuOpen = ref(null)
const statusMenuOpen = ref(null)

const allStatuses = [
  { value: 'applied', label: 'Applied' },
  { value: 'reviewing', label: 'Reviewing' },
  { value: 'interviewing', label: 'Interviewing' },
  { value: 'offered', label: 'Offered' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'withdrawn', label: 'Withdrawn' }
]

const tabs = computed(() => [
  { label: 'All', value: 'all', count: appStore.applications.length },
  { label: 'Applied', value: 'applied', count: appStore.stats.applied },
  { label: 'Interviewing', value: 'interviewing', count: appStore.stats.interviewing },
  { label: 'Offered', value: 'offered', count: appStore.stats.offered },
  { label: 'Rejected', value: 'rejected', count: appStore.stats.rejected },
])

const statsList = computed(() => [
  { label: 'Total', value: appStore.stats.total, icon: Briefcase, bg: 'bg-slate-100', color: 'text-slate-600' },
  { label: 'Applied', value: appStore.stats.applied, icon: Clock, bg: 'bg-blue-100', color: 'text-blue-600' },
  { label: 'Interviews', value: appStore.stats.interviewing, icon: CheckCircle, bg: 'bg-purple-100', color: 'text-purple-600' },
  { label: 'Offers', value: appStore.stats.offered, icon: Award, bg: 'bg-emerald-100', color: 'text-emerald-600' },
  { label: 'Rejected', value: appStore.stats.rejected, icon: XCircle, bg: 'bg-red-100', color: 'text-red-600' },
])

const filteredApplications = computed(() => {
  if (activeTab.value === 'all') return appStore.applications
  return appStore.applications.filter(a => a.status === activeTab.value)
})

onMounted(async () => {
  await appStore.fetchApplications()
  await appStore.fetchStats()
})

function toggleMenu(id) {
  statusMenuOpen.value = null
  menuOpen.value = menuOpen.value === id ? null : id
}

function toggleStatusMenu(id) {
  menuOpen.value = null
  statusMenuOpen.value = statusMenuOpen.value === id ? null : id
}

async function changeStatus(id, status) {
  statusMenuOpen.value = null
  try {
    await appStore.updateApplication(id, { status })
  } catch (err) {
    console.error('Status update failed:', err)
  }
}

async function handleDelete(id) {
  menuOpen.value = null
  if (confirm('Delete this application record?')) {
    try {
      await appStore.deleteApplication(id)
    } catch (err) {
      console.error('Delete failed:', err)
    }
  }
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function statusLabel(status) {
  const labels = {
    applied: 'Applied',
    reviewing: 'Reviewing',
    interviewing: 'Interview',
    offered: 'Offered',
    rejected: 'Rejected',
    withdrawn: 'Withdrawn'
  }
  return labels[status] || status
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

function statusDotColor(status) {
  const colors = {
    applied: 'bg-blue-500',
    reviewing: 'bg-amber-500',
    interviewing: 'bg-purple-500',
    offered: 'bg-emerald-500',
    rejected: 'bg-red-500',
    withdrawn: 'bg-slate-400'
  }
  return colors[status] || 'bg-slate-400'
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

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
