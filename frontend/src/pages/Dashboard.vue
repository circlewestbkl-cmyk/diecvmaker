<template>
  <div class="space-y-8">
    <!-- Welcome -->
    <div>
      <h2 class="text-2xl font-bold text-slate-900">
        Welcome back, {{ authStore.user?.name?.split(' ')[0] || 'User' }} 👋
      </h2>
      <p class="text-slate-500 mt-1">Here's an overview of your job search progress.</p>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="stat in dynamicStats" :key="stat.label" class="card p-5 hover:shadow-soft transition-all">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center" :class="stat.bg">
            <component :is="stat.icon" class="w-5 h-5" :class="stat.color" />
          </div>
          <div>
            <p class="text-2xl font-bold text-slate-900">{{ stat.value }}</p>
            <p class="text-xs text-slate-500">{{ stat.label }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div>
      <h3 class="text-lg font-semibold text-slate-800 mb-4">Quick Actions</h3>
      <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <router-link
          v-for="action in quickActions"
          :key="action.to"
          :to="action.to"
          class="card p-5 hover:shadow-soft transition-all duration-300 group"
        >
          <div class="w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110" :class="action.bg">
            <component :is="action.icon" class="w-5 h-5" :class="action.color" />
          </div>
          <h4 class="font-semibold text-slate-800">{{ action.label }}</h4>
          <p class="text-sm text-slate-500 mt-1">{{ action.desc }}</p>
        </router-link>
      </div>
    </div>

    <!-- Profile Completion -->
    <div class="card p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-slate-800">Profile Completion</h3>
        <span class="text-sm font-medium text-indigo-600">{{ profileCompletion }}%</span>
      </div>
      <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
        <div class="h-full bg-indigo-600 rounded-full transition-all duration-500" :style="{ width: profileCompletion + '%' }" />
      </div>
      <p class="text-sm text-slate-500 mt-3">
        {{ profileCompletion < 100 ? 'Complete your profile to improve your CV score.' : 'Your profile is complete! Great job.' }}
      </p>
    </div>

    <!-- Recent CVs -->
    <div v-if="cvStore.cvs.length" class="card p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-slate-800">Recent CVs</h3>
        <router-link to="/dashboard/cv" class="text-sm text-indigo-600 hover:text-indigo-700 font-medium">View All →</router-link>
      </div>
      <div class="space-y-3">
        <router-link
          v-for="cv in cvStore.cvs.slice(0, 3)"
          :key="cv.id"
          :to="`/dashboard/cv/${cv.id}/edit`"
          class="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors"
        >
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
              <FileText class="w-4 h-4 text-indigo-600" />
            </div>
            <div>
              <p class="font-medium text-slate-800 text-sm">{{ cv.title || 'Untitled CV' }}</p>
              <p class="text-xs text-slate-400">{{ cv.experiences?.length || 0 }} experiences • {{ cv.skills?.length || 0 }} skills</p>
            </div>
          </div>
          <span class="text-xs text-slate-400">{{ formatDate(cv.updatedAt) }}</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useCvStore } from '@/stores/cvStore'
import { useApplicationStore } from '@/stores/applicationStore'
import { FileText, ScanSearch, BookOpen, Briefcase, FolderOpen } from 'lucide-vue-next'

const authStore = useAuthStore()
const cvStore = useCvStore()
const appStore = useApplicationStore()

onMounted(async () => {
  try {
    await Promise.allSettled([
      cvStore.fetchCvs(),
      appStore.fetchApplications(),
      appStore.fetchStats()
    ])
  } catch (err) {
    console.error('Dashboard load error:', err)
  }
})

const dynamicStats = computed(() => [
  { label: 'Total CVs', value: cvStore.cvs?.length || 0, icon: FileText, bg: 'bg-indigo-50', color: 'text-indigo-600' },
  { label: 'Total Skills', value: cvStore.cvs?.reduce((sum, cv) => sum + (cv.skills?.length || 0), 0) || 0, icon: ScanSearch, bg: 'bg-emerald-50', color: 'text-emerald-600' },
  { label: 'Applications', value: appStore.stats?.total || 0, icon: FolderOpen, bg: 'bg-amber-50', color: 'text-amber-600' },
  { label: 'Interviews', value: appStore.stats?.interviewing || 0, icon: Briefcase, bg: 'bg-blue-50', color: 'text-blue-600' },
])

const quickActions = [
  { label: 'Create CV', desc: 'Build a new professional CV', to: '/dashboard/cv/create', icon: FileText, bg: 'bg-indigo-50', color: 'text-indigo-600' },
  { label: 'Check ATS', desc: 'Analyze your CV score', to: '/dashboard/ats', icon: ScanSearch, bg: 'bg-emerald-50', color: 'text-emerald-600' },
  { label: 'Cover Letter', desc: 'Generate a cover letter', to: '/dashboard/cover-letter', icon: BookOpen, bg: 'bg-amber-50', color: 'text-amber-600' },
  { label: 'Find Jobs', desc: 'Browse job listings', to: '/dashboard/jobs', icon: Briefcase, bg: 'bg-blue-50', color: 'text-blue-600' },
]

const profileCompletion = computed(() => {
  const profile = authStore.user
  if (!profile) return 0
  let fields = 0
  let filled = 0
  const checks = ['name', 'email']
  checks.forEach(f => { fields++; if (profile[f]) filled++ })
  return Math.round((filled / fields) * 100)
})

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
</script>
